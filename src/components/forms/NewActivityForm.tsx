"use client";
import { Button, Empty, Form, Input, Radio, Select, Typography } from "antd";
import { useState } from "react";

type LayoutType = Parameters<typeof Form>[0]["layout"];

export default function NewActivityForm() {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  return (
    <Form layout="vertical" form={form} onValuesChange={onFormLayoutChange}>
      <Typography.Title level={3}>New Activity</Typography.Title>
      <Form.Item label="Title">
        <Input placeholder="Activity Title" />
      </Form.Item>
      <Form.Item label="Description">
        <Input placeholder="Porgram Description" />
      </Form.Item>
      <Form.Item label="Surveys">
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Activity Surveys"
          options={[]}
          notFoundContent={<Empty description="No surveys found" />}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Create Activity</Button>
      </Form.Item>
    </Form>
  );
}
