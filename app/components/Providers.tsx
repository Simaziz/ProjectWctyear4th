"use client";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          style: {
            background: '#1c1917',
            color: '#fafaf9',
            borderRadius: '1.25rem',
            fontSize: '13px',
            fontWeight: '600',
            padding: '12px 20px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#ea580c',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </SessionProvider>
  );
}