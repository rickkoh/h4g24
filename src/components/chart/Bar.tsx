import React from "react";
import { Bar } from "@ant-design/plots";
import { BarConfig } from "@ant-design/charts";
import { Response } from "@/types/types";

export default function DemoBar({ responses }: { responses: Response[] }) {
  function convertResponsetoChartData(responses: Response[]) {
    const countByValue: Record<string, number> = {};
    responses.forEach((response) => {
      const answers = response.answer.split(";");
      answers.forEach((answer) => {
        countByValue[answer] = (countByValue[answer] || 0) + 1;
      });
    });
    const data = Object.entries(countByValue).map(([type, value]) => ({ y: type, x: value }));
    return data;
  }

  const data = convertResponsetoChartData(responses);
  const config: BarConfig = {
    data,
    height: 200,
    xField: "y",
    yField: "x",
    seriesField: "y",
  };
  return <Bar {...config} />;
}
