"use client";
import { Button, Drawer, Space, Table, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import NewActivityForm from "@/components/forms/NewActivityForm";

// TODO: Replace this with actual data
const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
    tags: ["nice", "developer"],
  },
];

// TODO: Replace this with actual data
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    render: (_: any, { tags }: { tags: string[] }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];

export default function ActivitiesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <div className="flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add new activity
          </Button>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </Space>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
      >
        <NewActivityForm />
      </Drawer>
    </main>
  );
}
