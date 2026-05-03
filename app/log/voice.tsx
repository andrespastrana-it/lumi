import { ScreenStub } from '@/components/ScreenStub';

export default function LogVoice() {
  return <ScreenStub label="log-voice" next={{ to: '/log/confirm', label: 'Confirm' }} />;
}
