import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumi — AI Weight-Loss Companion',
  description: 'Your personal AI coach for sustainable weight loss.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
