"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the Overview page by default when accessing /dashboard
    router.replace('/dashboard/overview');
  }, [router]);

  return null;
} 