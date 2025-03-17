'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}

// Create a separate component to use the useAuth hook
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {user && <Header user={user} logout={logout} />}
        {children}
      </body>
    </html>
  );
}
