"use client";
import { useAuthContext } from "@/contexts/AuthProvider";
import { AddNewProgram, GetAllActivities, LinkActivityToProgram } from "@/hooks/supabaseHooks";
import { Activity, ProgramInsert } from "@/types/types";
import { Button, Empty, Form, Input, Select, Typography } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type LayoutType = Parameters<typeof Form>[0]["layout"];

export default function NewProgramForm({ onClose }: { onClose: Dispatch<SetStateAction<boolean>> }) {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [activites, setActivities] = useState<Activity[]>([]);
  const { session } = useAuthContext();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const activitiesResponse = await GetAllActivities();
    if (activitiesResponse) {
      setActivities(activitiesResponse);
    }
  }

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const onSubmit = () => {
    onClose(false);
    const program = form.getFieldsValue();
    const newProgramId = crypto.randomUUID();
    const newProgram: ProgramInsert = {
      id: newProgramId,
      title: program.title,
      description: program.description,
      created_by: session?.user.id,
    };
    console.log(program);
    AddNewProgram({ newProgram });
    for (const activity of program.activities) {
      LinkActivityToProgram({ programId: newProgramId, activityId: activity });
    }
    fetchData();
  };

  return (
    <Form layout="vertical" form={form} onValuesChange={onFormLayoutChange} onFinish={onSubmit}>
      <Typography.Title level={3}>New Program</Typography.Title>
      <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the activity title!" }]}>
        <Input placeholder="Program Title" />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
        <Input placeholder="Program Description" />
      </Form.Item>
      <Form.Item name="activities" label="Activities">
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Program Activities"
          options={activites.map((activity) => {
            return { label: <span>{activity.title}</span>, value: activity.id };
          })}
          notFoundContent={<Empty description="No activities found" />}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Program
        </Button>
      </Form.Item>
    </Form>
  );
}
