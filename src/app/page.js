// src/app/page.js
'use client';

import GradingForm from '@/components/GradingForm';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <FullGradingForm />
    </main>
  );
}