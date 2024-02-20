"use client";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useCsvDataContext } from "@/contexts/CsvDataProvider";
import {
  AddAllNewQuestions,
  AddAllNewResponses,
  AddNewForm,
  GetAllActivities,
} from "@/hooks/supabaseHooks";
import {
  ANALYSIS_TYPE,
  Activity,
  QUESTION_TYPE,
  QuestionInsert,
  ResponseInsert,
  SurveyInsert,
} from "@/types/types";
import {
  getColumnsFromJson,
  groupResponsesByQuestion,
} from "@/utility/DataConverter";
import { Button, Empty, Form, Select, Space, Spin, Table, message } from "antd";
import Column from "antd/es/table/Column";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePapaParse } from "react-papaparse";

export default function Import() {
  const router = useRouter();
  const { session } = useAuthContext();
  const { readString } = usePapaParse();

  const [isLoading, setIsLoading] = useState(false);

  const [formInsertDetails, setFormInsertDetails] = useState<SurveyInsert>();
  const [surveyDataSource, setSurveyDataSource] = useState<QuestionInsert[]>(
    []
  );
  const [responsesInsertDetails, setResponsesInsertDetails] = useState<
    ResponseInsert[]
  >([]);

  const { csvData } = useCsvDataContext();

  useEffect(() => {
    if (csvData) {
      parseCsv();
    } else {
      router.push("/surveys");
    }
  }, [csvData]);

  const [activites, setActivities] = useState<Activity[]>([]);

  const [selectedActivity, setSelectedActivity] = useState<
    string | undefined
  >();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const activitiesResponse = await GetAllActivities();
    if (activitiesResponse) {
      setActivities(activitiesResponse);
    }
  }

  const combinedData = useMemo(() => {
    return responsesInsertDetails.map((response) => ({
      ...response,
      question: surveyDataSource
        .filter((question) => question.id === response.question_id)
        .map((question) => question.text)[0],
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

              const questionDataSource = generateQuestionDataSource(
                result as any,
                formResult.id
              );
              setSurveyDataSource(questionDataSource);
              // the column is the key, with an array of all the responses
              const groupedResult = groupResponsesByQuestion(
                result as any,
                questionDataSource,
                session?.user.id!
              );
              setResponsesInsertDetails(groupedResult);

              resolve(true); // Resolve the promise after all operations are complete
            } catch (error) {
              reject(error); // Reject the promise if there's an error
            }
          },
        });
      });
    } catch (error) {
      message.error("Unable to process file. Please try again.");
    } finally {
      setIsLoading(false); // Ensure loading is set to false when operation is complete or if an error occurs
    }
  }

  function generateQuestionDataSource(
    result: { [key: string]: string }[],
    formId: string | undefined
  ) {
    const questionHeaders = getColumnsFromJson(result);
    // Get all responses belonging to a question
    const responses = questionHeaders.map((header) => {
      const responses = result.map((row) => row[header.title]);
      return responses;
    });

    const data: QuestionInsert[] = [];
    for (let i = 1; i < questionHeaders.length; i++) {
      const questionType = detectQuestionType(responses[i]);
      const question: QuestionInsert = {
        id: crypto.randomUUID(),
        text: questionHeaders[i].title,
        question_type: questionType,
        analysis_type: ANALYSIS_TYPE.NONE,
        form_id: formId,
        created_by: session?.user.id,
      };
      data.push(question);
    }
    return data;
  }

  // Algorithm to detect question type based on response
  function detectQuestionType(responseObj: string[]): QUESTION_TYPE {
    // Check if all responses are numeric, implying a LINEAR_SCALE
    if (responseObj.every((response) => /^\d+$/.test(response))) {
      return QUESTION_TYPE.LINEAR_SCALE;
    }
    // Check if any response contains a semicolon, implying at least one CHECKBOX response
    else if (
      responseObj.some(
        (response) => response !== undefined && response.includes(";")
      )
    ) {
      return QUESTION_TYPE.CHECKBOX;
    }
    // Default to TEXT_ANSWER if no specific patterns are detected
    else {
      const responseCount = new Map();
      responseObj.forEach((response) => {
        responseCount.set(response, (responseCount.get(response) || 0) + 1);
      });
      const totalResponses = responseObj.length;
      if (totalResponses < 5) {
        return QUESTION_TYPE.TEXT_ANSWER;
      }
      let maxFrequency = 0;
      responseCount.forEach((count) => {
        if (count > maxFrequency) {
          maxFrequency = count;
        }
      });
      const threshold = 0.25;
      if (maxFrequency / totalResponses > threshold) {
        return QUESTION_TYPE.MULTIPLE_CHOICE;
      } else {
        return QUESTION_TYPE.TEXT_ANSWER;
      }
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    if (!formInsertDetails) {
      setIsLoading(false);
      return;
    }
    try {
      await AddNewForm({ newForm: formInsertDetails });
      await AddAllNewQuestions({
        newQuestions: surveyDataSource,
      });
      await AddAllNewResponses({
        newResponses: responsesInsertDetails,
      });

      message.success("Form imported successfully");
      router.push("/surveys");
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("Unable to import form. Please try again.");
    }
    setIsLoading(false);
  }

  async function createForm(name: string) {
    const form: SurveyInsert = {
      title: name,
      id: crypto.randomUUID(),
      program_id: null,
      activity_id: null,
      created_by: session?.user.id,
    };
    return form;
  }

  if (isLoading) {
    return <Spin fullscreen />;
  }
  return (
    <main>
      <Space size="large" direction="vertical" style={{ display: "flex" }}>
        <Form onSubmitCapture={submit} layout="vertical">
          <Form.Item>
            <Table dataSource={surveyDataSource} pagination={false}>
              <Column
                title="Question"
                dataIndex="text"
                key="text"
                width={"100%"}
              />
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
                        {
                          value: QUESTION_TYPE.TEXT_ANSWER,
                          label: "Text Answer",
                        },
                        {
                          value: QUESTION_TYPE.MULTIPLE_CHOICE,
                          label: "Multiple Choice",
                        },
                        { value: QUESTION_TYPE.CHECKBOX, label: "Checkbox" },
                        {
                          value: QUESTION_TYPE.LINEAR_SCALE,
                          label: "Linear Scale",
                        },
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
                        { value: ANALYSIS_TYPE.NONE, label: "None" },
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
          <Form.Item name="activities" label="Activities">
            <Select
              allowClear
              maxCount={1}
              value={formInsertDetails?.activity_id}
              onChange={(e) => {
                setFormInsertDetails({ ...formInsertDetails, activity_id: e });
              }}
              style={{ width: "100%" }}
              placeholder="Program Activities"
              options={activites.map((activity) => {
                return {
                  label: <span>{activity.title}</span>,
                  value: activity.id,
                };
              })}
              notFoundContent={<Empty description="No activities found" />}
            />
          </Form.Item>
          <Table dataSource={combinedData}>
            <Column title="Question" dataIndex="question" key="question" />
            <Column title="Response" dataIndex="answer" key="answer" />
          </Table>
          <Button htmlType="submit" type="primary">
            Import
          </Button>
        </Form>
      </Space>
    </main>
  );
}
