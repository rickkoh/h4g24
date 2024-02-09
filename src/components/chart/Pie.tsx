import React from "react";
import { Pie } from "@ant-design/plots";
import { PieConfig } from "@ant-design/charts";
import { Response } from "@/types/types";

export default function DemoPie({ responses }: { responses: Response[] }) {
  function convertResponsetoChartData(responses: Response[]) {
    const countByValue: Record<string, number> = {};
    responses.forEach((response) => {
      countByValue[response.answer] = (countByValue[response.answer] || 0) + 1;
    });
    const data = Object.entries(countByValue).map(([type, value]) => ({ type, value }));
    return data;
  }
  const data = convertResponsetoChartData(responses);

  const config: PieConfig = {
    appendPadding: 10,
    height: 200,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };
  return <Pie {...config} />;
}
