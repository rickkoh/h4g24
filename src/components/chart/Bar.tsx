import React from "react";
import { Bar } from "@ant-design/plots";
import { BarConfig } from "@ant-design/charts";

// convert the json response to the format of the respective chart

export default function DemoBar() {
  const data = [
    {
      y: "1951",
      x: 38,
    },
    {
      y: "1952",
      x: 52,
    },
    {
      y: "1956",
      x: 61,
    },
    {
      y: "1957",
      x: 145,
    },
    {
      y: "1958",
      x: 48,
    },
  ];
  const config: BarConfig = {
    data,
    height: 200,
    xField: "y",
    yField: "x",
    seriesField: "y",
    legend: {
      position: "top-left",
    },
  };
  return <Bar {...config} />;
}
