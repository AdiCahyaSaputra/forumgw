import BalancerProvider from "@/components/provider/balancer-provider";
import ProgressProvider from "@/components/provider/progress-provider";
import { ThemeProvider } from "@/components/provider/themer-provider";
import TrpcProvider from "@/components/provider/trpc-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForumGw",
  description: "Forum non-formal buat tempat diskusi kalian",
  generator: "Next.js",
  applicationName: "ForumGW",
  referrer: "origin-when-cross-origin",
  keywords: ["Next.js", "React", "JavaScript", "ForumGW", "forumgw", "adics", "Adi Cahya Saputra", "adi cahya saputra"],
  authors: [{ name: "Adi Cahya Saputra", url: "https://adics.xyz/" }],
  creator: "Adi Cahya Saputra",
  publisher: "Adi Cahya Saputra",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} selection:bg-foreground selection:text-background text-foreground bg-background`}
      >
        <TrpcProvider>
          <ThemeProvider>
            <Suspense>
              <ProgressProvider>
                <BalancerProvider>{children}</BalancerProvider>
              </ProgressProvider>
            </Suspense>
          </ThemeProvider>
        </TrpcProvider>
        <Toaster />
      </body>
    </html>
  );
}
