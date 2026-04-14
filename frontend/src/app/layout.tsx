import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { ThemeProvider } from "@/lib/theme";
import { ToastProvider } from "@/hooks/useToast";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "PortalApp — User & Posts Portal",
  description: "User & Posts Management Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
