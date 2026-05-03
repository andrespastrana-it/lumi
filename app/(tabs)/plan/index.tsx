import { ScreenStub } from '@/components/ScreenStub';

export default function Plan() {
  return <ScreenStub label="plan" next={{ to: '/(tabs)/plan/recipe', label: 'Open recipe' }} />;
}
