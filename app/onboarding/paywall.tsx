import { ScreenStub } from '@/components/ScreenStub';

export default function Paywall() {
  return <ScreenStub label="paywall" next={{ to: '/(tabs)/today', label: 'Start' }} />;
}
