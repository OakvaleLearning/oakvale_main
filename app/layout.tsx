import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oakvale Learning: Strengthening Health Systems Through Learning",
  description: "Evidence-based workforce, leadership and organisational development for Africa.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${ebGaramond.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1C1C1C' },
            success: { iconTheme: { primary: '#0A3D2B', secondary: '#fff' } },
            error: { iconTheme: { primary: '#9a1d1d', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}