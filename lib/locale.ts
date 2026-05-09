import * as Localization from 'expo-localization';

export function getDeviceTimezone(): string {
  const cals = Localization.getCalendars();
  return cals[0]?.timeZone ?? 'UTC';
}

export function formatDate(d: Date): string {
  const locale = Localization.getLocales()[0]?.languageTag ?? 'en-US';
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}
