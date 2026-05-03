import { ScreenStub } from '@/components/ScreenStub';

export default function Profile() {
  return <ScreenStub label="profile" next={{ to: '/(tabs)/me/edit', label: 'Edit profile' }} />;
}
