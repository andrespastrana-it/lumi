import { ScreenStub } from '@/components/ScreenStub';

export default function Compute() {
  return <ScreenStub label="compute" next={{ to: '/onboarding/plan-reveal', label: 'Continue' }} />;
}
