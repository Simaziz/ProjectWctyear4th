"use client";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Responsive Toast System:
          - Bottom-center is best for mobile (easier to see/reach)
          - Desktop naturally handles top-center well
      */}
      <Toaster 
        position="bottom-center" 
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Professional, high-end "Dark Stone" styling
          style: {
            background: '#1c1917', // stone-900
            color: '#fafaf9',      // stone-50
            borderRadius: '1.25rem', // rounded-2xl
            fontSize: '13px',
            fontWeight: '600',
            padding: '12px 20px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#ea580c', // orange-600
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}