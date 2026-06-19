import { ReactNode } from "react";
import clsx from "clsx";

import "@/styles/globals.css";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";

interface RootLayoutProps {
  children: ReactNode;
}

/** Root layout component responsible for baseline HTML structure, global fonts, and core providers context initialization */
export function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={clsx("font-sans antialiased", fontSans.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export default RootLayout;
