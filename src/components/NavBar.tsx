"use client";
import {
  ProfileOutlined,
  RocketOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Layout,
  Menu,
  Popover,
  Space,
  Spin,
  Typography,
  theme,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { PropsWithChildren } from "react";

import { useAuthContext } from "@/contexts/AuthProvider";
import { CsvDataProvider } from "@/contexts/CsvDataProvider";
import supabase from "@/hooks/supabaseConfig";
import { LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

export default function NavBar(props: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  const { session } = useAuthContext();

  const {
    token: { colorBgContainer, green4 },
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
            <Popover
              placement="bottomRight"
              content={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography.Text
                    strong
                    style={{
                      padding: "12px 20px",
                    }}
                  >
                    {session.user.email}
                  </Typography.Text>
                  <div
                    style={{
                      borderTop: "1px solid #d9d9d9",
                      padding: "4px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <Button
                      style={{ textAlign: "left" }}
                      icon={<LogoutOutlined />}
                      type="text"
                      danger
                      block
                      onClick={() => supabase.auth.signOut()}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              }
            >
              <Avatar style={{ backgroundColor: "#123f33" }}>
                {session.user.email?.charAt(0).toUpperCase()}
              </Avatar>
            </Popover>
          </Header>
          <Layout>
            <Sider collapsible theme="light">
              <Menu
                theme="light"
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
        <Spin fullscreen size="large" />
      )}
    </>
  );
}
