"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Collapse,
  CollapseProps,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import DemoPie from "@/components/chart/Pie";
import { RobotOutlined } from "@ant-design/icons";
import DemoColumn from "@/components/chart/Column";
import {
  GetFormById,
  GetQuestionByFormId,
  GetResponseByQuestionId,
} from "@/hooks/supabaseHooks";
import { Question, Response } from "@/types/types";
import Column from "antd/es/table/Column";
import DemoBar from "@/components/chart/Bar";

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "What do most people say?",
    children: (
      <p>
        Most people like the program and give a positive feedback. However,
        there are some people who give a negative feedback, particularly about
        the program's duration.
      </p>
    ),
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>Hello world</p>,
  },
];

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [formResponses, setFormResponses] = useState<Map<Question, Response[]>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    setIsLoading(true);
    const form = await GetFormById({ formId: id });
    const questions = await GetQuestionByFormId({ formId: id });
    if (questions) {
      const responsesMap = new Map<Question, Response[]>();
      await Promise.all(
        questions.map(async (question) => {
          const responseResult = await GetResponseByQuestionId({
            questionId: question.id,
          });
          responsesMap.set(question, responseResult || []);
        })
      );

      setFormResponses(responsesMap);
      setIsLoading(false);
      return responsesMap;
    }
  }

  const renderChart = (question: Question, responses: Response[]) => {
    switch (question.question_type) {
      case "TEXT_ANSWER":
        return (
          <Space
            direction="horizontal"
            size="large"
            style={{ display: "flex", height: "200px" }}
          >
            <Avatar size={64} icon={<RobotOutlined />} />
            <Collapse items={items} defaultActiveKey={[]} className="!w-full" />
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
        {Array.from(formResponses, ([question, responses], index) => {
          return (
            <Col span={index !== 6 ? 6 : 12} key={index}>
              <Card title={`${question.text}`} bordered={false}>
                {renderChart(question, responses)}
              </Card>
            </Col>
          );
        })}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Table
            dataSource={Array.from(formResponses, ([question, responses]) => {
              return {
                question: question.text,
                responses: responses
                  .map((response) => response.answer)
                  .join(", "),
              };
            })}
            scroll={{ x: "max-content" }}
          >
            <Column title="Question" dataIndex="question" key="question" />
            <Column title="Responses" dataIndex="responses" key="responses" />
          </Table>
        </Col>
      </Row>
    </div>
  );
}
