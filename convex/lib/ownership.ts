import type { TableNames } from '../_generated/dataModel';

export const OWNED_TABLES = [
  'profiles',
  'plans',
  'planRecipes',
  'foodLogs',
  'weighIns',
  'chatThreads',
  'chatMessages',
  'pushTokens',
  'permissionGrants',
  'notifPrefs',
  'integrations',
  'forecastSnapshots',
  'aiCalls',
  'integrationSecrets',
  'foodLogDiagnostics',
  'cronRuns',
] as const satisfies readonly TableNames[];

export const MEDIA_TABLE = 'mediaAssets' as const satisfies TableNames;
