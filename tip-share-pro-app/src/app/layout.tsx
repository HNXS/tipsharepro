import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from '@/lib/DemoContext';

export const metadata: Metadata = {
  title: 'Tip Share Pro - Restaurant Tip Pool Management',
  description: 'A SaaS platform for restaurant tip pooling that satisfies government regulations and uses generally accepted accounting principles. Sharing The Customers Appreciation.',
  keywords: ['tip pool', 'restaurant', 'tip sharing', 'tip management', 'hospitality'],
  authors: [{ name: 'Tip Share Pro' }],
  openGraph: {
    title: 'Tip Share Pro - Restaurant Tip Pool Management',
    description: 'Fair, transparent tip pool distribution for your restaurant team.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
