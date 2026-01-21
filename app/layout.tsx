import { Providers } from "../app/components/Providers";
import Navbar from "../app/components/Navbar"; 
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Forced data-theme and style to prevent any dark mode injection
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className="antialiased bg-white text-stone-900">
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-white">{children}</main>
        </Providers>
      </body>
    </html>
  );
}