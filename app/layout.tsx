import "@/styles/globals.css";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={clsx("font-sans antialiased", fontSans.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
