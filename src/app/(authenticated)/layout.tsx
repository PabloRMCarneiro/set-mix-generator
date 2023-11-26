import type { Metadata } from "next";
import "../globals.css";
import "@radix-ui/themes/styles.css";

import { NextAuthProvider } from "@/src/providers/NextAuthProvider";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Theme } from "@radix-ui/themes";


export const metadata: Metadata = {
  title: "Set Mix Genearate",
};

import { Provider } from "react-redux";
import store from "@/src/redux/store";

import { Toaster } from "@/src/components/ui/toaster";

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
                  {children}
              </ThemeProvider>
            </Theme>
          </NextAuthProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
