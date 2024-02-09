import React from "react";
import { Column } from "@ant-design/plots";
import { Response } from "@/types/types";

export default function DemoColumn({ responses }: { responses: Response[] }) {
  function convertResponsetoChartData(responses: Response[]) {
    const countByValue: Record<string, number> = {};
    responses.forEach((response) => {
      countByValue[response.answer] = (countByValue[response.answer] || 0) + 1;
    });
    const data = Object.entries(countByValue).map(([type, value]) => ({ type, value }));
    return data;
  }
  const data = convertResponsetoChartData(responses);

  const config = {
    data,
    height: 200,
    xField: "type",
    yField: "value",
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return <Column {...config} />;
}
