import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "../../globals.css";

import { NextAuthProvider } from "@/src/providers/NextAuthProvider";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Set Mix Genearate",
};

export default function LoginPageLayout({
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
      </body>
    </html>
  );
}
