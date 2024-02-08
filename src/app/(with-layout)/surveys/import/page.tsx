"use client";
import { useCsvDataContext } from "@/contexts/CsvDataProvider";
import { groupResponsesByQuestion } from "@/utility/DataConverter";
import { Button, Empty, Form, Select, Space, Table } from "antd";
import Column from "antd/es/table/Column";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { usePapaParse } from "react-papaparse";

const dataSource = [
  {
    column: "Name",
    type: "Short Answer",
  },
  {
    column: "Did you like the program",
    type: "Short Answer",
  },
];

export default function Import() {
  const router = useRouter();
  const { readString } = usePapaParse();
  const [text, setText] = useState("test");

  const { csvData } = useCsvDataContext();

  async function test() {
    console.log(csvData);

    // ts-ignore
    const text = await csvData?.originFileObj!.text();
    if (text === undefined) return;
    readString(text, {
      header: true,
      worker: true,
      complete: (results) => {
        // one row is one object
        const result = results.data;
        console.log(result);
        // the column is the key, with an array of all the responses
        const groupedResult = groupResponsesByQuestion(result as any);
        console.log(groupedResult);

        // make it async function
        // add question first, get the question id
        // add all responses with the new question id
      },
    });
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    console.log("hi");
    e.preventDefault();
    let string = "";
    for (let i = 0; i < dataSource.length; i++) {
      string += dataSource[i].column + " " + type[i] + " " + analysis[i] + "\n";
      console.log(dataSource[i].column, type[i], analysis[i]);
    }
    setText(string);
  }

  const [type, setType] = useState(["text-answer", "multiple-choice"]);
  const [analysis, setAnalysis] = useState(["", ""]);

  return (
    <main>
      <Space size="large" direction="vertical" style={{ display: "flex" }}>
        <Form onSubmitCapture={submit} layout="vertical">
          <Form.Item>
            <Table dataSource={dataSource} pagination={false}>
              <Column
                title="Column"
                dataIndex="column"
                key="column"
                width={"100%"}
              />
              <Column
                title="Type"
                dataIndex="type"
                key="type"
                render={(x, y, i) => {
                  return (
                    <Select
                      style={{ width: 120 }}
                      value={type[i]}
                      onChange={(e) => {
                        const data = [...type];
                        data[i] = e;
                        setType(data);
                      }}
                      className="!w-64"
                      options={[
                        { value: "text-answer", label: "Text Answer" },
                        {
                          value: "multiple-choice",
                          label: "Multiple Choice",
                        },
                        { value: "checkbox", label: "Checkbox" },
                        { value: "linear-scale", label: "Linear Scale" },
                      ]}
                    />
                  );
                }}
              />
              <Column
                title="Apply Analysis (Optional)"
                dataIndex="analysis"
                key="analysis"
                render={(x, y, i) => {
                  return (
                    <Select
                      style={{ width: 120 }}
                      value={analysis[i]}
                      onChange={(e) => {
                        const data = [...analysis];
                        data[i] = e;
                        setAnalysis(data);
                      }}
                      className="!w-64"
                      options={[
                        { value: "", label: "None" },
                        {
                          value: "sentimental-analysis",
                          label: "Sentimental Analysis",
                        },
                        {
                          value: "summary-analysis",
                          label: "Summary Analysis",
                        },
                        {
                          value: "keyword-analysis",
                          label: "Keyword Analysis",
                        },
                      ]}
                    />
                  );
                }}
              />
            </Table>
          </Form.Item>
          <Form.Item>
            <Select
              size="large"
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Activities"
              options={[]}
              notFoundContent={<Empty description="No activities found" />}
            />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Import
          </Button>
        </Form>
        <Button type="primary" onClick={() => router.push("/test")}>
          go to test page
        </Button>
        <p>{text}</p>
        <button onClick={test}>TEST BUTTON</button>
      </Space>
    </main>
  );
}
