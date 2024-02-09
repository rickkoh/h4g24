"use client";
import React from "react";
import { Form, Input, Button, message } from "antd";
import supabase from "@/hooks/supabaseConfig";

const RegisterPage = () => {
  const onFinish = async (values: any) => {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.username,
        },
      },
    });
    if (error) {
      message.error(error.message);
    } else {
      message.success("Register successful");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <Form name="register" onFinish={onFinish} className="flex flex-col space-y-10">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: "Please input your username!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "The input is not valid email!" },
              { required: true, message: "Please input your email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please input your password!" }]} hasFeedback>
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
