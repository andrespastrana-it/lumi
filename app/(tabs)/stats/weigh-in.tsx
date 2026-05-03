import { ScreenStub } from '@/components/ScreenStub';

export default function WeighIn() {
  return <ScreenStub label="weigh-in" next={{ to: '/(tabs)/stats/weigh-in-result', label: 'Submit' }} />;
}
