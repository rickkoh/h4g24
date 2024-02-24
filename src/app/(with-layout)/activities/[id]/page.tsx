"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Collapse, Row, Space, Spin, Table, Typography } from "antd";
import WordCloud from "@/components/chart/WordCloud";
import { RobotOutlined, SmileTwoTone, MehTwoTone, FrownTwoTone } from "@ant-design/icons";
import { GetActivityById, GetFormByActivityId } from "@/hooks/supabaseHooks";
import { Activity, Survey, AnalysisOutput } from "@/types/types";
import { useRouter } from "next/navigation";
import Paragraph from "antd/es/typography/Paragraph";
import { format } from "date-fns";
import { Json } from "@/types/supabase";

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

function mapKeywordsToWordCloudData(keywords: { name: string; significance: number }[]) {
  return keywords.map((keyword) => {
    return {
      text: keyword.name,
      value: keyword.significance,
    };
  });
}

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

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [activity, setActivity] = useState<Activity>();
  const [analysisOutput, setAnalysisOutput] = useState<AnalysisOutput>();

  useEffect(() => {
    fetchActivityData();
  }, []);

  function fetchActivityData() {
    setIsLoading(true);
    GetActivityById({ activityId: id }).then((data) => {
      if (data) {
        setActivity(data);
        if (data.analysis_output) {
          setAnalysisOutput(data.analysis_output as unknown as AnalysisOutput);
        }
      }
      setIsLoading(false);
    });
  }

  const { id } = params;
  const [allSurveysData, setAllSurveysData] = useState<Survey[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [isAIAnalysisLoading, setIsAIAnalysisLoading] = useState(false);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  function fetchSurveyData() {
    setIsTableLoading(true);
    GetFormByActivityId({ activityId: id }).then((data) => {
      if (data) {
        setAllSurveysData(data);
      }
      setIsTableLoading(false);
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

      fetchActivityData();

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

  if (isLoading || !activity || !allSurveysData) {
    return <Spin />;
  }

  return (
    <main>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <div className="flex justify-end">
          <Button type="primary" icon={<RobotOutlined />} onClick={() => loadAnalysis()}>
            Apply AI Analysis
          </Button>
        </div>
        <div className="site-card-wrapper">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card title="Title" bordered={false}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    justifyItems: "center",
                  }}
                >
                  <Typography.Title level={1}>{activity?.title}</Typography.Title>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Total number of surveys" bordered={false}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    justifyItems: "center",
                  }}
                >
                  <Typography.Title level={1}>{allSurveysData?.length}</Typography.Title>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Total number of responses" bordered={false}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    justifyItems: "center",
                  }}
                >
                  <Typography.Title level={1}>120</Typography.Title>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Date Created" bordered={false}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    justifyItems: "center",
                  }}
                >
                  <Typography.Title level={1}>{activity?.created_at ? format(activity!.created_at, "dd/MM/yyyy") : ""}</Typography.Title>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="AI Summarised Findings" bordered={false}>
                <div className="max-h-64 pt-8 overflow-scroll flex justify-center items-center">
                  {analysisOutput?.summary ? (
                    <Paragraph>{analysisOutput.summary}</Paragraph>
                  ) : isAIAnalysisLoading ? (
                    <Spin />
                  ) : (
                    <Button type="primary" icon={<RobotOutlined />} onClick={() => loadAnalysis()}>
                      Apply AI Analysis
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Keyword Analysis" bordered={false}>
                <div className="max-h-64 overflow-scroll flex justify-center items-center">
                  {analysisOutput?.keywords ? (
                    <WordCloud data={mapKeywordsToWordCloudData(analysisOutput.keywords)} width={256} height={256} />
                  ) : isAIAnalysisLoading ? (
                    <Spin />
                  ) : (
                    <Button type="primary" icon={<RobotOutlined />} onClick={() => loadAnalysis()}>
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
                  {analysisOutput?.sentiments ? (
                    <SentimentalIcon label={analysisOutput.sentiments.label} />
                  ) : isAIAnalysisLoading ? (
                    <Spin />
                  ) : (
                    <Button type="primary" icon={<RobotOutlined />} onClick={() => loadAnalysis()}>
                      Apply AI Analysis
                    </Button>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col span={24}>
              {isTableLoading ? (
                <Spin />
              ) : (
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
              )}
            </Col>
          </Row>
        </div>
      </Space>
    </main>
  );
}
