import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PayChat - Chat. Split. Pay. All in one.',
  description: 'A conversational payment app for Farcaster users to easily split bills and send payments within their social graph.',
  openGraph: {
    title: 'PayChat',
    description: 'Chat. Split. Pay. All in one.',
    images: [`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/og`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/og`,
    'fc:frame:button:1': 'Open PayChat',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/frame`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
