import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Softrix IT Tech | Live Events & Entertainment",
  description: "Discover live sports, festivals and entertainment experiences with Softrix IT Tech.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
