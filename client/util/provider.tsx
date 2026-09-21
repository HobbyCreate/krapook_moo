// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
// import { AuthProvider } from '@/context/AuthContext'; // ถ้ามี AuthProvider เปิดบรรทัดนี้ไว้ได้เลยครับ

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
        {children}
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}