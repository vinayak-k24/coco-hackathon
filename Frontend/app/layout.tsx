import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'NexaFactory | Enterprise AI Manufacturing Operations',
  description: 'Next-generation intelligent manufacturing operations command center with AI copilot, real-time plant telemetry, and predictive maintenance.',
  openGraph: {
    title: 'NexaFactory | Enterprise AI Manufacturing Operations',
    description: 'Next-generation intelligent manufacturing operations command center with AI copilot, real-time plant telemetry, and predictive maintenance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexaFactory | Enterprise AI Manufacturing Operations',
    description: 'Next-generation intelligent manufacturing operations command center with AI copilot, real-time plant telemetry, and predictive maintenance.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
