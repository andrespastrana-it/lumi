import { ScreenStub } from '@/components/ScreenStub';

export default function Permissions() {
  return <ScreenStub label="permissions" next={{ to: '/onboarding/paywall', label: 'Continue' }} />;
}
