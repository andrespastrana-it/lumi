import { ScreenStub } from '@/components/ScreenStub';

export default function Forecast() {
  return <ScreenStub label="forecast" next={{ to: '/(tabs)/stats/weigh-in', label: 'Weigh in' }} />;
}
