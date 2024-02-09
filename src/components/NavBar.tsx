"use client";
import {
  Avatar,
  Breadcrumb,
  Layout,
  Menu,
  Space,
  Spin,
  Typography,
  theme,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { PropsWithChildren } from "react";
import {
  TrophyOutlined,
  RocketOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

import { usePathname, useRouter } from "next/navigation";
import { CsvDataProvider } from "@/contexts/CsvDataProvider";
import Link from "next/link";
import { Logo } from "./Logo";
import { useAuthContext } from "@/contexts/AuthProvider";

export default function NavBar(props: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  const { session } = useAuthContext();

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
            <Avatar style={{ backgroundColor: "#123f33" }}>
              {session.user.email?.charAt(0).toUpperCase()}
            </Avatar>
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
        <Spin fullscreen />
      )}
    </>
  );
}
