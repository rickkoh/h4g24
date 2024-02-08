import React from "react";
import { Pie } from "@ant-design/plots";
import { PieConfig } from "@ant-design/charts";

export default function DemoPie() {
  const data = [
    {
      type: "one",
      value: 27,
    },
    {
      type: "two",
      value: 25,
    },
    {
      type: "three",
      value: 18,
    },
    {
      type: "four",
      value: 15,
    },
    {
      type: "five",
      value: 10,
    },
    {
      type: "six",
      value: 5,
    },
  ];
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
      content: ({ percent }: { percent: number }) =>
        `${(percent * 100).toFixed(0)}%`,
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
