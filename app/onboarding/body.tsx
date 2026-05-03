import { ScreenStub } from '@/components/ScreenStub';

export default function Body() {
  return <ScreenStub label="body" next={{ to: '/onboarding/activity-level', label: 'Continue' }} />;
}
