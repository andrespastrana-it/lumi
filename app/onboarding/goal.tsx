import { ScreenStub } from '@/components/ScreenStub';

export default function Goal() {
  return <ScreenStub label="goal" next={{ to: '/onboarding/body', label: 'Continue' }} />;
}
