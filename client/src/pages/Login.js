import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { LoginOutlined } from "@ant-design/icons"; // Import icon

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const REACT_APP_SERVER_URL = "https://billing-server-6caq.onrender.com";
      const res = await axios.post(
        `${REACT_APP_SERVER_URL}/api/users/login`,
        value
      );
      dispatch({ type: "HIDE_LOADING" });
      if (res.data.message === "Login Fail") {
        return message.error("User Not Found");
      } else {
        message.success("User Logged-In Successfully");
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate("/");
      }
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={{ backgroundColor: "#f5f5f5", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
        <h1 style={{ color: "#333" }}>Jeevan Plumbing</h1>
        <h3 style={{ color: "#555" }}>Login Page</h3>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="userId" label="User ID">
            <Input required />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input required type="password" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0 }}>
              Not a user? Please
              <Link to="/register" style={{ marginLeft: "5px" }}> Register Here!</Link>
            </p>
            <Button
              type="text" // Changed to text type
              icon={<LoginOutlined />} // Added icon
              htmlType="submit"
              style={{ color: "#1890ff" }} // Light mode color
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
