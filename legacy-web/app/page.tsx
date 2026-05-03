'use client';

import { AppProvider } from '@/app/context/AppContext';
import { DeviceFrame } from '@/app/components/device-frame';

export default function Page() {
  return (
    <AppProvider>
      <DeviceFrame />
    </AppProvider>
  );
}
