import { ScreenStub } from '@/components/ScreenStub';

export default function Recipe() {
  return <ScreenStub label="recipe" next={{ to: '/(tabs)/plan/shopping', label: 'Shopping list' }} />;
}
