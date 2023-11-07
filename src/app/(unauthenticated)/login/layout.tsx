import "../../globals.css";
import { NextAuthProvider } from "@/src/providers/NextAuthProvider";
import { Montserrat } from "next/font/google";

const fontFamily = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Login with Spotify",
  description: "Login page to authenticate through Spotify",
};

export default function LoginPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontFamily.className + " text-white bg-paper-700"}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
