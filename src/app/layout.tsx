import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = { themeColor: "#17151b", colorScheme: "dark" };

export const metadata: Metadata = {
  title: { default: "Shaadi Reply — Together starts here", template: "%s | Shaadi Reply" },
  description: "A beautiful invitation. A simple yes or no. Bring your people together with wedding RSVP links and a guest dashboard made for your shaadi.",
  applicationName: "Shaadi Reply",
  icons: { icon: "/icon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body><a className="skip-link" href="#main">Skip to content</a>{children}<Toaster theme="dark" position="bottom-right" richColors closeButton toastOptions={{ style: { fontFamily: "var(--font-sans)", borderRadius: "12px", background: "var(--card)", color: "var(--foreground)", borderColor: "var(--color-border)" } }} /></body></html>;
}
