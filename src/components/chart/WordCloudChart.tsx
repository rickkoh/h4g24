import { WordCloud, WordCloudConfig } from "@ant-design/charts";
import React from "react";
import dynamic from "next/dynamic";

interface WordCloudData {
  word: string;
  weight: number;
  id: number;
}

export default function WordCloudChart({ data }: { data: any[] }) {
  function getDataList(data: any[]) {
    const list: WordCloudData[] = [];
    // change data type
    data.forEach((d) => {
      list.push({
        word: d.name,
        weight: d.value,
        id: list.length,
      });
    });
    return list;
  }

  const config: WordCloudConfig = {
    width: 600,
    height: 400,
    data: getDataList(data),
    maskImage: "https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*07tdTIOmvlYAAAAAAAAAABkARQnAQ",
    wordStyle: {
      rotation: [-Math.PI / 2, Math.PI / 2],
      rotateRatio: 0.5,
      rotationSteps: 4,
      fontSize: [10, 60],
      color: (word: any, weight: any) => {
        return getRandomColor();
      },
      active: {
        shadowColor: "#333333",
        shadowBlur: 10,
      },
      gridSize: 8,
    },
    shape: "cardioid",
    shuffle: false,
    backgroundColor: "#fff",
    tooltip: { visible: true },
    selected: -1,

    // onWordCloudHover: hoverAction,
  };

  function getRandomColor() {
    const arr = ["#5B8FF9", "#5AD8A6", "#5D7092", "#F6BD16", "#E8684A", "#6DC8EC", "#9270CA", "#FF9D4D", "#269A99", "#FF99C3"];
    return arr[Math.floor(Math.random() * (arr.length - 1))];
  }
  return <WordCloud {...config} />;
}
