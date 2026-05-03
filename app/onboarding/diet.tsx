import { ScreenStub } from '@/components/ScreenStub';

export default function Diet() {
  return <ScreenStub label="diet" next={{ to: '/onboarding/schedule', label: 'Continue' }} />;
}
