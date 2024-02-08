"use client";
import { Button, Modal, Space, Table, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InboxOutlined } from "@ant-design/icons";

import { useCsvDataContext } from "@/contexts/CsvDataProvider";
import Dragger from "antd/es/upload/Dragger";

const surveyData = require("@/data/surveys.json");

const tableColumns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "No. of entries",
    dataIndex: "noOfEntries",
    key: "noOfEntries",
  },
  {
    title: "Programs",
    dataIndex: "programs",
    key: "programs",
    render: (_: any, record: any) => (
      <>
        {record.programs.map((program: any) => {
          let color = program.length > 5 ? "geekblue" : "green";
          if (program === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={program}>
              {program.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Activities",
    dataIndex: "activities",
    key: "activities",
    render: (_: any, record: any) => (
      <>
        {record.activities.map((activity: any) => {
          let color = activity.length > 5 ? "geekblue" : "green";
          if (activity === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={activity}>
              {activity.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Date created",
    dataIndex: "dateCreated",
    key: "dateCreated",
  },
];

export default function SurveyPage() {
  const router = useRouter();

  const { setCsvData } = useCsvDataContext();

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
            Import new survey
          </Button>
        </div>
        <Table
          dataSource={surveyData}
          columns={tableColumns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                router.push("/surveys/plant-growing");
              }, // click row
            };
          }}
        />
      </Space>
      <Modal
        title="Import new survey"
        open={drawerOpen}
        onCancel={() => {
          setDrawerOpen(false);
        }}
        onOk={() => {
          setDrawerOpen(false);
          router.push("surveys/import");
        }}
      >
        <Dragger
          name="file"
          accept=".csv"
          maxCount={1}
          onChange={(e) => {
            setCsvData(e.file);
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag your csv file to this area to upload
          </p>
          <p className="ant-upload-hint">
            We currently only support csv files exported from Google Forms.
            However we are working on supporting more file types.
          </p>
        </Dragger>
      </Modal>
    </main>
  );
}
