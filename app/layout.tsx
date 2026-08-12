import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import TourProvider from '@/components/tour/TourProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AI PO Xavi Marín Suite',
  description:
    'A suite of AI tools that automate the repetitive side of Product Management — built and used daily by a real Product Owner.',
  authors: [{ name: 'Xavi Marín', url: 'https://xavimarin.net' }],
  metadataBase: new URL('https://suite.xavimarin.net'),
  openGraph: {
    title: 'AI PO Xavi Marín Suite',
    description:
      'A suite of AI tools that automate the repetitive side of Product Management.',
    url: 'https://suite.xavimarin.net',
    siteName: 'AI PO Xavi Marín Suite',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-gray-50 text-gray-900 min-h-screen antialiased">
        <TourProvider>{children}</TourProvider>
      </body>
    </html>
  );
}
