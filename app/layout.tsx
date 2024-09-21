import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider";
import ProtectedRoute from "@/components/protected-route";
import { Navbar } from "@/components/navbar";
import { UserCheck } from "@/components/user-check";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SDMVP",
  description: "Startup Defense MVP",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <NextTopLoader color="#ffffff" showSpinner={false} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Navbar />
              <main className="items-center justify-center">
                <UserCheck>
                  <ProtectedRoute>{children}</ProtectedRoute>
                </UserCheck>
              </main>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
