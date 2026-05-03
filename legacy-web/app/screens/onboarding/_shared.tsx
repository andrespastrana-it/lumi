'use client';

import { ReactNode } from 'react';
import { Icon } from '@/app/lib/icons';
import { C, PILLOW_SHADOW } from '@/app/lib/tokens';

export function SelectCard({ selected, onClick, children }: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        background: selected ? C.pillow : 'rgba(255,251,241,.5)',
        borderRadius: 18,
        boxShadow: selected ? PILLOW_SHADOW : 'none',
        border: selected ? `1.5px solid ${C.apricot}` : '1.5px solid transparent',
        cursor: 'pointer',
      }}
    >
      {children}
    </div>
  );
}

export function CheckBadge() {
  return (
    <div style={{ width: 24, height: 24, borderRadius: 999, background: C.apricot, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name="check" color="#fff" size={14} />
    </div>
  );
}
