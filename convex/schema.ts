import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    deletedAt: v.optional(v.number()),
    deletionStartedAt: v.optional(v.number()),
    purgeStatus: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('running'),
        v.literal('complete'),
        v.literal('failed'),
      ),
    ),
  }).index('by_clerk', ['clerkUserId']),

  profiles: defineTable({
    userId: v.id('users'),
    goal: v.union(v.literal('lose'), v.literal('maintain'), v.literal('gain')),
    heightCm: v.number(),
    startWeightKg: v.number(),
    targetWeightKg: v.number(),
    age: v.number(),
    sex: v.optional(v.string()),
    activity: v.union(
      v.literal('sed'),
      v.literal('light'),
      v.literal('mod'),
      v.literal('active'),
    ),
    diet: v.array(v.string()),
    mealTimes: v.object({
      wake: v.string(),
      breakfast: v.string(),
      lunch: v.string(),
      dinner: v.string(),
      sleep: v.string(),
    }),
    coachTone: v.union(
      v.literal('Warm'),
      v.literal('Direct'),
      v.literal('Cheerleader'),
      v.literal('Stoic'),
    ),
    units: v.object({
      mass: v.string(),
      height: v.string(),
      energy: v.string(),
      volume: v.string(),
      firstDay: v.string(),
      lang: v.string(),
    }),
    privacy: v.object({
      analytics: v.boolean(),
      share: v.boolean(),
      research: v.boolean(),
    }),
    tz: v.string(),
    activePlanId: v.optional(v.id('plans')),
  }).index('by_user', ['userId']),

  plans: defineTable({
    userId: v.id('users'),
    dailyKcal: v.number(),
    proteinG: v.number(),
    carbG: v.number(),
    fatG: v.number(),
    recipes: v.array(
      v.object({
        id: v.string(),
        day: v.number(),
        slot: v.union(
          v.literal('breakfast'),
          v.literal('lunch'),
          v.literal('dinner'),
          v.literal('snack'),
        ),
        name: v.string(),
        kcal: v.number(),
        proteinG: v.number(),
        carbG: v.number(),
        fatG: v.number(),
        ingredients: v.array(
          v.object({ id: v.string(), name: v.string(), qty: v.string() }),
        ),
        method: v.array(v.string()),
        heroTone: v.optional(v.string()),
        isFavorite: v.optional(v.boolean()),
        doneAt: v.optional(v.number()),
      }),
    ),
    shopping: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        qty: v.string(),
        recipeIds: v.array(v.string()),
        checked: v.boolean(),
        checkedAt: v.optional(v.number()),
      }),
    ),
    generator: v.union(v.literal('rules'), v.literal('llm')),
    activeFrom: v.number(),
    activeTo: v.number(),
    status: v.optional(v.union(v.literal('active'), v.literal('archived'))),
  })
    .index('by_user', ['userId'])
    .index('by_user_active', ['userId', 'activeFrom']),

  planRecipes: defineTable({
    userId: v.id('users'),
    planId: v.id('plans'),
    legacyRecipeId: v.optional(v.string()),
    day: v.number(),
    slot: v.union(
      v.literal('breakfast'),
      v.literal('lunch'),
      v.literal('dinner'),
      v.literal('snack'),
    ),
    name: v.string(),
    kcal: v.number(),
    proteinG: v.number(),
    carbG: v.number(),
    fatG: v.number(),
    ingredients: v.array(
      v.object({ id: v.string(), name: v.string(), qty: v.string() }),
    ),
    method: v.array(v.string()),
    heroTone: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    doneAt: v.optional(v.number()),
  })
    .index('by_plan', ['planId'])
    .index('by_user', ['userId'])
    .index('by_user_plan', ['userId', 'planId']),

  foodLogs: defineTable({
    userId: v.id('users'),
    consumedAt: v.number(),
    source: v.union(
      v.literal('photo'),
      v.literal('voice'),
      v.literal('barcode'),
      v.literal('search'),
      v.literal('manual'),
    ),
    name: v.string(),
    kcal: v.number(),
    proteinG: v.number(),
    carbG: v.number(),
    fatG: v.number(),
    servingSizeG: v.optional(v.number()),
    barcode: v.optional(v.string()),
    photoAssetId: v.optional(v.id('mediaAssets')),
    audioAssetId: v.optional(v.id('mediaAssets')),
    rawAi: v.optional(v.any()),
    confidence: v.optional(v.number()),
    status: v.union(
      v.literal('draft'),
      v.literal('confirmed'),
      v.literal('deleted'),
    ),
    fromRecipeId: v.optional(v.string()),
    fromPlanId: v.optional(v.id('plans')),
    fromPlanRecipeId: v.optional(v.id('planRecipes')),
  })
    .index('by_user', ['userId'])
    .index('by_user_consumedAt', ['userId', 'consumedAt'])
    .index('by_user_status', ['userId', 'status'])
    .index('by_photo_asset', ['photoAssetId'])
    .index('by_audio_asset', ['audioAssetId']),

  weighIns: defineTable({
    userId: v.id('users'),
    measuredAt: v.number(),
    weightKg: v.number(),
    source: v.union(v.literal('manual'), v.literal('health_sync')),
  })
    .index('by_user', ['userId'])
    .index('by_user_measuredAt', ['userId', 'measuredAt']),

  chatThreads: defineTable({
    userId: v.id('users'),
    title: v.string(),
    lastMessageAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_lastMessageAt', ['userId', 'lastMessageAt']),

  chatMessages: defineTable({
    threadId: v.id('chatThreads'),
    userId: v.id('users'),
    role: v.union(
      v.literal('user'),
      v.literal('assistant'),
      v.literal('tool'),
    ),
    content: v.string(),
    toolCalls: v.optional(v.any()),
    providerModel: v.optional(v.string()),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
    cancelled: v.optional(v.boolean()),
  })
    .index('by_thread', ['threadId'])
    .index('by_user', ['userId'])
    .index('by_user_thread', ['userId', 'threadId']),

  pushTokens: defineTable({
    userId: v.id('users'),
    expoPushToken: v.string(),
    platform: v.union(v.literal('ios'), v.literal('android')),
    lastSeenAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_token', ['expoPushToken']),

  permissionGrants: defineTable({
    userId: v.id('users'),
    notif: v.boolean(),
    health: v.boolean(),
    cam: v.boolean(),
    mic: v.boolean(),
  }).index('by_user', ['userId']),

  notifPrefs: defineTable({
    userId: v.id('users'),
    summary: v.boolean(),
    mealNudge: v.boolean(),
    weighIn: v.boolean(),
    wins: v.boolean(),
    plateauAlert: v.boolean(),
    weekly: v.boolean(),
    quiet: v.boolean(),
  }).index('by_user', ['userId']),

  integrations: defineTable({
    userId: v.id('users'),
    appleHealth: v.boolean(),
    googleFit: v.boolean(),
    fitbit: v.boolean(),
    withings: v.boolean(),
    strava: v.boolean(),
    glovo: v.boolean(),
    tokens: v.optional(v.any()),
  }).index('by_user', ['userId']),

  mediaAssets: defineTable({
    userId: v.id('users'),
    kind: v.union(v.literal('photo'), v.literal('audio')),
    storageId: v.id('_storage'),
    bytes: v.number(),
    mime: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_storage', ['storageId']),

  cronRuns: defineTable({
    userId: v.optional(v.id('users')),
    jobName: v.string(),
    scopeKey: v.string(),
    ranAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_job_scope', ['jobName', 'scopeKey']),

  forecastSnapshots: defineTable({
    userId: v.id('users'),
    range: v.union(v.literal('7d'), v.literal('30d')),
    generatedAt: v.number(),
    payload: v.any(),
  })
    .index('by_user', ['userId'])
    .index('by_user_range', ['userId', 'range']),

  aiCalls: defineTable({
    userId: v.id('users'),
    task: v.string(),
    providerModel: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    ms: v.number(),
    ok: v.boolean(),
    errorCode: v.optional(v.string()),
    costUsd: v.optional(v.number()),
  }).index('by_user', ['userId']),

  integrationSecrets: defineTable({
    userId: v.id('users'),
    provider: v.string(),
    encryptedPayload: v.string(),
    expiresAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_provider', ['userId', 'provider']),

  foodLogDiagnostics: defineTable({
    userId: v.id('users'),
    foodLogId: v.id('foodLogs'),
    task: v.string(),
    providerModel: v.optional(v.string()),
    payload: v.any(),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_log', ['foodLogId']),
});
