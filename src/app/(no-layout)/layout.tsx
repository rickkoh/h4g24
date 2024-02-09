import { AntdRegistry } from "@ant-design/nextjs-registry";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AntdRegistry>
        <body>{children}</body>
      </AntdRegistry>
    </html>
  );
}
