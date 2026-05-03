'use client';

import { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{
      width: 390,
      height: 844,
      background: '#1a1a1a',
      borderRadius: 54,
      padding: 12,
      boxShadow: '0 0 0 1px rgba(255,255,255,.08), 0 40px 80px -20px rgba(0,0,0,.8), 0 0 0 10px #0d0d0d, 0 0 0 11px rgba(255,255,255,.05)',
      position: 'relative',
      flexShrink: 0,
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: 44,
        background: '#FAF6F0',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 126,
          height: 37,
          background: '#000',
          borderRadius: 999,
          zIndex: 50,
        }} />

        <StatusBar />

        <div
          id="device-viewport"
          style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 54 }}
          className="hide-scroll"
        >
          {children}
        </div>

        {/* Home indicator */}
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 134,
          height: 5,
          background: '#1F1B17',
          borderRadius: 999,
          opacity: .18,
          zIndex: 20,
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 10, pointerEvents: 'none' }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1F1B17', letterSpacing: '-.2px' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="1" fill="#1F1B17" />
          <rect x="4.5" y="4.5" width="3" height="7.5" rx="1" fill="#1F1B17" />
          <rect x="9" y="2" width="3" height="10" rx="1" fill="#1F1B17" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1F1B17" fillOpacity=".3" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 9a1 1 0 110 2 1 1 0 010-2z" fill="#1F1B17" />
          <path d="M4.2 6.5a4.7 4.7 0 016.6 0" stroke="#1F1B17" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M1.5 3.8a8.5 8.5 0 0112 0" stroke="#1F1B17" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#1F1B17" strokeOpacity=".35" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="#1F1B17" />
          <path d="M23 4v4a2 2 0 000-4z" fill="#1F1B17" fillOpacity=".4" />
        </svg>
      </div>
    </div>
  );
}
