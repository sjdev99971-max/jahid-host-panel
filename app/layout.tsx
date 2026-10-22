import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import TelegramSupport from "./components/TelegramSupport";

export const metadata: Metadata = {
  title: "Jahid Host — Mini VPS Hosting",
  description: "Run Python apps on demand. Mini VPS starting at ৳50/month.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          {/* Floating Telegram Button */}
          <TelegramSupport />
        </Providers>
      </body>
    </html>
  );
}
