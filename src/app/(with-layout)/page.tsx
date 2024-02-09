"use client";
import { Button, Drawer, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";

import { PlusOutlined } from "@ant-design/icons";
import NewProgramForm from "@/components/forms/NewProgramForm";
import { Program } from "@/types/types";
import { GetAllPrograms } from "@/hooks/supabaseHooks";

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

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [programsData, setProgramsData] = useState<Program[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await GetAllPrograms();
    if (response) {
      setProgramsData(response);
    }
  }
  return (
    <main>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <div className="flex justify-end">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
            Add new program
          </Button>
        </div>
        <Table dataSource={programsData} columns={columns} />
      </Space>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right">
        <NewProgramForm onClose={setDrawerOpen} />
      </Drawer>
    </main>
  );
}
