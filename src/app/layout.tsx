import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Bluff.io | Global Online Crypto Poker Room",
  description: "Join our waitlist!",
  openGraph: {
    title: "Bluff.io | Global Online Crypto Poker Room",
    description: "Join our waitlist!",
    url: "https://reboostmedia.com/",
    siteName: "Bluff.io",
    images: [
      {
        url: "https://bluff.io/og.png",
        width: 720,
        height: 378,
        alt: "Bluff.io OG Image",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
