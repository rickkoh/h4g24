"use client";
import { Button, Drawer, Space, Table, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import NewActivityForm from "@/components/forms/NewActivityForm";
import { Activity } from "@/types/types";
import { GetAllActivities } from "@/hooks/supabaseHooks";
import { useRouter } from "next/navigation";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Date created",
    dataIndex: "created_at",
    key: "created_at",
  },
];

export default function ActivitiesPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activitiesData, setActivitiesData] = useState<Activity[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await GetAllActivities();
    if (response) {
      setActivitiesData(response);
    }
  }
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
        <Table
          dataSource={activitiesData}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                router.push(`/activities/${record.id}`);
              },
            };
          }}
        />
      </Space>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
      >
        <NewActivityForm onClose={setDrawerOpen} />
      </Drawer>
    </main>
  );
}
