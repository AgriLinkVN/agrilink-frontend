import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriLink Vietnam — Nền tảng nông sản sạch",
  description: "Kết nối nông dân Việt Nam với người mua trong nước và quốc tế",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
