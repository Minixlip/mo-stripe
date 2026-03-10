import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/manrope';
import type { Metadata } from 'next';
import './globals.css';
import { NavigationHeader } from '@/components/landing';

export const metadata: Metadata = {
  title: 'mo-stripe | The Ledger',
  description: 'Architectural ledger landing page for mo-stripe.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <NavigationHeader />
        {children}
      </body>
    </html>
  );
}
