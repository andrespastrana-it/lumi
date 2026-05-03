import { ScreenStub } from '@/components/ScreenStub';

export default function Welcome() {
  return <ScreenStub label="welcome" next={{ to: '/onboarding/goal', label: "Let's begin" }} />;
}
