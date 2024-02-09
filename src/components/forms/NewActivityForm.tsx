"use client";
import { useAuthContext } from "@/contexts/AuthProvider";
import { AddNewActivity, GetAllForms, LinkFormToActivity } from "@/hooks/supabaseHooks";
import { ActivityInsert, Survey } from "@/types/types";
import { Button, Empty, Form, Input, Select, Typography } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type LayoutType = Parameters<typeof Form>[0]["layout"];

export default function NewActivityForm({ onClose }: { onClose: Dispatch<SetStateAction<boolean>> }) {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const { session } = useAuthContext();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const surveyResponse = await GetAllForms();
    if (surveyResponse) {
      setSurveys(surveyResponse);
    }
  }

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const onSubmit = () => {
    onClose(false);
    const activity = form.getFieldsValue();
    const newActivityId = crypto.randomUUID();
    const newActivity: ActivityInsert = {
      id: newActivityId,
      title: activity.title,
      description: activity.description,
      created_by: session?.user.id,
    };
    AddNewActivity({ newActivity });
    if (activity.surveys) {
      for (const survey of activity.surveys) {
        LinkFormToActivity({ formId: survey, activityId: newActivityId });
      }
    }
    fetchData();
  };

  return (
    <Form layout="vertical" form={form} onValuesChange={onFormLayoutChange} onFinish={onSubmit}>
      <Typography.Title level={3}>New Activity</Typography.Title>
      <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the activity title!" }]}>
        <Input placeholder="Activity Title" />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
        <Input placeholder="Activity Description" />
      </Form.Item>
      <Form.Item name="surveys" label="Surveys">
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Activity Surveys"
          options={surveys.map((survey) => {
            return { label: <span>{survey.title}</span>, value: survey.id };
          })}
          notFoundContent={<Empty description="No surveys found" />}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Activity
        </Button>
      </Form.Item>
    </Form>
  );
}
