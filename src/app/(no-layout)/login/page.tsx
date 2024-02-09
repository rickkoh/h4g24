"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Card, message } from "antd";
import supabase from "@/hooks/supabaseConfig";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      message.error(error.message);
    } else {
      message.success("Login successful");
      router.push("/");
    }

    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/");
      }
    });
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Button
        type="primary"
        loading={loading}
        style={{
          backgroundColor: "#1890ff",
          color: "white",
          borderColor: "#1890ff",
          position: "absolute",
          top: 20,
          right: 20,
        }}
        onClick={() => router.push("/register")}
      >
        Sign Up
      </Button>
      <Card title="Login" style={{ width: 300 }}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                backgroundColor: "#1890ff",
                color: "white",
                borderColor: "#1890ff",
              }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
