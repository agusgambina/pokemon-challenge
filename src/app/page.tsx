'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';

export default function Home() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Don't render anything while checking authentication
  if (loading || !user) {
    return null;
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]" style={{ padding: '1%' }}>
      <Header user={user} logout={logout} />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
    </div>
  );
}
