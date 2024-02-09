"use client";
import { useCsvDataContext } from "@/contexts/CsvDataProvider";
import { getColumnsFromJson, groupResponsesByQuestion } from "@/utility/DataConverter";
import { Button, Empty, Form, Select, Space, Table, message, Spin } from "antd";
import Column from "antd/es/table/Column";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePapaParse } from "react-papaparse";
import { AddAllNewQuestions, AddAllNewResponses, AddNewForm } from "@/hooks/supabaseHooks";
import { ANALYSIS_TYPE, QUESTION_TYPE, FormInsert, QuestionInsert, ResponseInsert } from "@/types/types";
import { set } from "react-hook-form";

export default function Import() {
  const router = useRouter();
  const { readString } = usePapaParse();
  const [isLoading, setIsLoading] = useState(false);
  const [formInsertDetails, setFormInsertDetails] = useState<FormInsert>();
  const [surveyDataSource, setSurveyDataSource] = useState<QuestionInsert[]>([]);
  const [responsesInsertDetails, setResponsesInsertDetails] = useState<ResponseInsert[]>([]);
  const { csvData } = useCsvDataContext();
  const combinedData = useMemo(() => {
    return responsesInsertDetails.map((response) => ({
      ...response,
      question: surveyDataSource.filter((question) => question.id === response.question_id).map((question) => question.text)[0],
    }));
  }, [surveyDataSource, responsesInsertDetails]);

  async function parseCsv() {
    setIsLoading(true);

    // Get form details
    const formName = csvData?.name?.split(".")[0] || "Untitled";
    const formResult = await createForm(formName);
    setFormInsertDetails(formResult);
    // Wrap the readString operation in a promise

    const text = await csvData?.originFileObj?.text();
    if (text === undefined) {
      setIsLoading(false); // Ensure loading is set to false if text is undefined
      return;
    }

    try {
      // Wait for the read operation to complete
      await new Promise((resolve, reject) => {
        readString(text, {
          header: true,
          worker: true,
          complete: (results) => {
            try {
              // one row is one object
              const result = results.data;
              const questionHeaders = getColumnsFromJson(result);
              const questionDataSource = generateQuestionDataSource(questionHeaders, formResult.id);
              setSurveyDataSource(questionDataSource);
              // the column is the key, with an array of all the responses
              const groupedResult = groupResponsesByQuestion(result as any, questionDataSource);
              setResponsesInsertDetails(groupedResult);

              resolve(true); // Resolve the promise after all operations are complete
            } catch (error) {
              reject(error); // Reject the promise if there's an error
            }
          },
        });
      });
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false); // Ensure loading is set to false when operation is complete or if an error occurs
    }
  }

  function generateQuestionDataSource(questionHeaders: { [key: string]: string }[], formId: string | undefined) {
    const data: QuestionInsert[] = [];
    for (let i = 1; i < questionHeaders.length; i++) {
      const question: QuestionInsert = {
        id: crypto.randomUUID(),
        text: questionHeaders[i].title,
        question_type: QUESTION_TYPE.TEXT_ANSWER, // to change
        analysis_type: null,
        form_id: formId,
      };
      data.push(question);
    }
    return data;
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    if (!formInsertDetails) {
      setIsLoading(false);
      return;
    }
    try {
      const addFormResponse = await AddNewForm({ newForm: formInsertDetails });
      const addQuestionResponse = await AddAllNewQuestions({ newQuestions: surveyDataSource });
      const addResponseResponse = await AddAllNewResponses({ newResponses: responsesInsertDetails });

      message.success("Form imported successfully");
      router.push("/surveys");
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("Unable to import form. Please try again.");
    }
    setIsLoading(false);
  }

  async function createForm(name: string) {
    const form: FormInsert = {
      title: name,
      id: crypto.randomUUID(),
      program_id: null,
      activity_id: null,
    };
    return form;
  }

  async function createResponses() {}

  useEffect(() => {
    if (csvData) {
      parseCsv();
    }
  }, [csvData]);

  if (isLoading) {
    return <Spin />;
  }
  return (
    <main>
      <Space size="large" direction="vertical" style={{ display: "flex" }}>
        <Form onSubmitCapture={submit} layout="vertical">
          <Form.Item>
            <Table dataSource={surveyDataSource} pagination={false}>
              <Column title="Question" dataIndex="text" key="text" width={"100%"} />
              <Column
                title="Question Type"
                dataIndex="question_type"
                key="question_type"
                render={(x, y, i) => {
                  return (
                    <Select
                      style={{ width: 120 }}
                      value={surveyDataSource[i].question_type}
                      onChange={(e) => {
                        const data = [...surveyDataSource];
                        data[i].question_type = e;
                        setSurveyDataSource(data);
                      }}
                      className="!w-64"
                      options={[
                        { value: QUESTION_TYPE.TEXT_ANSWER, label: "Text Answer" },
                        {
                          value: QUESTION_TYPE.MULTIPLE_CHOICE,
                          label: "Multiple Choice",
                        },
                        { value: QUESTION_TYPE.CHECKBOX, label: "Checkbox" },
                        { value: QUESTION_TYPE.LINEAR_SCALE, label: "Linear Scale" },
                      ]}
                    />
                  );
                }}
              />
              <Column
                title="Apply Analysis (Optional)"
                dataIndex="analysis_type"
                key="analysis_type"
                render={(x, y, i) => {
                  return (
                    <Select
                      style={{ width: 120 }}
                      value={surveyDataSource[i].analysis_type}
                      onChange={(e) => {
                        const data = [...surveyDataSource];
                        data[i].analysis_type = e;
                        setSurveyDataSource(data);
                      }}
                      className="!w-64"
                      options={[
                        { value: "", label: "None" },
                        {
                          value: ANALYSIS_TYPE.SENTIMENTAL,
                          label: "Sentimental Analysis",
                        },
                        {
                          value: ANALYSIS_TYPE.SUMMARY,
                          label: "Summary Analysis",
                        },
                        {
                          value: ANALYSIS_TYPE.KEYWORD,
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
            <Select size="large" mode="multiple" allowClear style={{ width: "100%" }} placeholder="Activities" options={[]} notFoundContent={<Empty description="No activities found" />} />
          </Form.Item>
          <Table dataSource={combinedData} pagination={false}>
            <Column title="Question" dataIndex="question" key="question" />
            <Column title="Response" dataIndex="answer" key="answer" />
          </Table>
          <Button htmlType="submit" type="primary">
            Import
          </Button>
        </Form>
        <Button type="primary" onClick={() => router.push("/test")}>
          go to test page
        </Button>
      </Space>
    </main>
  );
}
