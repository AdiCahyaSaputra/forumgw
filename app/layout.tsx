import ProgressProvider from "@/components/provider/progress-provider";
import { ThemeProvider } from "@/components/provider/themer-provider";
import TrpcProvider from "@/components/provider/trpc-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForumGw",
  description: "Forum non-formal buat tempat diskusi lu pada",
  generator: "Next.js",
  applicationName: "ForumGW",
  referrer: "origin-when-cross-origin",
  keywords: ["Next.js", "React", "JavaScript", "ForumGW"],
  authors: [{ name: "Adics", url: "https://adics.xyz/" }],
  colorScheme: "dark",
  creator: "Adi Cahya Saputra",
  publisher: "Adi Cahya Saputra",
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
            <ProgressProvider>{children}</ProgressProvider>
          </ThemeProvider>
        </TrpcProvider>
        <Toaster />
      </body>
    </html>
  );
}
