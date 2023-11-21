import type { Metadata } from "next";
import "../globals.css";
import "@radix-ui/themes/styles.css";

import { NextAuthProvider } from "@/src/providers/NextAuthProvider";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Theme } from "@radix-ui/themes";

import { NotificationProvider } from "@/src/providers/NotificationContext";

export const metadata: Metadata = {
  title: "Set Mix Genearate",
};

import { Toaster } from "@/src/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
        <Toaster />
          <NextAuthProvider>
            <Theme>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <NotificationProvider>{children}</NotificationProvider>
              </ThemeProvider>
            </Theme>
          </NextAuthProvider>
        </main>
      </body>
    </html>
  );
}
