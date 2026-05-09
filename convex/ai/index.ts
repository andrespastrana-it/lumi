'use node';
import { generateText, streamText, generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';

export type Task = 'coach' | 'vision' | 'stt' | 'embed' | 'plan-gen';

const PROVIDERS = { anthropic, openai, groq } as const;
type ProviderKey = keyof typeof PROVIDERS;

const DEFAULTS: Record<Task, { provider: ProviderKey; model: string }> = {
  coach: { provider: 'anthropic', model: 'claude-sonnet-4-6' },
  vision: { provider: 'anthropic', model: 'claude-sonnet-4-6' },
  stt: { provider: 'groq', model: 'whisper-large-v3' },
  embed: { provider: 'openai', model: 'text-embedding-3-small' },
  'plan-gen': { provider: 'anthropic', model: 'claude-sonnet-4-6' },
};

function pick(t: Task) {
  const envKey = `AI_${t.toUpperCase().replace('-', '_')}_PROVIDER`;
  const override = process.env[envKey] as ProviderKey | undefined;
  return override && PROVIDERS[override]
    ? { provider: override, model: DEFAULTS[t].model }
    : DEFAULTS[t];
}

export const ai = {
  task(t: Task) {
    const { provider, model } = pick(t);
    const m = PROVIDERS[provider](model);
    return {
      generate: (opts: any) => generateText({ ...opts, model: m as any }),
      stream: (opts: any) => streamText({ ...opts, model: m as any }),
      generateObject: <T>(opts: {
        schema: z.ZodSchema<T>;
        prompt?: string;
        system?: string;
        messages?: any;
      }) => generateObject({ ...opts, model: m as any }) as any,
    };
  },
};
