"use client";
import "../globals.css";
import NavBar from "@/components/NavBar";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import supabase from "@/hooks/supabaseConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  console.log(session);
  // If the user is not logged in, redirect to the login page
  if (!session) {
    return null;
  }
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <NavBar>{children}</NavBar>
        </AntdRegistry>
      </body>
    </html>
  );
}
