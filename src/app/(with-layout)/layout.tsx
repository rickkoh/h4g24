"use client";
import "../globals.css";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/contexts/AuthProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AuthProvider>
            <NavBar>{children}</NavBar>
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
