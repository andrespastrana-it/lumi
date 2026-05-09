'use node';
import {
  generateText,
  streamText,
  generateObject,
  createProviderRegistry,
  tool,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { z } from 'zod';

export type Task = 'coach' | 'vision' | 'plan-gen';

const free = createOpenAICompatible({
  name: 'free',
  apiKey: process.env.FREE_API_KEY ?? '',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const registry = createProviderRegistry({ anthropic, openai, groq, free });

const DEFAULTS: Record<Task, string> = {
  coach: 'free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',
  vision: 'free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',
  'plan-gen': 'free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',
};

type TaskSetting = {
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  providerOptions?: Record<string, Record<string, unknown>>;
};

// NVIDIA Nemotron — non-thinking, low-temp config for structured output via tool calls.
// Thinking mode emits reasoning into content and breaks generateObject; we route
// generateObject through tool calls instead (see ai.task().generateObject below).
const NEMOTRON_SHORT: TaskSetting = {
  temperature: 0.2,
  maxOutputTokens: 2048,
  providerOptions: {
    free: { chat_template_kwargs: { enable_thinking: false } },
  },
};

const NEMOTRON_LONG: TaskSetting = {
  temperature: 0.2,
  maxOutputTokens: 16384,
  providerOptions: {
    free: { chat_template_kwargs: { enable_thinking: false } },
  },
};

const TASK_SETTINGS: Partial<Record<Task, TaskSetting>> = {
  'plan-gen': NEMOTRON_LONG,
  vision: NEMOTRON_SHORT,
  coach: NEMOTRON_SHORT,
};

const ENV_KEY: Record<string, string> = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
  groq: 'GROQ_API_KEY',
  free: 'FREE_API_KEY',
};

function resolveModelId(t: Task): string {
  const envVar = `AI_${t.toUpperCase().replace(/-/g, '_')}_MODEL`;
  return process.env[envVar] ?? DEFAULTS[t];
}

function assertProviderKey(provider: string) {
  const name = ENV_KEY[provider];
  if (!name) {
    throw new Error(`Unknown AI provider '${provider}' in task config`);
  }
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} missing on Convex deployment. Set with: npx convex env set ${name} <value>`,
    );
  }
  if (value.includes('placeholder')) {
    throw new Error(
      `${name} is still a placeholder. Set with: npx convex env set ${name} <real-key>`,
    );
  }
}

const validated = new Set<string>();

type ModelId = Parameters<typeof registry.languageModel>[0];

function applySettings(opts: any, settings: TaskSetting) {
  const merged: any = { ...settings, ...opts };
  if (settings.providerOptions || opts?.providerOptions) {
    merged.providerOptions = {
      ...(settings.providerOptions ?? {}),
      ...(opts?.providerOptions ?? {}),
    };
  }
  return merged;
}

export const ai = {
  task(t: Task) {
    const modelId = resolveModelId(t);
    const provider = modelId.split(':')[0];
    if (!validated.has(provider)) {
      assertProviderKey(provider);
      validated.add(provider);
    }
    const model = registry.languageModel(modelId as ModelId);
    const settings = TASK_SETTINGS[t] ?? {};

    return {
      modelId,
      generate: (opts: any) =>
        generateText({ ...applySettings(opts, settings), model }),
      stream: (opts: any) =>
        streamText({ ...applySettings(opts, settings), model }),
      generateObject: async <T>(opts: {
        schema: z.ZodSchema<T>;
        prompt?: string;
        system?: string;
        messages?: any;
        temperature?: number;
        topP?: number;
        maxOutputTokens?: number;
        providerOptions?: Record<string, Record<string, unknown>>;
      }) => {
        // NVIDIA NIM via openai-compatible doesn't support response_format:json_schema.
        // Route through forced tool call instead — nemotron supports tool calling.
        if (provider === 'free') {
          return generateObjectViaTool(model, opts, settings);
        }
        return generateObject({
          ...applySettings(opts, settings),
          model,
        } as any) as any;
      },
    };
  },
};

async function generateObjectViaTool<T>(
  model: any,
  opts: {
    schema: z.ZodSchema<T>;
    prompt?: string;
    system?: string;
    messages?: any;
    temperature?: number;
    topP?: number;
    maxOutputTokens?: number;
    providerOptions?: Record<string, Record<string, unknown>>;
  },
  settings: TaskSetting,
): Promise<{ object: T; usage: any }> {
  const { schema, ...rest } = opts;
  const merged = applySettings(rest, settings);
  const result = await generateText({
    ...merged,
    model,
    tools: {
      answer: tool({
        description: 'Return the structured answer matching the requested schema.',
        inputSchema: schema as any,
      }),
    },
    toolChoice: { type: 'tool', toolName: 'answer' },
  });
  const call: any = (result as any).toolCalls?.find?.(
    (c: any) => c.toolName === 'answer',
  );
  let args = call?.input ?? call?.args;
  // Some openai-compatible providers double-encode tool input as a JSON string,
  // sometimes nested. Decode until we get a non-string (max 3 levels for safety).
  for (let i = 0; i < 3 && typeof args === 'string'; i++) {
    try {
      args = JSON.parse(args);
    } catch {
      break;
    }
  }
  if (args !== undefined) {
    return { object: schema.parse(args) as T, usage: (result as any).usage };
  }
  // Fallback: model emitted text instead of calling the tool. Try JSON parse.
  const text = (result as any).text ?? '';
  try {
    const parsed = JSON.parse(text);
    return { object: schema.parse(parsed) as T, usage: (result as any).usage };
  } catch {
    throw new Error(
      `Model did not call the 'answer' tool and text is not valid JSON: ${String(text).slice(0, 300)}`,
    );
  }
}
