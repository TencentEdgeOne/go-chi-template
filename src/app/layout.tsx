import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chi + EdgeOne Pages",
  description: "Go Functions allow you to run Go web frameworks like Chi on EdgeOne Pages. Build full-stack applications with Chi's composable routing and middleware.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <head>
        <link rel="icon" href="/chi-favicon.svg" />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
