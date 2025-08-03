import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VettPro",
  description: "An Axsient Product",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Add preload class to prevent transitions during page load
              document.documentElement.classList.add('preload');
              // Remove preload class after page is loaded
              window.addEventListener('load', () => {
                document.documentElement.classList.remove('preload');
              });
            `,
          }}
          suppressHydrationWarning
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <DashboardLayout>{children}</DashboardLayout>
          <Toaster variant="neumorphic" />
        </ThemeProvider>
      </body>
    </html>
  );
}
