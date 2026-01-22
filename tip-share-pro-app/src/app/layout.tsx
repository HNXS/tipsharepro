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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
