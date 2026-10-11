import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autonomous Media OS',
  description: 'Human-supervised AI media operating system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
