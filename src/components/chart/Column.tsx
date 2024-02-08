import React from "react";
import { Column } from "@ant-design/plots";

export default function DemoColumn() {
  const data = [
    {
      type: "one",
      sales: 38,
    },
    {
      type: "two",
      sales: 52,
    },
    {
      type: "three",
      sales: 61,
    },
    {
      type: "four",
      sales: 145,
    },
    {
      type: "five",
      sales: 48,
    },
    {
      type: "six",
      sales: 38,
    },
    {
      type: "seven",
      sales: 38,
    },
    {
      type: "eight",
      sales: 38,
    },
  ];
  const config = {
    data,
    height: 200,
    xField: "type",
    yField: "sales",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "类别",
      },
      sales: {
        alias: "销售额",
      },
    },
  };
  return <Column {...config} />;
}
