"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Col, Collapse, CollapseProps, Row, Space, Table } from "antd";
import DemoPie from "@/components/chart/Pie";
import { getColumnsFromJson, groupResponsesByQuestion } from "@/utility/DataConverter";
import { RobotOutlined } from "@ant-design/icons";
import DemoColumn from "@/components/chart/Column";
import { useRouter } from "next/navigation";
import { GetFormById, GetQuestionByFormId, GetResponseByQuestionId } from "@/hooks/supabaseHooks";
import { Question, Response } from "@/types/types";

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

const surveyResult = require("@/data/survey_result.json");

export default function Page({ params }: { params: { id: string } }) {
  const columns = getColumnsFromJson(surveyResult);
  const router = useRouter();
  const { id } = params;
  const [formQuestions, setFormQuestions] = useState<Question[]>();
  const [formResponses, setFormResponses] = useState<Response[]>();

  // Not completed
  useEffect(() => {
    // console.log(columns.length);
    GetFormById({ formId: id });
    GetQuestionByFormId({ formId: id }).then((questions) => {
      console.log(questions);
      if (questions) {
        setFormQuestions(questions);
        const responsePromises = questions.map((question) => GetResponseByQuestionId({ questionId: question.id }));

        Promise.all(responsePromises).then((responses) => {
          console.log(responses);
        });
      }
    });
  }, [id]);

  /* useEffect(() => {
    // console.log(columns.length);
    const newData = groupResponsesByQuestion(surveyResult);
    console.log(newData);
  }, []); */

  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        {columns.slice(1, 8).map((column, index) => (
          <Col span={index !== 6 ? 6 : 12} key={index}>
            <Card title={`${column.title}`} bordered={false}>
              {index % 2 == 0 ? (
                index !== 6 ? (
                  <DemoPie />
                ) : (
                  <Space direction="horizontal" size="large" style={{ display: "flex", height: "200px" }}>
                    <Avatar size={64} icon={<RobotOutlined />} />
                    <Collapse items={items} defaultActiveKey={["1"]} className="!w-full" />
                  </Space>
                )
              ) : (
                <DemoColumn />
              )}
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Table columns={columns} dataSource={surveyResult} scroll={{ x: "max-content" }} />
        </Col>
      </Row>
    </div>
  );
}
