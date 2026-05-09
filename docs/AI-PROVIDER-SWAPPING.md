# AI Provider Swapping — Beginner Walkthrough

A plain-English explainer for how Lumi talks to AI providers (Anthropic / OpenAI / Groq) and how the registry-based router in `convex/ai/index.ts` works.

---

## Current state — Option B is shipped

`convex/ai/index.ts` uses `createProviderRegistry` from the Vercel AI SDK. To swap a task to a different provider, set ONE env var on the Convex deployment:

```
AI_<TASK>_MODEL=<provider>:<model>
```

Examples:

```powershell
# Use OpenAI GPT-4o for plan generation
npx convex env set AI_PLAN_GEN_MODEL openai:gpt-4o

# Use Groq Llama for the coach
npx convex env set AI_COACH_MODEL groq:llama-3.3-70b-versatile

# Revert: just unset the var, falls back to the default in DEFAULTS
npx convex env unset AI_PLAN_GEN_MODEL
```

Defaults live in the `DEFAULTS` map at the top of `convex/ai/index.ts`. Tasks: `coach`, `vision`, `plan-gen` — all currently default to `free:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` (multimodal, JSON output, tool calling, 256k context — covers all three tasks).

Registered providers: `anthropic`, `openai`, `groq`, `free` (NVIDIA NIM via OpenAI-compatible adapter — set `FREE_API_KEY` on Convex env). Anthropic / OpenAI / Groq are still wired and ready to use as overrides — just set the corresponding key and flip a task via `AI_<TASK>_MODEL`.

The router also fails fast at module load if a needed API key is missing or still a placeholder — the action errors with a clear message instead of leaking a 401 from the AI vendor.

The rest of this file is the original explainer kept for reference.

---

---

## What "provider" means here

Three companies sell AI models:

- **Anthropic** → makes Claude
- **OpenAI** → makes GPT-4, GPT-5
- **Groq** → runs other people's models really fast (like Whisper for audio)

Your code uses all three. You call them through one library called the **Vercel AI SDK**, which has tiny adapters (one per company) so you write `anthropic('claude-sonnet-4-6')` or `openai('gpt-4o')` and it handles the HTTP calls, auth, response shape.

Each company has its own:

- API key (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`)
- Model names (Anthropic: `claude-sonnet-4-6`, OpenAI: `gpt-4o`, Groq: `whisper-large-v3`)

A "provider" in this context = one of those three companies. Swapping providers = "today plan generation goes to Anthropic, tomorrow I want it to go to OpenAI instead."

---

## Why you'd want to swap

- **Cost** — GPT-4o is cheaper than Claude Sonnet for some tasks
- **Speed** — Groq is 10× faster for transcription
- **Outage** — Anthropic goes down → fail over to OpenAI so your app still works
- **A/B test** — does Claude or GPT write better meal plans?

---

## What your code does today

In `convex/ai/index.ts` you have a "router" — a small function that picks which provider to use for each task:

```ts
const DEFAULTS = {
  'plan-gen': { provider: 'anthropic', model: 'claude-sonnet-4-6' },
  'coach':    { provider: 'anthropic', model: 'claude-sonnet-4-6' },
  // ...
};
```

And a way to override via environment variable:

```ts
// If AI_PLAN_GEN_PROVIDER=openai exists, use openai
// Otherwise use the default (anthropic)
```

So in theory you could go to your Convex dashboard, add `AI_PLAN_GEN_PROVIDER=openai`, redeploy, and plan generation now goes to OpenAI. **No code change.** That's the swappability you wanted.

---

## The bug

When the override fires, the code does this:

```ts
return { provider: 'openai', model: DEFAULTS[t].model };
//                            ^^^^^^^^^^^^^^^^^^^^
//                            This is still 'claude-sonnet-4-6'
```

So it tells OpenAI "give me Claude" — which is like walking into McDonald's and ordering a Whopper. OpenAI returns 400 "model not found." The provider swapped but the model name stuck behind, because Claude is an Anthropic-only thing.

To actually make a clean swap today you'd have to edit the source code and change both the provider AND the model in `DEFAULTS`. Not "easy."

---

## The two fixes

### Option A — quick patch (5 lines)

Let env vars control both:

```
AI_PLAN_GEN_PROVIDER=openai
AI_PLAN_GEN_MODEL=gpt-4o
```

Now you set two env vars in the Convex dashboard, the router pairs them, OpenAI gets a model name it understands. Done.

### Option B — provider registry (the "grown-up" way)

The Vercel AI SDK has a built-in helper called `createProviderRegistry` that does exactly this — bundles provider+model into a single string like `"openai:gpt-4o"` or `"anthropic:claude-sonnet-4-6"`. Then your env var is just:

```
AI_PLAN_GEN_MODEL=openai:gpt-4o
```

One variable. Provider and model can never get out of sync because they travel together. And the registry gives you middleware hooks — meaning you can wrap every AI call with logging, retry, or "if Anthropic fails, automatically try OpenAI" behavior in one place instead of sprinkled through every task.

Option B is roughly the same amount of code as A, but it scales better when you add things like:

- **Telemetry** — "how much did each task cost this month?"
- **Fallback** — "if Anthropic 500s, try OpenAI"
- **Fail-fast on missing keys** — catch placeholder strings (`sk-ant-placeholder`) at module load instead of mid-request

---

## TL;DR

You wanted "easy provider swapping." You **almost** have it — the env-var hook is there, but it's wired wrong (model name doesn't follow the provider). Either patch the bug (A) or upgrade to the registry pattern (B). Both keep your code shape the same; the rest of your app keeps calling `ai.task('plan-gen').generateObject(...)` and doesn't care which provider answers.
