'use client';

import { useApp } from '@/app/context/AppContext';

import Welcome from '@/app/screens/onboarding/Welcome';
import Goal from '@/app/screens/onboarding/Goal';
import Body from '@/app/screens/onboarding/Body';
import ActivityLevel from '@/app/screens/onboarding/ActivityLevel';
import Diet from '@/app/screens/onboarding/Diet';
import Schedule from '@/app/screens/onboarding/Schedule';
import Compute from '@/app/screens/onboarding/Compute';
import PlanReveal from '@/app/screens/onboarding/PlanReveal';
import Permissions from '@/app/screens/onboarding/Permissions';
import Paywall from '@/app/screens/onboarding/Paywall';

import Today from '@/app/screens/today/Today';
import Plan from '@/app/screens/plan/Plan';
import Recipe from '@/app/screens/plan/Recipe';
import Shopping from '@/app/screens/plan/Shopping';
import Coach from '@/app/screens/coach/Coach';
import Activity from '@/app/screens/activity/Activity';
import MascotGallery from '@/app/screens/mascot/MascotGallery';

import LogChoose from '@/app/screens/log/LogChoose';
import LogVoice from '@/app/screens/log/LogVoice';
import LogPhoto from '@/app/screens/log/LogPhoto';
import LogBarcode from '@/app/screens/log/LogBarcode';
import LogSearch from '@/app/screens/log/LogSearch';
import LogConfirm from '@/app/screens/log/LogConfirm';

import WeighIn from '@/app/screens/weekly/WeighIn';
import WeighInResult from '@/app/screens/weekly/WeighInResult';
import Forecast from '@/app/screens/weekly/Forecast';
import Milestone from '@/app/screens/weekly/Milestone';
import Plateau from '@/app/screens/weekly/Plateau';
import BadDay from '@/app/screens/weekly/BadDay';

import Profile from '@/app/screens/profile/Profile';
import ProfileEdit from '@/app/screens/profile/ProfileEdit';
import CoachTone from '@/app/screens/profile/CoachTone';
import Units from '@/app/screens/profile/Units';
import Integrations from '@/app/screens/profile/Integrations';
import Privacy from '@/app/screens/profile/Privacy';
import Subscription from '@/app/screens/profile/Subscription';
import Notifications from '@/app/screens/profile/Notifications';
import Help from '@/app/screens/profile/Help';
import ProfileSettings from '@/app/screens/profile/ProfileSettings';

type AppCtx = ReturnType<typeof useApp>;

export type ScreenProps = {
  route: string;
  go: (r: string) => void;
  state: AppCtx['state'];
  set: AppCtx['set'];
};

export function Screen({ route, go, state, set }: ScreenProps) {
  switch (route) {
    case 'welcome': return <Welcome go={go} />;
    case 'goal': return <Goal go={go} state={state} set={set} />;
    case 'body': return <Body go={go} state={state} set={set} />;
    case 'activityLevel': return <ActivityLevel go={go} state={state} set={set} />;
    case 'diet': return <Diet go={go} state={state} set={set} />;
    case 'schedule': return <Schedule go={go} state={state} set={set} />;
    case 'compute': return <Compute go={go} />;
    case 'planReveal': return <PlanReveal go={go} />;
    case 'permissions': return <Permissions go={go} state={state} set={set} />;
    case 'paywall': return <Paywall go={go} />;

    case 'today': return <Today go={go} state={state} />;
    case 'plan': return <Plan go={go} />;
    case 'recipe': return <Recipe go={go} />;
    case 'shopping': return <Shopping go={go} />;
    case 'coach': return <Coach go={go} />;
    case 'activity': return <Activity go={go} />;
    case 'mascotGallery': return <MascotGallery go={go} />;

    case 'logChoose': return <LogChoose go={go} />;
    case 'logVoice': return <LogVoice go={go} />;
    case 'logPhoto': return <LogPhoto go={go} />;
    case 'logBarcode': return <LogBarcode go={go} />;
    case 'logSearch': return <LogSearch go={go} />;
    case 'logConfirm': return <LogConfirm go={go} />;

    case 'weighIn': return <WeighIn go={go} set={set} />;
    case 'weighInResult': return <WeighInResult go={go} />;
    case 'forecast': return <Forecast go={go} />;
    case 'milestone': return <Milestone go={go} />;
    case 'plateau': return <Plateau go={go} />;
    case 'badDay': return <BadDay go={go} />;

    case 'profile': return <Profile go={go} state={state} />;
    case 'profileEdit': return <ProfileEdit go={go} state={state} />;
    case 'coachTone': return <CoachTone go={go} state={state} set={set} />;
    case 'units': return <Units go={go} state={state} set={set} />;
    case 'integrations': return <Integrations go={go} state={state} set={set} />;
    case 'privacy': return <Privacy go={go} state={state} set={set} />;
    case 'subscription': return <Subscription go={go} state={state} set={set} />;
    case 'notifications': return <Notifications go={go} state={state} set={set} />;
    case 'help': return <Help go={go} />;
    case 'profileSettings': return <ProfileSettings go={go} />;

    default: return <Today go={go} state={state} />;
  }
}
