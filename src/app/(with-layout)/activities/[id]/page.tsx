"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Collapse, Row, Space, Spin, Table } from "antd";
import WordCloud from "@/components/chart/WordCloud";
import {
  RobotOutlined,
  SmileTwoTone,
  MehTwoTone,
  FrownTwoTone,
} from "@ant-design/icons";
import { GetAllForms } from "@/hooks/supabaseHooks";
import { Survey } from "@/types/types";
import { useRouter } from "next/navigation";
import Paragraph from "antd/es/typography/Paragraph";

// See where the activity data is fetched
// fakeData should be replaced with the attribute called "ai_analysis" from the activity.
const fakeData = {
  summary:
    "Participants enjoyed the well-structured and socially interactive Plants Growing activity, appreciating clear instructions that facilitated seamless participation. The positive feedback indicated an 88.2% likelihood of future engagement in similar activities. Despite this, 71.6% perceived the information source negatively.\n\nFavorite aspects included structured nature (85%), clear instructions (90%), peaceful environment (80%), and social interactions with friends (70%). However, the duration received a lower score at 40%.\n\nOverall, participants favored structured activities with clear guidance and social elements, suggesting a high interest in future engagements. To enhance satisfaction, improvements in information dissemination methods are recommended. The mixed perception of the information source underscores the need for effective communication strategies. Moreover, balancing different activity aspects, including appropriate durations, is crucial to maximize enjoyment and engagement levels.",
  keywords: [
    {
      name: "structured",
      significance: 0.8,
    },
    {
      name: "flow",
      significance: 0.7,
    },
    {
      name: "friends",
      significance: 0.6,
    },
    {
      name: "interaction",
      significance: 0.65,
    },
    {
      name: "instructors",
      significance: 0.85,
    },
    {
      name: "clear",
      significance: 0.9,
    },
    {
      name: "easy",
      significance: 0.75,
    },
    {
      name: "peace",
      significance: 0.7,
    },
    {
      name: "planting",
      significance: 0.8,
    },
    {
      name: "duration",
      significance: 0.4,
    },
  ],
  sentiments: {
    label: "NEGATIVE",
    score: 0.9342803359031677,
  },
};

interface Test {
  text: string;
  value: number;
}

const test: Test[] = [
  {
    text: "structured",
    value: 0.8,
  },
  {
    text: "flow",
    value: 0.7,
  },
  {
    text: "friends",
    value: 0.6,
  },
  {
    text: "interaction",
    value: 0.65,
  },
  {
    text: "instructors",
    value: 0.85,
  },
  {
    text: "clear",
    value: 0.9,
  },
  {
    text: "easy",
    value: 0.75,
  },
  {
    text: "peace",
    value: 0.7,
  },
  {
    text: "planting",
    value: 0.8,
  },
  {
    text: "duration",
    value: 0.4,
  },
];

function SentimentalIcon({ label }: { label: string }) {
  switch (label) {
    case "POSITIVE":
      return (
        <SmileTwoTone
          style={{
            fontSize: "256px",
          }}
        />
      );
    case "NEGATIVE":
      return (
        <FrownTwoTone
          style={{
            fontSize: "256px",
          }}
          twoToneColor="#eb2f96"
        />
      );
    case "NEUTRAL":
      return (
        <MehTwoTone
          style={{
            fontSize: "256px",
          }}
          twoToneColor="#52c41a"
        />
      );
    default:
      return (
        <RobotOutlined
          style={{
            fontSize: "256px",
          }}
        />
      );
  }
}

const tableColumns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Date created",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Last updated",
    dataIndex: "updated_at",
    key: "updated_at",
  },
];

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [allSurveysData, setAllSurveysData] = useState<Survey[]>();
  const [isLoading, setIsLoading] = useState(false);

  const [isAIAnalysisLoading, setIsAIAnalysisLoading] = useState(false);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  function fetchSurveyData() {
    // TODO: Change this to get survey data specific to the activity
    setIsLoading(true);
    GetAllForms().then((data) => {
      if (data) {
        setAllSurveysData(data);
      }
      setIsLoading(false);
    });
  }

  function loadAnalysis() {
    // refresh or load ai analysis
    setIsAIAnalysisLoading(true);
    // post
    fetch(`https://ngrok.adwinang.dev/analyse/activities/id/${id}`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
    }).then((res) => {
      // Update
      setIsAIAnalysisLoading(false);

      // Currently commented out because response is not showing
      // We just assume it's successful

      // Uncomment to debug
      // console.log(res);
      // console.log(res.status);
      // console.log("nice");
      // if (res.status === 200) {
      // console.log("yay");
      // // Make another call to database reload AI components
      // }
    });
  }

  if (isLoading) {
    return <Spin />;
  }

  return (
    <main>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <div className="flex justify-end">
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={() => loadAnalysis()}
          >
            Apply AI Analysis
          </Button>
        </div>
        <div className="site-card-wrapper">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card title="Total number of surveys" bordered={false}></Card>
            </Col>
            <Col span={6}>
              <Card title="Total number of responses" bordered={false}></Card>
            </Col>
            <Col span={6}>
              <Card title="Keyword Analysis" bordered={false}></Card>
            </Col>
            <Col span={6}>
              <Card title="Keyword Analysis" bordered={false}></Card>
            </Col>
            <Col span={8}>
              <Card title="AI Summarised Findings" bordered={false}>
                <div className="max-h-64 pt-8 overflow-scroll flex justify-center items-center">
                  {fakeData.summary ? (
                    <Paragraph>{fakeData.summary}</Paragraph>
                  ) : (
                    <Button
                      type="primary"
                      icon={<RobotOutlined />}
                      onClick={() => loadAnalysis()}
                    >
                      Apply AI Analysis
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Keyword Analysis" bordered={false}>
                <div className="max-h-64 overflow-scroll flex justify-center items-center">
                  {fakeData.keywords ? (
                    <WordCloud data={test} width={256} height={256} />
                  ) : (
                    <Button
                      type="primary"
                      icon={<RobotOutlined />}
                      onClick={() => loadAnalysis()}
                    >
                      Apply AI Analysis
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Overall Activity Sentimental" bordered={false}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    justifyItems: "center",
                  }}
                >
                  {fakeData.sentiments ? (
                    <SentimentalIcon label={fakeData.sentiments.label} />
                  ) : (
                    <Button
                      type="primary"
                      icon={<RobotOutlined />}
                      onClick={() => loadAnalysis()}
                    >
                      Apply AI Analysis
                    </Button>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col span={24}>
              {/* <Table
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
          </Table> */}
            </Col>
          </Row>
        </div>
        <Table
          dataSource={allSurveysData}
          columns={tableColumns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                router.push(`/surveys/${record.id}`);
              },
            };
          }}
        />
      </Space>
    </main>
  );
}
