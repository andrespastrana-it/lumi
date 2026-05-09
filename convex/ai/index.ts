'use node';
import {
  generateText,
  streamText,
  generateObject,
  createProviderRegistry,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';

export type Task = 'coach' | 'vision' | 'plan-gen';

const registry = createProviderRegistry({ anthropic, openai, groq });

const DEFAULTS: Record<Task, string> = {
  coach: 'anthropic:claude-sonnet-4-6',
  vision: 'anthropic:claude-sonnet-4-6',
  'plan-gen': 'anthropic:claude-sonnet-4-6',
};

const ENV_KEY: Record<string, string> = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
  groq: 'GROQ_API_KEY',
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

const usedProviders = new Set<string>();
for (const t of Object.keys(DEFAULTS) as Task[]) {
  usedProviders.add(resolveModelId(t).split(':')[0]);
}
for (const p of usedProviders) assertProviderKey(p);

type ModelId = Parameters<typeof registry.languageModel>[0];

export const ai = {
  task(t: Task) {
    const model = registry.languageModel(resolveModelId(t) as ModelId);
    return {
      generate: (opts: any) => generateText({ ...opts, model }),
      stream: (opts: any) => streamText({ ...opts, model }),
      generateObject: <T>(opts: {
        schema: z.ZodSchema<T>;
        prompt?: string;
        system?: string;
        messages?: any;
      }) => generateObject({ ...opts, model }) as any,
    };
  },
};
