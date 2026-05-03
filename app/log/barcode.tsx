import { ScreenStub } from '@/components/ScreenStub';

export default function LogBarcode() {
  return <ScreenStub label="log-barcode" next={{ to: '/log/confirm', label: 'Confirm' }} />;
}
