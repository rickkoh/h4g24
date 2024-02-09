"use client";
import { Line } from "@ant-design/charts";
import dynamic from "next/dynamic";
import React from "react";

// Import necessary components from Ant Design
import { Card, Col, Grid, Row, Table } from "antd";
import DemoPie from "@/components/chart/Pie";

export default function Page() {
  // Define columns for the table (even though it will be empty)
  const columns = [
    // Example column
    {
      title: "Responses",
      dataIndex: "exampleDataIndex",
      key: "exampleKey",
    },
  ];

  // Define empty data for the table
  const data: any[] = [];

  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map((_, index) => (
          <Col span={6} key={index}>
            <Card title={`Card ${index + 1}`} bordered={false}>
              <DemoPie />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Table columns={columns} dataSource={data} pagination={false} />
        </Col>
      </Row>
      <div>test</div>
    </div>
  );
}
