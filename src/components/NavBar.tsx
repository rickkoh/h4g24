import { Layout, Menu, Slider } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { PropsWithChildren } from "react";

import { UserOutlined } from "@ant-design/icons";

export default function NavBar(props: PropsWithChildren) {
  return (
    <Layout style={{ minHeight: "100dvh", position: "relative" }} hasSider>
      <Sider
        collapsible
        style={{
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              label: "Dashboard",
              icon: <UserOutlined />,
            },
            {
              key: "2",
              label: "Survey",
            },
            {
              key: "3",
              label: "Programs",
            },
          ]}
        />
      </Sider>
      <Content>{props.children}</Content>
    </Layout>
  );
}
