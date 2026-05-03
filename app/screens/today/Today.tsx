'use client';

import { S, TabBar, FAB } from '@/app/components/ui';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';
import { HeaderGreeting } from './HeaderGreeting';
import { CaloriesCard } from './CaloriesCard';
import { StreakBanner } from './StreakBanner';
import { MealsList } from './MealsList';
import { WeighInBanner } from './WeighInBanner';

const EATEN = 1108, TOTAL = 1780;

export default function Today({ go, state }: { go: (r: string) => void; state: AppState }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110, background: C.creamHi }}>
      <HeaderGreeting />
      <CaloriesCard eaten={EATEN} total={TOTAL} />
      <StreakBanner go={go} />
      <MealsList go={go} />
      {state.weighInDue && <WeighInBanner go={go} />}

      <button style={{ ...S.ctaLine, marginTop: 12 }} onClick={() => go('badday')}>Had a rough day yesterday</button>

      <FAB go={go} />
      <TabBar active="today" go={go} />
    </div>
  );
}
