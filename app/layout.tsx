import type { Metadata } from 'next';
import './globals.css';
import './motion.css';
import './studio.css';
export const metadata: Metadata = {
  title: '<ab-tech-dev/> — Software & Automation',
  description:
    'Thoughtful software. Effortless automation. ab-tech-dev turns ambitious ideas into digital products and connected systems built around your business.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/manrope-regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-semibold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
