import type { Metadata } from 'next';
import './globals.css';
import './motion.css';
export const metadata: Metadata = {
 title: '<ab-tech-dev/> — Software & Automation',
 description: 'Thoughtful software. Effortless automation. ab-tech-dev turns ambitious ideas into digital products and connected systems built around your business.',
 icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}