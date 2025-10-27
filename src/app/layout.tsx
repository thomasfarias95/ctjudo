import type { Metadata } from "next";
import "./globals.css";

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono'; 

import "@fortawesome/fontawesome-free/css/all.min.css";


export const metadata: Metadata = {
  title: "Judô - CT Ferroviário do Recife",
  description: "Website oficial do CT Ferroviário do Recife", 
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        
        className={`antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}