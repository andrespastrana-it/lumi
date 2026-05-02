'use client';

import { AppProvider, useApp } from '@/app/context/AppContext';

// ── Onboarding screens
import Welcome       from '@/app/screens/onboarding/Welcome';
import Goal          from '@/app/screens/onboarding/Goal';
import Body          from '@/app/screens/onboarding/Body';
import ActivityLevel from '@/app/screens/onboarding/ActivityLevel';
import Diet          from '@/app/screens/onboarding/Diet';
import Schedule      from '@/app/screens/onboarding/Schedule';
import Compute       from '@/app/screens/onboarding/Compute';
import PlanReveal    from '@/app/screens/onboarding/PlanReveal';
import Permissions   from '@/app/screens/onboarding/Permissions';
import Paywall       from '@/app/screens/onboarding/Paywall';

// ── Main app screens
import Today    from '@/app/screens/today/Today';
import Plan     from '@/app/screens/plan/Plan';
import Recipe   from '@/app/screens/plan/Recipe';
import Shopping from '@/app/screens/plan/Shopping';
import Coach    from '@/app/screens/coach/Coach';
import Activity from '@/app/screens/activity/Activity';
import MascotGallery from '@/app/screens/mascot/MascotGallery';

// ── Log screens
import { LogChoose, LogVoice, LogPhoto, LogBarcode, LogSearch, LogConfirm } from '@/app/screens/log/LogScreens';

// ── Weekly screens
import { WeighIn, WeighInResult, Forecast, Milestone, Plateau, BadDay } from '@/app/screens/weekly/WeeklyScreens';

// ── Profile screens
import {
  Profile, ProfileEdit, CoachTone, Units, Integrations,
  Privacy, Subscription, Notifications, Help, ProfileSettings,
} from '@/app/screens/profile/ProfileScreens';

// ── Sidebar definition ────────────────────────────────────────────
const GROUPS = [
  {
    label: 'Onboarding',
    screens: [
      { route: 'welcome',       label: 'Welcome' },
      { route: 'goal',          label: 'Goal' },
      { route: 'body',          label: 'Body' },
      { route: 'activityLevel', label: 'Activity Level' },
      { route: 'diet',          label: 'Diet' },
      { route: 'schedule',      label: 'Schedule' },
      { route: 'compute',       label: 'Compute' },
      { route: 'planReveal',    label: 'Plan Reveal' },
      { route: 'permissions',   label: 'Permissions' },
      { route: 'paywall',       label: 'Paywall' },
    ],
  },
  {
    label: 'Today',
    screens: [
      { route: 'today', label: 'Today' },
    ],
  },
  {
    label: 'Plan & Cook',
    screens: [
      { route: 'plan',     label: 'Meal Plan' },
      { route: 'recipe',   label: 'Recipe' },
      { route: 'shopping', label: 'Shopping List' },
    ],
  },
  {
    label: 'Coach',
    screens: [
      { route: 'coach', label: 'Coach Chat' },
    ],
  },
  {
    label: 'Log',
    screens: [
      { route: 'logChoose',  label: 'Log — Choose' },
      { route: 'logVoice',   label: 'Log — Voice' },
      { route: 'logPhoto',   label: 'Log — Photo' },
      { route: 'logBarcode', label: 'Log — Barcode' },
      { route: 'logSearch',  label: 'Log — Search' },
      { route: 'logConfirm', label: 'Log — Confirm' },
    ],
  },
  {
    label: 'Weekly',
    screens: [
      { route: 'weighIn',       label: 'Weigh-In' },
      { route: 'weighInResult', label: 'Weigh-In Result' },
      { route: 'forecast',      label: 'Forecast' },
      { route: 'milestone',     label: 'Milestone' },
      { route: 'plateau',       label: 'Plateau' },
      { route: 'badDay',        label: 'Bad Day' },
    ],
  },
  {
    label: 'Activity & Me',
    screens: [
      { route: 'activity',        label: 'Activity' },
      { route: 'profile',         label: 'Profile' },
      { route: 'profileEdit',     label: 'Edit Profile' },
      { route: 'notifications',   label: 'Notifications' },
      { route: 'coachTone',       label: 'Coach Tone' },
      { route: 'units',           label: 'Units' },
      { route: 'integrations',    label: 'Integrations' },
      { route: 'privacy',         label: 'Privacy' },
      { route: 'subscription',    label: 'Subscription' },
      { route: 'help',            label: 'Help' },
      { route: 'profileSettings', label: 'Settings' },
    ],
  },
  {
    label: 'Mascot',
    screens: [
      { route: 'mascotGallery', label: 'Pip Gallery' },
    ],
  },
];

// ── Screen router ─────────────────────────────────────────────────
function Screen({ route, go, state, set }: {
  route: string;
  go: (r: string) => void;
  state: ReturnType<typeof useApp>['state'];
  set: ReturnType<typeof useApp>['set'];
}) {
  switch (route) {
    // Onboarding
    case 'welcome':       return <Welcome go={go} />;
    case 'goal':          return <Goal go={go} state={state} set={set} />;
    case 'body':          return <Body go={go} state={state} />;
    case 'activityLevel': return <ActivityLevel go={go} state={state} set={set} />;
    case 'diet':          return <Diet go={go} state={state} set={set} />;
    case 'schedule':      return <Schedule go={go} />;
    case 'compute':       return <Compute go={go} />;
    case 'planReveal':    return <PlanReveal go={go} />;
    case 'permissions':   return <Permissions go={go} />;
    case 'paywall':       return <Paywall go={go} />;
    // Main
    case 'today':         return <Today go={go} state={state} />;
    case 'plan':          return <Plan go={go} />;
    case 'recipe':        return <Recipe go={go} />;
    case 'shopping':      return <Shopping go={go} />;
    case 'coach':         return <Coach go={go} />;
    case 'activity':      return <Activity go={go} />;
    case 'mascotGallery': return <MascotGallery go={go} />;
    // Log
    case 'logChoose':     return <LogChoose go={go} />;
    case 'logVoice':      return <LogVoice go={go} />;
    case 'logPhoto':      return <LogPhoto go={go} />;
    case 'logBarcode':    return <LogBarcode go={go} />;
    case 'logSearch':     return <LogSearch go={go} />;
    case 'logConfirm':    return <LogConfirm go={go} />;
    // Weekly
    case 'weighIn':       return <WeighIn go={go} set={set} />;
    case 'weighInResult': return <WeighInResult go={go} />;
    case 'forecast':      return <Forecast go={go} />;
    case 'milestone':     return <Milestone go={go} />;
    case 'plateau':       return <Plateau go={go} />;
    case 'badDay':        return <BadDay go={go} />;
    // Profile
    case 'profile':         return <Profile go={go} />;
    case 'profileEdit':     return <ProfileEdit go={go} state={state} />;
    case 'coachTone':       return <CoachTone go={go} />;
    case 'units':           return <Units go={go} />;
    case 'integrations':    return <Integrations go={go} />;
    case 'privacy':         return <Privacy go={go} />;
    case 'subscription':    return <Subscription go={go} />;
    case 'notifications':   return <Notifications go={go} />;
    case 'help':            return <Help go={go} />;
    case 'profileSettings': return <ProfileSettings go={go} />;
    default:              return <Today go={go} state={state} />;
  }
}

// ── Device frame ──────────────────────────────────────────────────
function DeviceFrame() {
  const { route, navigate, goBack, restart, state, set } = useApp();

  const allScreens = GROUPS.flatMap(g => g.screens);
  const idx = allScreens.findIndex(s => s.route === route);
  const total = allScreens.length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1a140e' }}>
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <div style={{
        width: 240,
        flexShrink: 0,
        background: '#211912',
        borderRight: '1px solid rgba(255,255,255,.06)',
        overflowY: 'auto',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', marginBottom: 8 }}>
          <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, color: '#F2EAD8', fontWeight: 400, letterSpacing: '-.5px' }}>Lumi</div>
          <div style={{ fontSize: 10, color: 'rgba(242,234,216,.35)', marginTop: 2, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase' }}>Design Prototype · {total} screens</div>
        </div>

        {GROUPS.map(g => (
          <div key={g.label} style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', color: 'rgba(242,234,216,.3)', textTransform: 'uppercase', padding: '12px 20px 4px' }}>{g.label}</div>
            {g.screens.map((s, i) => {
              const globalIdx = allScreens.findIndex(x => x.route === s.route);
              const active = route === s.route;
              return (
                <button
                  key={s.route}
                  onClick={() => navigate(s.route)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: active ? 'rgba(232,120,78,.15)' : 'none',
                    border: 0,
                    borderLeft: active ? '2px solid #E8784E' : '2px solid transparent',
                    padding: '7px 20px 7px 18px',
                    fontSize: 12,
                    color: active ? '#E8784E' : 'rgba(242,234,216,.55)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: active ? 600 : 400,
                    transition: 'all .1s',
                  }}
                >
                  <span style={{ opacity: .4, marginRight: 8, fontSize: 10 }}>{String(globalIdx + 1).padStart(2, '0')}</span>
                  {s.label}
                </button>
              );
            })}
          </div>
        ))}

        {/* Restart */}
        <div style={{ marginTop: 'auto', padding: '20px 20px 0', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <button
            onClick={restart}
            style={{ background: 'rgba(232,120,78,.1)', border: '1px solid rgba(232,120,78,.2)', borderRadius: 8, padding: '8px 14px', fontSize: 11, color: '#E8784E', cursor: 'pointer', fontFamily: 'inherit', width: '100%', fontWeight: 600, letterSpacing: '.04em' }}
          >
            ↺ Restart Onboarding
          </button>
        </div>
      </div>

      {/* ── Center: device + controls ─────────────────────────────── */}
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
            {allScreens.find(s => s.route === route)?.label ?? route}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(242,234,216,.25)', fontFamily: 'inherit' }}>
            {idx + 1} / {total}
          </div>
        </div>

        {/* iPhone frame */}
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
          {/* Screen area */}
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

            {/* Status bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 10, pointerEvents: 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1F1B17', letterSpacing: '-.2px' }}>9:41</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Signal bars */}
                <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                  <rect x="0" y="7" width="3" height="5" rx="1" fill="#1F1B17" />
                  <rect x="4.5" y="4.5" width="3" height="7.5" rx="1" fill="#1F1B17" />
                  <rect x="9" y="2" width="3" height="10" rx="1" fill="#1F1B17" />
                  <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1F1B17" fillOpacity=".3" />
                </svg>
                {/* WiFi */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <path d="M7.5 9a1 1 0 110 2 1 1 0 010-2z" fill="#1F1B17" />
                  <path d="M4.2 6.5a4.7 4.7 0 016.6 0" stroke="#1F1B17" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M1.5 3.8a8.5 8.5 0 0112 0" stroke="#1F1B17" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {/* Battery */}
                <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                  <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#1F1B17" strokeOpacity=".35" />
                  <rect x="2" y="2" width="16" height="8" rx="2" fill="#1F1B17" />
                  <path d="M23 4v4a2 2 0 000-4z" fill="#1F1B17" fillOpacity=".4" />
                </svg>
              </div>
            </div>

            {/* Scrollable screen content */}
            <div
              id="device-viewport"
              style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 54 }}
              className="hide-scroll"
            >
              <Screen route={route} go={navigate} state={state} set={set} />
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

        {/* Navigation hint */}
        <div style={{ marginTop: 16, fontSize: 10, color: 'rgba(242,234,216,.2)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Click sidebar to jump · scroll inside phone to explore
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function Page() {
  return (
    <AppProvider>
      <DeviceFrame />
    </AppProvider>
  );
}
