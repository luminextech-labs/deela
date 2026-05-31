import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deela - เปรียบเทียบราคาสินค้า Shopee Lazada TikTok Shop",
  description: "ค้นหาและเปรียบเทียบราคาสินค้าจาก Shopee Lazada TikTok Shop ด้วย AI สรุปรีวิว",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-prompt antialiased">
        {children}
      </body>
    </html>
  );
}