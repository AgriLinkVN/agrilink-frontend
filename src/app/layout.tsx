import type { Metadata } from "next";
import { getBuildSafeSiteUrl } from "@/config/runtime-config";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/components/providers/QueryProvider";

const SITE_URL = getBuildSafeSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AgriLink Vietnam — Nền tảng nông sản sạch",
    template: "%s | AgriLink Vietnam",
  },
  description: "Kết nối nông dân Việt Nam với người mua trong nước và quốc tế",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "AgriLink Vietnam",
    title: "AgriLink Vietnam — Nền tảng nông sản sạch",
    description: "Kết nối nông dân Việt Nam với người mua trong nước và quốc tế",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriLink Vietnam — Nền tảng nông sản sạch",
    description: "Kết nối nông dân Việt Nam với người mua trong nước và quốc tế",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
