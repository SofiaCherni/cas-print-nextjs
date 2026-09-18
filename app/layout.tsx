import type { Metadata } from "next";
import { Archivo, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo"
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "CAS-Print — одяг, який говорить за тебе",
  description:
    "Футболки та худі з готовими принтами або власним дизайном. Український streetwear-бренд CAS-Print.",
  metadataBase: new URL("https://cas-print.example"), // TODO: NEED REAL BUSINESS DATA (production domain)
  openGraph: {
    title: "CAS-Print",
    description: "Футболки та худі з готовими принтами або власним дизайном.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${archivo.variable} ${manrope.variable}`}>
      <body className="font-body">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
