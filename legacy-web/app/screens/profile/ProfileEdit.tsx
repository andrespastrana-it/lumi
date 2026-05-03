'use client';

import { Header, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

export default function ProfileEdit({ go, state }: { go: (r: string) => void; state: AppState }) {
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Edit profile</Header>
      <div style={S.pad}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 18, gap: 12 }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, background: C.apricot, color: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces",serif', fontSize: 44, fontWeight: 300, position: 'relative' }}>
            M
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 32, height: 32, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="camera" color={C.apricot} size={16} />
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.apricot, fontWeight: 600, letterSpacing: '.04em' }}>Change photo</div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>About you</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {[['Name','Marco'],['Email','marco@kavrentech.com'],['Date of birth','12 May 1991'],['Sex','Male'],['Height', state.height + ' cm']].map(([k, v], i, arr) => (
            <div key={k} style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: C.ink }}>{k}</span>
              <span style={{ fontSize: 13, color: C.dim, fontFamily: '"Fraunces",serif' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Goal</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {[['Current weight', state.weight + ' kg'],['Target weight', state.target + ' kg'],['Pace','0.5 kg / week'],['Target date','Sep 14, 2026']].map(([k, v], i, arr) => (
            <div key={k} style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: C.ink }}>{k}</span>
              <span style={{ fontSize: 13, color: C.apricot, fontFamily: '"Fraunces",serif', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('profile')}>Save changes</button>
      </div>
    </div>
  );
}
