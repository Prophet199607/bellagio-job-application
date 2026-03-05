import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import SecurityWrapper from "./components/SecurityWrapper";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bellagio Job Portal",
  description: "Apply for your dream job at Bellagio",
  icons: {
    icon: "/b-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AppProvider>
          <SecurityWrapper>
            {children}
          </SecurityWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
