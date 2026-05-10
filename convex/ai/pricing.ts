// USD per 1M tokens. Refresh manually when providers change pricing.
// Gemini 3 prices from https://ai.google.dev/gemini-api/docs/pricing
const PRICES: Record<string, { in: number; out: number }> = {
  'google:gemini-3.1-pro-preview': { in: 2, out: 12 },
  'google:gemini-3-flash-preview': { in: 0.5, out: 3 },
  'google:gemini-3.1-flash-lite': { in: 0.25, out: 1.5 },
  'google:gemini-3.1-flash-lite-preview': { in: 0.25, out: 1.5 },
  'anthropic:claude-sonnet-4-6': { in: 3, out: 15 },
  'free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning': { in: 0, out: 0 },
  'groq:whisper-large-v3': { in: 0, out: 0 },
};

export function estimateCostUsd(
  modelId: string,
  inTokens: number,
  outTokens: number,
): number | undefined {
  const p = PRICES[modelId];
  if (!p) return undefined;
  return (inTokens * p.in + outTokens * p.out) / 1_000_000;
}
