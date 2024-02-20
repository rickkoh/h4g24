"use client";
import React, { useState } from "react";
import { Card, Col, Row, Spin } from "antd";
import WordCloud from "@/components/chart/WordCloud";

const words = [
  {
    text: "China",
    value: 1383220000,
  },
  {
    text: "India",
    value: 1316000000,
  },
  {
    text: "United States",
    value: 324982000,
  },
  {
    text: "Indonesia",
    value: 263510000,
  },
  {
    text: "Brazil",
    value: 207505000,
  },
  {
    text: "Pakistan",
    value: 196459000,
  },
  {
    text: "Nigeria",
    value: 191836000,
  },
  {
    text: "Bangladesh",
    value: 162459000,
  },
  {
    text: "Russia",
    value: 146804372,
  },
  {
    text: "Japan",
    value: 126790000,
  },
  {
    text: "Mexico",
    value: 123518000,
  },
  {
    text: "Ethiopia",
    value: 104345000,
  },
  {
    text: "Philippines",
    value: 104037000,
  },
  {
    text: "Egypt",
    value: 93013300,
  },
  {
    text: "Vietnam",
    value: 92700000,
  },
  {
    text: "Germany",
    value: 82800000,
  },
  {
    text: "Democratic Republic of the Congo",
    value: 82243000,
  },
  {
    text: "Iran",
    value: 80135400,
  },
  {
    text: "Turkey",
    value: 79814871,
  },
  {
    text: "Thailand",
    value: 68298000,
  },
  {
    text: "France",
    value: 67013000,
  },
  {
    text: "United Kingdom",
    value: 65110000,
  },
  {
    text: "Italy",
    value: 60599936,
  },
  {
    text: "Tanzania",
    value: 56878000,
  },
  {
    text: "South Africa",
    value: 55908000,
  },
  {
    text: "Myanmar",
    value: 54836000,
  },
  {
    text: "South Korea",
    value: 51446201,
  },
  {
    text: "Colombia",
    value: 49224700,
  },
  {
    text: "Kenya",
    value: 48467000,
  },
  {
    text: "Spain",
    value: 46812000,
  },
  {
    text: "Argentina",
    value: 43850000,
  },
  {
    text: "Ukraine",
    value: 42541633,
  },
  {
    text: "Sudan",
    value: 42176000,
  },
  {
    text: "Uganda",
    value: 41653000,
  },
  {
    text: "Algeria",
    value: 41064000,
  },
  {
    text: "Poland",
    value: 38424000,
  },
  {
    text: "Iraq",
    value: 37883543,
  },
  {
    text: "Canada",
    value: 36541000,
  },
  {
    text: "Morocco",
    value: 34317500,
  },
  {
    text: "Saudi Arabia",
    value: 33710021,
  },
  {
    text: "Uzbekistan",
    value: 32121000,
  },
  {
    text: "Malaysia",
    value: 32063200,
  },
  {
    text: "Peru",
    value: 31826018,
  },
  {
    text: "Venezuela",
    value: 31431164,
  },
  {
    text: "Nepal",
    value: 28825709,
  },
  {
    text: "Angola",
    value: 28359634,
  },
  {
    text: "Ghana",
    value: 28308301,
  },
  {
    text: "Yemen",
    value: 28120000,
  },
  {
    text: "Afghanistan",
    value: 27657145,
  },
  {
    text: "Mozambique",
    value: 27128530,
  },
  {
    text: "Australia",
    value: 24460900,
  },
  {
    text: "North Korea",
    value: 24213510,
  },
  {
    text: "Cameroon",
    value: 23248044,
  },
  {
    text: "Ivory Coast",
    value: 22671331,
  },
  {
    text: "Madagascar",
    value: 22434363,
  },
  {
    text: "Niger",
    value: 21564000,
  },
  {
    text: "Sri Lanka",
    value: 21203000,
  },
  {
    text: "Romania",
    value: 19760000,
  },
  {
    text: "Burkina Faso",
    value: 19632147,
  },
  {
    text: "Syria",
    value: 18907000,
  },
  {
    text: "Mali",
    value: 18875000,
  },
  {
    text: "Malawi",
    value: 18299000,
  },
  {
    text: "Chile",
    value: 18191900,
  },
  {
    text: "Kazakhstan",
    value: 17975800,
  },
  {
    text: "Netherlands",
    value: 17121900,
  },
  {
    text: "Ecuador",
    value: 16737700,
  },
  {
    text: "Guatemala",
    value: 16176133,
  },
  {
    text: "Zambia",
    value: 15933883,
  },
  {
    text: "Cambodia",
    value: 15626444,
  },
  {
    text: "Senegal",
    value: 15256346,
  },
  {
    text: "Chad",
    value: 14965000,
  },
  {
    text: "Zimbabwe",
    value: 14542235,
  },
  {
    text: "Guinea",
    value: 13291000,
  },
  {
    text: "South Sudan",
    value: 12131000,
  },
  {
    text: "Rwanda",
    value: 11553188,
  },
  {
    text: "Belgium",
    value: 11356191,
  },
  {
    text: "Tunisia",
    value: 11299400,
  },
  {
    text: "Cuba",
    value: 11239004,
  },
  {
    text: "Bolivia",
    value: 11145770,
  },
  {
    text: "Somalia",
    value: 11079000,
  },
  {
    text: "Haiti",
    value: 11078033,
  },
  {
    text: "Greece",
    value: 10783748,
  },
  {
    text: "Benin",
    value: 10653654,
  },
  {
    text: "Czech Republic",
    value: 10578820,
  },
  {
    text: "Portugal",
    value: 10341330,
  },
  {
    text: "Burundi",
    value: 10114505,
  },
  {
    text: "Dominican Republic",
    value: 10075045,
  },
  {
    text: "Sweden",
    value: 10054100,
  },
  {
    text: "United Arab Emirates",
    value: 10003223,
  },
  {
    text: "Jordan",
    value: 9889270,
  },
  {
    text: "Azerbaijan",
    value: 9823667,
  },
  {
    text: "Hungary",
    value: 9799000,
  },
  {
    text: "Belarus",
    value: 9498600,
  },
  {
    text: "Honduras",
    value: 8866351,
  },
  {
    text: "Austria",
    value: 8773686,
  },
  {
    text: "Tajikistan",
    value: 8742000,
  },
  {
    text: "Israel",
    value: 8690220,
  },
  {
    text: "Switzerland",
    value: 8417700,
  },
  {
    text: "Papua New Guinea",
    value: 8151300,
  },
];

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Spin />;
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="Keyword Analysis" bordered={false}>
            <WordCloud data={words} width={260} height={260} />
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
  );
}
