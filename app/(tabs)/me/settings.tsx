import { ScreenStub } from '@/components/ScreenStub';

export default function ProfileSettings() {
  return <ScreenStub label="settings" next={{ to: '/(tabs)/me/coach-tone', label: 'Coach tone' }} />;
}
