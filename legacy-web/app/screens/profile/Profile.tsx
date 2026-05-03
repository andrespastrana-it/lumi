'use client';

import { Header, IconChip, TabBar, S } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

export default function Profile({ go, state }: { go: (r: string) => void; state: AppState }) {
  const subLabel = state.subscription === 'annual' ? 'Annual · €59.99/yr'
                 : state.subscription === 'monthly' ? 'Monthly · €9.99/mo'
                 : 'Lifetime · €199';
  const intCount = Object.values(state.integrations).filter(Boolean).length;
  const notifCount = Object.values(state.notifPrefs).filter(Boolean).length;
  const items = [
    { l: 'Activity log',     v: 'This week · 4 workouts',          r: 'activity',      icon: 'workout', tone: 'green' as const },
    { l: 'Notifications',    v: `${notifCount} active reminders`,  r: 'notifications', icon: 'bell',    tone: 'butter' as const },
    { l: 'Coach tone',       v: state.coachTone,                   r: 'coachTone',     icon: 'coach',   tone: 'apricot' as const },
    { l: 'Units & locale',   v: `${state.units.mass} · ${state.units.height} · ${state.units.energy}`, r: 'units', icon: 'scale', tone: 'green' as const },
    { l: 'Integrations',     v: `${intCount} connected`,           r: 'integrations',  icon: 'heart',   tone: 'butter' as const },
    { l: 'Privacy',          v: state.privacy.share ? 'Sharing on' : 'Standard', r: 'privacy', icon: 'veg', tone: 'green' as const },
    { l: 'Subscription',     v: subLabel,                          r: 'subscription',  icon: 'sparkle', tone: 'apricotSolid' as const },
    { l: 'Meet Pip',         v: 'Coach moods',                     r: 'mascotGallery', icon: 'coach',   tone: 'apricot' as const },
    { l: 'Help & FAQ',       v: 'Get in touch',                    r: 'help',          icon: 'sparkle', tone: 'cream' as const },
    { l: 'Sign out',         v: '',                                r: 'welcome',       icon: 'add',     tone: 'cream' as const },
  ];
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <Header>Me</Header>
      <div style={{ padding: '4px 22px 0' }}>
        <div style={{ ...S.pillow, background: C.pillow, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => go('profileEdit')}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: C.apricot, color: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces",serif', fontSize: 28, fontWeight: 300 }}>M</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 28, color: C.ink, fontWeight: 400 }}>Marco</div>
            <div style={{ fontSize: 12, color: C.green, marginTop: 4, letterSpacing: '.04em', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: C.green }} />
              −2.6 kg · 21-day streak
            </div>
          </div>
          <Icon name="add" color={C.dim} size={14} />
        </div>
      </div>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ ...S.pillow, padding: 0 }}>
          {items.map(({ l, v, r, icon, tone }, i) => (
            <div key={l} onClick={() => go(r)} style={{ padding: '14px 18px', borderBottom: i < items.length - 1 ? `1px solid ${C.hair}` : 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
              <IconChip tone={tone} size={36}><Icon name={icon} color={tone === 'apricotSolid' ? '#fff' : tone === 'green' ? C.green : C.apricotDk} size={18} /></IconChip>
              <div style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
              <div style={{ fontSize: 12, color: C.dim }}>{v}</div>
              <Icon name="add" color={C.dim} size={14} />
            </div>
          ))}
        </div>
      </div>
      <TabBar active="me" go={go} />
    </div>
  );
}
