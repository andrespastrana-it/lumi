'use client';

import { useApp } from '@/app/context/AppContext';
import { ALL_SCREENS } from '@/app/lib/screen-groups';
import { Screen } from '@/app/components/screen-router';
import { PhoneFrame } from '@/app/components/phone-frame';

export function DeviceFrame() {
  const { route, navigate, goBack, state, set } = useApp();

  const idx = ALL_SCREENS.findIndex(s => s.route === route);
  const total = ALL_SCREENS.length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1a140e' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 40px' }}>
        {/* Top controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, width: 390 }}>
          <button
            onClick={goBack}
            style={{ background: 'rgba(255,255,255,.06)', border: 0, borderRadius: 8, padding: '6px 14px', fontSize: 12, color: 'rgba(242,234,216,.6)', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ‹ Back
          </button>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(242,234,216,.3)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            {ALL_SCREENS.find(s => s.route === route)?.label ?? route}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(242,234,216,.25)', fontFamily: 'inherit' }}>
            {idx + 1} / {total}
          </div>
        </div>

        <PhoneFrame>
          <Screen route={route} go={navigate} state={state} set={set} />
        </PhoneFrame>

        <div style={{ marginTop: 16, fontSize: 10, color: 'rgba(242,234,216,.2)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Click sidebar to jump · scroll inside phone to explore
        </div>
      </div>
    </div>
  );
}
