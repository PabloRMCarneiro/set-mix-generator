import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "@radix-ui/themes/styles.css";

import { NextAuthProvider } from "@/src/providers/NextAuthProvider";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Theme } from "@radix-ui/themes";

import { NotificationProvider } from "@/src/providers/NotificationContext";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Set Mix Genearate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en">
      <body>
        <main>
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
