"use client";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* This adds the professional alert system */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          // Professional styling to match a coffee theme
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#f97316', // Orange color
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}