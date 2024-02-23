"use client";
import React, { useState } from "react";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";

export interface WordData {
  text: string;
  value: number;
}

const colors = [
  "#143059",
  "#2F6B9A",
  "#82a6c2",
  "#2D9BE9",
  "#F38895",
  "#EDC652",
];

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const fixedValueGenerator = () => 0.5;

type SpiralType = "archimedean" | "rectangular";

interface WordCloudProps {
  width: number;
  height: number;
  data: WordData[];
  // showControls?: boolean;
}

export default function WordCloud(props: WordCloudProps) {
  // const [spiralType, setSpiralType] = useState<SpiralType>("archimedean");
  // const [withRotation, setWithRotation] = useState(false);

  const fontScale = scaleLog({
    domain: [
      Math.min(...props.data.map((w) => w.value)),
      Math.max(...props.data.map((w) => w.value)),
    ],
    range: [10, 40],
  });
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  return (
    <div className="wordcloud">
      <Wordcloud
        words={props.data}
        width={props.width}
        height={props.height}
        fontSize={fontSizeSetter}
        font={"Impact"}
        padding={2}
        // spiral={spiralType}
        spiral="rectangular"
        // rotate={withRotation ? getRotationDegree : 0}
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      {/* {showControls && (
        <div>
          <label>
            Spiral type &nbsp;
            <select
              onChange={(e) => setSpiralType(e.target.value as SpiralType)}
              value={spiralType}
            >
              <option key={"archimedean"} value={"archimedean"}>
                archimedean
              </option>
              <option key={"rectangular"} value={"rectangular"}>
                rectangular
              </option>
            </select>
          </label>
          <label>
            With rotation &nbsp;
            <input
              type="checkbox"
              checked={withRotation}
              onChange={() => setWithRotation(!withRotation)}
            />
          </label>
          <br />
        </div>
      )} */}
      <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
    </div>
  );
}
