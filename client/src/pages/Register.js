import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const REACT_APP_SERVER_URL = "https://billing-server-6caq.onrender.com";
      await axios.post(
        `${REACT_APP_SERVER_URL}/api/users/register`,
        values
      );
      message.success("Register Successfully");
      navigate("/login");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  //currently login user
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="register">
        <div className="register-form">
          <h1>Jeevan Plumbing</h1>
          <h3>Register Page</h3>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="userId"
              label="User ID"
              rules={[{ required: true, message: "Please input your User ID!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between">
              <p>
                Already Registered? Please
                <Link to="/login"> Login Here!</Link>
              </p>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
