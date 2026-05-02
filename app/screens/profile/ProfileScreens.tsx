'use client';

import { useState } from 'react';
import Mascot from '@/app/components/Mascot';
import type { MoodType } from '@/app/components/Mascot';
import { Header, IconChip, TabBar, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C } from '@/app/lib/tokens';
import { AppState } from '@/app/context/AppContext';

// ── Profile ──────────────────────────────────────────────────────
export function Profile({ go }: { go: (r: string) => void }) {
  const items = [
    { l: 'Activity log',     v: 'This week · 4 workouts', r: 'activity2', icon: 'workout', tone: 'green' as const },
    { l: 'Notifications',   v: '3 active reminders',     r: 'notifications', icon: 'bell', tone: 'butter' as const },
    { l: 'Coach tone',      v: 'Warm',                   r: 'coachTone', icon: 'coach', tone: 'apricot' as const },
    { l: 'Units & locale',  v: 'kg · cm · kcal',         r: 'units', icon: 'scale', tone: 'green' as const },
    { l: 'Integrations',    v: 'Apple Health · Glovo',   r: 'integrations', icon: 'heart', tone: 'butter' as const },
    { l: 'Privacy',         v: 'Standard',               r: 'privacy', icon: 'veg', tone: 'green' as const },
    { l: 'Subscription',    v: 'Trial · 5 days left',    r: 'subscription', icon: 'sparkle', tone: 'apricotSolid' as const },
    { l: 'Meet Pip',        v: 'Coach moods',            r: 'mascotGallery', icon: 'coach', tone: 'apricot' as const },
    { l: 'Help & FAQ',      v: 'Get in touch',           r: 'help', icon: 'sparkle', tone: 'cream' as const },
    { l: 'Sign out',        v: '',                       r: 'welcome', icon: 'add', tone: 'cream' as const },
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

// ── ProfileEdit ──────────────────────────────────────────────────
export function ProfileEdit({ go, state }: { go: (r: string) => void; state: AppState }) {
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

// ── CoachTone ────────────────────────────────────────────────────
const TONES: { l: string; d: string; m: MoodType }[] = [
  { l: 'Warm',        d: 'Like a thoughtful friend. Default.',   m: 'happy' },
  { l: 'Direct',      d: 'No fluff. Says it straight.',          m: 'thinking' },
  { l: 'Cheerleader', d: 'Hype every win, no matter how small.', m: 'cheering' },
  { l: 'Stoic',       d: 'Calm, sparing, philosophical.',        m: 'curious' },
];

export function CoachTone({ go }: { go: (r: string) => void }) {
  const [pick, setPick] = useState('Warm');
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Coach tone</Header>
      <div style={S.pad}>
        <h1 style={{ ...S.h1, marginTop: 14 }}>How should<br /><Em>Pip</Em> talk to you?</h1>
        <div style={{ fontSize: 14, color: C.dim, marginTop: 10, lineHeight: 1.5 }}>You can change this anytime. Pip will quietly adapt across all messages.</div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TONES.map(t => {
            const on = pick === t.l;
            return (
              <div key={t.l} onClick={() => setPick(t.l)} style={{ ...S.pillow, padding: 16, cursor: 'pointer', background: on ? C.apricotWash : C.surface, border: on ? `1.5px solid ${C.apricot}` : `1px solid ${C.hair}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: on ? '#fff' : C.pillow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mascot mood={t.m} size={44} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"Fraunces",serif', fontSize: 19, color: on ? C.apricotDk : C.ink, fontWeight: 500 }}>{t.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 3, lineHeight: 1.4 }}>{t.d}</div>
                </div>
                {on && <div style={{ width: 24, height: 24, borderRadius: 999, background: C.apricot, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" color="#fff" size={14} /></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('profile')}>Save</button>
      </div>
    </div>
  );
}

// ── Units ────────────────────────────────────────────────────────
export function Units({ go }: { go: (r: string) => void }) {
  const [units, setUnits] = useState({ mass: 'kg', height: 'cm', energy: 'kcal', volume: 'L', firstDay: 'Monday', lang: 'English' });
  const Group = ({ k, label, opts }: { k: keyof typeof units; label: string; opts: string[] }) => (
    <div>
      <div style={{ ...S.eyebrow, marginTop: 24 }}>{label}</div>
      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {opts.map(o => {
          const on = units[k] === o;
          return (
            <button key={o} onClick={() => setUnits(u => ({ ...u, [k]: o }))} style={{ padding: '10px 16px', borderRadius: 999, fontSize: 13, fontWeight: on ? 600 : 500, background: on ? C.apricot : C.surface, color: on ? '#fff' : C.ink, border: on ? 0 : `1px solid ${C.hair}`, cursor: 'pointer', fontFamily: 'inherit' }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Units &amp; locale</Header>
      <div style={S.pad}>
        <Group k="mass"     label="Body weight"    opts={['kg','lb','st']} />
        <Group k="height"   label="Height"         opts={['cm','ft / in']} />
        <Group k="energy"   label="Energy"         opts={['kcal','kJ']} />
        <Group k="volume"   label="Liquids"        opts={['mL','fl oz','L']} />
        <Group k="firstDay" label="Week starts on" opts={['Monday','Sunday']} />
        <Group k="lang"     label="Language"       opts={['English','Español','Português','Italiano']} />
      </div>
      <div style={{ padding: '24px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('profile')}>Save</button>
      </div>
    </div>
  );
}

// ── Integrations ─────────────────────────────────────────────────
const INT_ITEMS = [
  { k: 'apple',    l: 'Apple Health', d: 'Steps · workouts · sleep · weight', icon: 'heart',   tone: 'apricotSolid' as const },
  { k: 'google',   l: 'Google Fit',   d: 'Activity & body metrics',           icon: 'heart',   tone: 'green' as const },
  { k: 'strava',   l: 'Strava',       d: 'Auto-import runs & rides',          icon: 'flame',   tone: 'apricot' as const },
  { k: 'fitbit',   l: 'Fitbit',       d: 'Wearable + scale',                  icon: 'heart',   tone: 'butter' as const },
  { k: 'withings', l: 'Withings scale',d:'Auto-log weigh-ins',                icon: 'scale',   tone: 'greenSolid' as const },
  { k: 'glovo',    l: 'Glovo',        d: 'Order recipe ingredients',          icon: 'cart',    tone: 'cream' as const },
];

export function Integrations({ go }: { go: (r: string) => void }) {
  const [conn, setConn] = useState<Record<string, boolean>>({ apple: true, glovo: true, strava: false, google: false, fitbit: false, withings: true });
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Integrations</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillowSm, background: C.pillow, marginTop: 14, fontSize: 13, color: C.dim, lineHeight: 1.5 }}>
          <span style={{ color: C.green, fontWeight: 600 }}>3 connected.</span> Lumi reads what you allow. Disconnect anytime.
        </div>
        <div style={{ marginTop: 14, ...S.pillow, padding: 0 }}>
          {INT_ITEMS.map(({ k, l, d, icon, tone }, i) => {
            const on = conn[k];
            const solid = tone === 'apricotSolid' || tone === 'greenSolid';
            return (
              <div key={k} style={{ padding: '14px 18px', borderBottom: i < INT_ITEMS.length - 1 ? `1px solid ${C.hair}` : 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                <IconChip tone={tone} size={36}><Icon name={icon} color={solid ? '#fff' : C.apricotDk} size={18} /></IconChip>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={() => setConn(c => ({ ...c, [k]: !c[k] }))} style={{ padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: on ? C.greenLt : C.surface, color: on ? C.green : C.dim, border: on ? 0 : `1px solid ${C.hair}`, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>{on ? '✓ Connected' : 'Connect'}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Privacy ──────────────────────────────────────────────────────
export function Privacy({ go }: { go: (r: string) => void }) {
  const [perm, setPerm] = useState({ analytics: true, share: false, research: true });
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Privacy</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.greenLt, marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconChip tone="greenSolid" size={44}><Icon name="veg" color="#fff" size={22} /></IconChip>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.green }}>Your data</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 18, color: C.green, marginTop: 2, letterSpacing: '-.3px' }}>Encrypted &amp; yours.</div>
          </div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>What you share</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {[
            { k: 'analytics', l: 'Anonymous analytics',             d: 'Helps us improve Pip' },
            { k: 'share',     l: 'Share progress with friends',     d: 'Off · only you can see your data' },
            { k: 'research',  l: 'Contribute to nutrition research', d: 'De-identified, opt-out anytime' },
          ].map(({ k, l, d }, i, arr) => {
            const on = perm[k as keyof typeof perm];
            return (
              <div key={k} style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={() => setPerm(p => ({ ...p, [k]: !p[k as keyof typeof p] }))} style={{ width: 44, height: 26, borderRadius: 999, background: on ? C.apricot : C.hair, border: 0, cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, background: '#fff', borderRadius: 999, boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'left .2s' }} />
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Your data, your control</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ ...S.ctaLine, color: C.ink }}>Export my data (.csv)</button>
          <button style={{ ...S.ctaLine, color: C.ink }}>Privacy policy</button>
          <button style={{ ...S.ctaLine, color: '#B43E2A' }}>Delete my account</button>
        </div>
      </div>
    </div>
  );
}

// ── Subscription ─────────────────────────────────────────────────
export function Subscription({ go }: { go: (r: string) => void }) {
  const [plan, setPlan] = useState('annual');
  const PLANS = [
    { k: 'annual',   l: 'Annual',   p: '€59.99/yr', s: '€5/mo billed yearly · save 50%', best: true },
    { k: 'monthly',  l: 'Monthly',  p: '€9.99/mo',  s: 'Cancel anytime' },
    { k: 'lifetime', l: 'Lifetime', p: '€199 once', s: 'Pay once. Yours forever.' },
  ];
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Subscription</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.apricot, color: '#fff', marginTop: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...S.eyebrow, color: 'rgba(255,255,255,.75)' }}>Current plan</div>
          <div style={{ fontFamily: '"Fraunces",serif', fontSize: 28, marginTop: 4, letterSpacing: '-.4px' }}>Trial</div>
          <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9 }}>5 days left · then €59.99/year</div>
          <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(255,255,255,.18)', borderRadius: 12, fontSize: 11, color: '#fff', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <Icon name="sparkle" color="#fff" size={12} />
            All features unlocked
          </div>
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Choose your plan</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PLANS.map(o => {
            const on = plan === o.k;
            return (
              <div key={o.k} onClick={() => setPlan(o.k)} style={{ ...S.pillow, padding: 16, cursor: 'pointer', background: on ? C.apricotWash : C.surface, border: on ? `1.5px solid ${C.apricot}` : `1px solid ${C.hair}`, display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                {o.best && <div style={{ position: 'absolute', top: -8, right: 14, background: C.green, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '.12em', padding: '3px 8px', borderRadius: 6 }}>BEST VALUE</div>}
                <div style={{ width: 22, height: 22, borderRadius: 999, border: on ? 0 : `1.5px solid ${C.dim}`, background: on ? C.apricot : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <div style={{ width: 10, height: 10, borderRadius: 999, background: '#fff' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"Fraunces",serif', fontSize: 19, color: on ? C.apricotDk : C.ink, fontWeight: 500 }}>{o.l}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{o.s}</div>
                </div>
                <div style={{ fontFamily: '"Fraunces",serif', fontSize: 17, color: C.ink, fontWeight: 500 }}>{o.p}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={S.ctaApricot} onClick={() => go('profile')}>Upgrade now</button>
          <button style={{ ...S.ctaLine, color: C.dim }}>Restore purchase</button>
          <button style={{ ...S.ctaLine, color: '#B43E2A' }}>Cancel subscription</button>
        </div>
      </div>
    </div>
  );
}

// ── Notifications ────────────────────────────────────────────────
const NOTIF_ITEMS = [
  { k: 'summary',     l: 'Daily summary',    d: "9:00 AM · today's plan & yesterday's recap" },
  { k: 'mealNudge',   l: 'Meal nudges',      d: '12:30 PM · 7:00 PM · soft reminders' },
  { k: 'weighIn',     l: 'Weekly weigh-in',  d: 'Sun 9:00 AM' },
  { k: 'wins',        l: 'Win moments',      d: 'Streaks, milestones, plan adjustments' },
  { k: 'plateauAlert',l: 'Plateau alerts',   d: 'Off · only ping if 14+ days flat' },
  { k: 'weekly',      l: 'Weekly recap',     d: 'Sun evening · your week in numbers' },
  { k: 'quiet',       l: 'Quiet hours',      d: '22:00 — 07:00' },
];

export function Notifications({ go }: { go: (r: string) => void }) {
  const [pref, setPref] = useState<Record<string, boolean>>({ summary: true, mealNudge: true, weighIn: true, wins: true, plateauAlert: false, weekly: true, quiet: true });
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Notifications</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.pillow, marginTop: 14, fontSize: 13, color: C.dim, lineHeight: 1.5 }}>
          We send <span style={{ color: C.apricotDk, fontWeight: 600 }}>3 reminders/day max</span> on default. You&apos;re in control.
        </div>
        <div style={{ marginTop: 14, ...S.pillow, padding: 0 }}>
          {NOTIF_ITEMS.map(({ k, l, d }, i) => {
            const on = pref[k];
            return (
              <div key={k} style={{ padding: '14px 18px', borderBottom: i < NOTIF_ITEMS.length - 1 ? `1px solid ${C.hair}` : 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{l}</div>
                  <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2, lineHeight: 1.3 }}>{d}</div>
                </div>
                <button onClick={() => setPref(p => ({ ...p, [k]: !p[k] }))} style={{ width: 44, height: 26, borderRadius: 999, background: on ? C.apricot : C.hair, border: 0, cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, background: '#fff', borderRadius: 999, boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'left .2s' }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Help ─────────────────────────────────────────────────────────
const FAQS = [
  ['How does Pip\'s plan adjust?','Every weekly weigh-in, Pip recalculates your calorie & macro target based on actual loss vs. predicted.'],
  ['Can I eat out?','Yes. Snap a photo or describe verbally — Pip estimates calories within ±10%.'],
  ['What if I plateau?','After 14 flat days Pip suggests a refeed, deload, or adjustment.'],
  ['Is my data private?','End-to-end encrypted. Never sold. You can export or delete anytime.'],
  ['Does it work without Apple Health?','Yes — but syncing improves accuracy. Manual logging is fine.'],
];

export function Help({ go }: { go: (r: string) => void }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Help &amp; FAQ</Header>
      <div style={S.pad}>
        <div style={{ ...S.pillow, background: C.apricotWash, marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => go('coach')}>
          <Mascot mood="wave" size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ ...S.eyebrow, color: C.apricotDk }}>Need a hand?</div>
            <div style={{ fontFamily: '"Fraunces",serif', fontSize: 19, color: C.apricotDk, marginTop: 2, letterSpacing: '-.3px' }}>Ask Pip directly</div>
          </div>
          <Icon name="add" color={C.apricotDk} size={14} />
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Frequently asked</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {FAQS.map(([q, a], i) => {
            const on = open === i;
            return (
              <div key={q} onClick={() => setOpen(on ? -1 : i)} style={{ padding: '16px 18px', borderBottom: i < FAQS.length - 1 ? `1px solid ${C.hair}` : 0, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ fontSize: 14, color: C.ink, fontWeight: 500, flex: 1 }}>{q}</span>
                  <Icon name="add" color={C.dim} size={16} />
                </div>
                {on && <div style={{ fontSize: 13, color: C.dim, marginTop: 8, lineHeight: 1.55 }}>{a}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28 }}>Contact us</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ ...S.ctaLine, color: C.ink }}>support@lumi.app</button>
          <button style={{ ...S.ctaLine, color: C.ink }}>Rate Lumi on the App Store</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 11, color: C.dim, letterSpacing: '.06em' }}>Lumi · v1.4.2 · Build 824</div>
      </div>
    </div>
  );
}

// ── ProfileSettings (legacy) ──────────────────────────────────────
export function ProfileSettings({ go }: { go: (r: string) => void }) {
  const tones = ['Warm (default)', 'Direct', 'Cheerleader', 'Stoic'];
  const notifs = ['Daily summary · 09:00', 'Meal nudge · 12:30', 'Weigh-in · Sun 09:00', 'Win moments'];
  return (
    <div style={S.page}>
      <Header back="profile" go={go}>Settings</Header>
      <div style={S.pad}>
        <div style={{ ...S.eyebrow, marginTop: 14 }}>Coach tone</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {tones.map((t, i, arr) => {
            const on = t.includes('Warm');
            return (
              <div key={t} style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, border: on ? 0 : `1.5px solid ${C.dim}`, background: on ? C.apricot : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <div style={{ width: 10, height: 10, borderRadius: 999, background: '#fff' }} />}
                </div>
                <span style={{ flex: 1, fontSize: 14, color: on ? C.apricot : C.ink, fontWeight: on ? 600 : 500 }}>{t}</span>
              </div>
            );
          })}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 28, marginBottom: 10 }}>Notifications</div>
        <div style={{ ...S.pillow, padding: 0 }}>
          {notifs.map((t, i, arr) => (
            <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: i < arr.length - 1 ? `1px solid ${C.hair}` : 0 }}>
              <span style={{ fontSize: 14, color: C.ink }}>{t}</span>
              <div style={{ width: 40, height: 22, background: C.apricot, borderRadius: 999, position: 'relative' }}>
                <div style={{ position: 'absolute', right: 2, top: 2, width: 18, height: 18, background: '#fff', borderRadius: 999, boxShadow: '0 1px 3px rgba(0,0,0,.25)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
