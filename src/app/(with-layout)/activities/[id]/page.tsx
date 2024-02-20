"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Col, Collapse, CollapseProps, Row, Space, Spin, Table } from "antd";
import DemoPie from "@/components/chart/Pie";
import { RobotOutlined } from "@ant-design/icons";
import DemoColumn from "@/components/chart/Column";
import { GetFormById, GetQuestionByFormId, GetResponseByQuestionId } from "@/hooks/supabaseHooks";
import { Question, Response } from "@/types/types";
import Column from "antd/es/table/Column";
import DemoBar from "@/components/chart/Bar";
import WordCloudChart from "@/components/chart/WordCloudChart";

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "What do most people say?",
    children: <p>Most people like the program and give a positive feedback. However, there are some people who give a negative feedback, particularly about the program's duration.</p>,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>Hello world</p>,
  },
];

const mockWordData = [
  { name: "word1", value: 100 },
  { name: "word2", value: 200 },
  { name: "word3", value: 300 },
  { name: "word4", value: 400 },
  { name: "word5", value: 500 },
  { name: "word6", value: 600 },
  { name: "word7", value: 700 },
  { name: "word8", value: 800 },
  { name: "word9", value: 900 },
  { name: "word10", value: 1000 },
];

export default function ActivitesDashboardPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false);

  const renderChart = (question: Question, responses: Response[]) => {
    switch (question.question_type) {
      case "TEXT_ANSWER":
        return (
          <Space direction="horizontal" size="large" style={{ display: "flex", height: "200px" }}>
            <Avatar size={64} icon={<RobotOutlined />} />
            <Collapse items={items} defaultActiveKey={["1"]} className="!w-full" />
          </Space>
        );
      case "MULTIPLE_CHOICE":
        return <DemoPie responses={responses} />;
      case "CHECKBOX":
        return <DemoBar responses={responses} />;
      case "LINEAR_SCALE":
        return <DemoColumn responses={responses} />;
      default:
        return <p>Error displaying graph</p>;
    }
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col>
          <Card title={`test`} bordered={false}>
            <DemoColumn responses={[]} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
