import { ScreenStub } from '@/components/ScreenStub';

export default function LogSearch() {
  return <ScreenStub label="log-search" next={{ to: '/log/confirm', label: 'Confirm' }} />;
}
