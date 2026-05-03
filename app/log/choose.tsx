import { ScreenStub } from '@/components/ScreenStub';

export default function LogChoose() {
  return <ScreenStub label="log-choose" next={{ to: '/log/voice', label: 'Voice' }} />;
}
