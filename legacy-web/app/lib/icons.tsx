'use client';

const PATHS: Record<string, string> = {
  today:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1"/></g>`,
  plan:     `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3.5v3M16 3.5v3M3.5 10h17"/><path d="M9 14.5c1.5-2 3.5-2 5 0M9 17h6" stroke="#E8784E"/></g>`,
  coach:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11c0-3.3 3.6-6 8-6s8 2.7 8 6c0 3.3-3.6 6-8 6-.9 0-1.7-.1-2.5-.3L6 19l1-3.6C5.1 14.3 4 12.7 4 11z"/><path d="M12 8.5l.9 1.8 2 .3-1.4 1.4.3 2L12 13l-1.8 1 .3-2-1.4-1.4 2-.3z" fill="#E8784E" stroke="#E8784E"/></g>`,
  stats:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M7 17v-4M12 17V8M17 17v-7"/><path d="M5 8l4-3 4 4 5-5" stroke="#E8784E"/><circle cx="18" cy="4" r="1.4" fill="#E8784E" stroke="none"/></g>`,
  me:       `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="3.4"/><path d="M5 20c1-3.5 3.8-5 7-5s6 1.5 7 5"/></g>`,
  breakfast:`<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13a3 3 0 010 6H8a4 4 0 01-4-4z"/><path d="M17 12h2a2 2 0 110 4h-2"/><path d="M8 8c0-1 1-1 1-2s-1-1-1-2M12 8c0-1 1-1 1-2s-1-1-1-2" stroke="#E8784E"/></g>`,
  lunch:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13h18a9 9 0 01-18 0z"/><path d="M2 18h20"/><circle cx="9" cy="9" r="2.2" stroke="#E8784E"/><circle cx="14" cy="7.5" r="1.6" stroke="#E8784E"/></g>`,
  snack:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c2 1 3 2.5 3 4.5 0 1-.4 1.8-1 2.5l1 9-3-2-3 2 1-9c-.6-.7-1-1.5-1-2.5C9 6.5 10 5 12 4z"/><path d="M12 5.5v3M11 8l1 1 1-1" stroke="#E8784E"/></g>`,
  dinner:   `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11c0-3.5 3-6 7-6s7 2.5 7 6c0 1.5-.5 2.7-1.3 3.7L20 17H4l1.3-2.3C4.5 13.7 5 12.5 5 11z"/><path d="M9 11h6" stroke="#E8784E"/></g>`,
  water:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c4 4.5 6 7.5 6 10.5a6 6 0 01-12 0c0-3 2-6 6-10.5z"/><path d="M9 14a3 3 0 003 3" stroke="#E8784E"/></g>`,
  protein:  `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11c0-3 2-5 5-5 1.5 0 2.5.5 3.5 1.5L19 13l-2 2-5.5-5.5C11 9 10.5 8.5 10 8.5c-1.5 0-3 1.2-3 2.5 0 .5.2 1 .5 1.5L13 18l-2 2-6-6c-.7-.7-1-1.7-1-3z"/><circle cx="16" cy="8" r="1.4" fill="#E8784E" stroke="none"/></g>`,
  veg:      `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4c-2 0-4 1.5-5 3.5C7 8 5 10 5 13a6 6 0 0012 0c0-3-2-5-4-5.5C13 5.5 14 4 14 4z"/><path d="M11 4c.5 1.5 0 3-1 4" stroke="#E8784E"/></g>`,
  grain:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16"/><path d="M12 7c-2-1-4-1-5 0 0 2 2 3 5 3M12 7c2-1 4-1 5 0 0 2-2 3-5 3M12 12c-2-1-4-1-5 0 0 2 2 3 5 3M12 12c2-1 4-1 5 0 0 2-2 3-5 3M12 17c-2-1-4-1-5 0 0 2 2 3 5 3M12 17c2-1 4-1 5 0 0 2-2 3-5 3" stroke="#E8784E"/></g>`,
  flame:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 3.5 4 5 4 8.5 0 2.5-2 4.5-4 4.5s-4-2-4-4.5C8 9 9 7 9 5c1.5 1 2.5 2 3 4z"/><path d="M11 12c.5 1 1.5 1.5 2 1.5" stroke="#E8784E"/><path d="M12 16v3" stroke="currentColor"/></g>`,
  steps:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 17c-1.5 0-2.5-1-2.5-2.5 0-1.8 1-3.5 1.5-5C7.5 8 8.5 7 10 7c1.2 0 2 .8 2 2 0 1.5-1 3-1.5 4.5-.4 1.4-1 3.5-2.5 3.5z"/><path d="M16 11c-1 0-1.5-.7-1.5-1.5 0-1 .5-2 1-3 .3-.7 1-1.5 2-1.5.8 0 1.5.5 1.5 1.5 0 1-.5 2-1 3-.3.8-.8 1.5-2 1.5z" stroke="#E8784E"/></g>`,
  workout:  `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10v4M6.5 7v10M20.5 10v4M17.5 7v10"/><path d="M6.5 12h11" stroke="#E8784E"/></g>`,
  heart:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19s-7-4.5-7-9.5c0-2.5 2-4.5 4.5-4.5 1.4 0 2.6.7 3.5 1.8.9-1.1 2.1-1.8 3.5-1.8 2.5 0 4.5 2 4.5 4.5 0 5-7 9.5-7 9.5z"/><path d="M8 11.5l2 .5 1-2 1.5 3 1-1.5h2" stroke="#E8784E"/></g>`,
  sleep:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 119.5 4a6.5 6.5 0 0010.5 10.5z"/><path d="M14 8h3l-3 3h3" stroke="#E8784E"/></g>`,
  scale:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 9l4-2 4 2" stroke="#E8784E"/><path d="M9.5 13h5" stroke="currentColor"/></g>`,
  mic:      `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9.5" y="3.5" width="5" height="10" rx="2.5"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M9 21h6"/><circle cx="12" cy="8" r="1.2" fill="#E8784E" stroke="none"/></g>`,
  camera:   `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0120 20H4a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 014 8z"/><circle cx="12" cy="13.5" r="3.5" stroke="#E8784E"/></g>`,
  barcode:  `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6v12M7 6v12M10 6v12M13 6v12M16 6v12M19 6v12" stroke="currentColor"/><path d="M3 4.5L3 3.5h3M21 4.5L21 3.5h-3M3 19.5L3 20.5h3M21 19.5L21 20.5h-3" stroke="#E8784E"/></g>`,
  search:   `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M15.5 15.5l4 4" stroke="#E8784E"/></g>`,
  add:      `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8" stroke="#E8784E"/></g>`,
  target:   `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.4" fill="#E8784E" stroke="none"/></g>`,
  trend:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l5-5 4 3 7-7"/><path d="M14 7h6v6" stroke="#E8784E"/></g>`,
  streak:   `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3.5 1-5.5 0 1.5 1 2.5 2 2.5 0-2 1-5 2-7z"/><path d="M10 14.5c.5 1.5 1.5 2 2 2" stroke="#E8784E"/></g>`,
  medal:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="5"/><path d="M9 9.5L7 4h10l-2 5.5"/><path d="M10 14l1.5 1.5L14 13" stroke="#E8784E"/></g>`,
  bell:     `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0112 0v5l1.5 2H4.5z"/><path d="M10 20a2 2 0 004 0"/><circle cx="17" cy="6" r="1.6" fill="#E8784E" stroke="none"/></g>`,
  cart:     `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2.5l2 12h11l1.5-8H7"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/><path d="M11 10h5" stroke="#E8784E"/></g>`,
  recipe:   `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h11a2 2 0 012 2v13a2 2 0 01-2 2H8a2 2 0 01-2-2V3.5z"/><path d="M6 7h-1.5a1 1 0 00-1 1v10a1 1 0 001 1H6"/><path d="M9 9h6M9 12h6M9 15h4" stroke="#E8784E"/></g>`,
  settings: `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.8" stroke="#E8784E"/><path d="M12 4v2M12 18v2M4 12H6M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"/></g>`,
  check:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M8 12.5l3 3 5-6" stroke="#E8784E"/></g>`,
  close:    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6" stroke="#E8784E"/></g>`,
  sparkle:  `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" fill="#E8784E" stroke="#E8784E"/><path d="M18.5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" stroke="currentColor"/></g>`,
};

interface IconProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export function Icon({ name, color = 'currentColor', size = 24, className }: IconProps) {
  const path = PATHS[name];
  if (!path) return null;
  const coloredPath = path.replace(/stroke="currentColor"/g, `stroke="${color}"`);
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ color, display: 'block' }}
      dangerouslySetInnerHTML={{ __html: coloredPath }}
    />
  );
}

export { PATHS };
