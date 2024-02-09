"use client";
import {
  Avatar,
  Breadcrumb,
  Layout,
  Menu,
  Skeleton,
  Space,
  Typography,
  theme,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
  TrophyOutlined,
  RocketOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

import { usePathname, useRouter } from "next/navigation";
import { CsvDataProvider } from "@/contexts/CsvDataProvider";
import Link from "next/link";
import { Logo } from "./Logo";
import supabase from "@/hooks/supabaseConfig";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";

export default function NavBar(props: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        router.push("/login");
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      {session ? (
        <Layout style={{ minHeight: "100vh" }}>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: colorBgContainer,
              padding: "0 20px",
            }}
          >
            <Space>
              <Logo />
              <Typography.Title
                style={{
                  fontSize: "inherit",
                  marginBottom: 0,
                  fontWeight: 700,
                }}
              >
                OCOTOFORM
              </Typography.Title>
            </Space>
            <Avatar style={{ backgroundColor: "#f12333" }}>U</Avatar>
          </Header>
          <Layout>
            <Sider collapsible>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[pathname.split("/")[1]]}
                items={[
                  {
                    key: "",
                    label: "Programs",
                    icon: <RocketOutlined />,
                  },
                  {
                    key: "activities",
                    label: "Activities",
                    icon: <TrophyOutlined />,
                  },
                  {
                    key: "surveys",
                    label: "Surveys",
                    icon: <ProfileOutlined />,
                  },
                  {
                    key: "test",
                    label: "Test",
                    icon: <ProfileOutlined />,
                  },
                  {
                    key: "test1",
                    label: "Test1",
                    icon: <ProfileOutlined />,
                  },
                ]}
                onClick={(e) => router.push("/" + e.key)}
              />
            </Sider>
            <CsvDataProvider>
              <Content style={{ padding: "20px" }}>
                <Space
                  direction="vertical"
                  size="large"
                  style={{ display: "flex" }}
                >
                  <Breadcrumb
                    items={pathname.split("/").map((item, i) => {
                      if (i == pathname.split("/").length - 1) {
                        return { title: item };
                      }
                      return { title: <Link href={"/" + item}>{item}</Link> };
                    })}
                  />
                  {props.children}
                </Space>
              </Content>
            </CsvDataProvider>
          </Layout>
        </Layout>
      ) : (
        <Skeleton active />
      )}
    </>
  );
}
