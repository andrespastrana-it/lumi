import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.daily(
  'purgeAiCalls',
  { hourUTC: 3, minuteUTC: 0 },
  internal.retention.purgeAiCallsDaily,
);
crons.daily(
  'purgeForecastSnapshots',
  { hourUTC: 3, minuteUTC: 10 },
  internal.retention.purgeForecastSnapshotsDaily,
);
crons.daily(
  'purgeCronRuns',
  { hourUTC: 3, minuteUTC: 20 },
  internal.retention.purgeCronRunsDaily,
);
crons.daily(
  'purgeFoodLogDiagnostics',
  { hourUTC: 3, minuteUTC: 30 },
  internal.retention.purgeFoodLogDiagnosticsDaily,
);
crons.daily(
  'purgeDeletedFoodLogs',
  { hourUTC: 3, minuteUTC: 40 },
  internal.retention.purgeDeletedFoodLogsDaily,
);
crons.daily(
  'purgeArchivedPlans',
  { hourUTC: 3, minuteUTC: 50 },
  internal.retention.purgeArchivedPlansDaily,
);

export default crons;
