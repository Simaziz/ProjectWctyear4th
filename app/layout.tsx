import { Providers } from "../../cozycup/app/components/Providers"; // Import the file we just made
import Navbar from "../../cozycup/app/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap everything inside Providers */}
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}