import { ScreenStub } from '@/components/ScreenStub';

export default function LogPhoto() {
  return <ScreenStub label="log-photo" next={{ to: '/log/confirm', label: 'Confirm' }} />;
}
