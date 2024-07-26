import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu, Typography, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Spinner from "./Spinner";


const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalCustomer: 0,
    monthlyCustomer: 0,
    dailyCustomer: 0,
    dayIncome: 0,
    monthlyIncome: 0,
  });
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const showLogoutConfirm = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const handleCancel = () => {
    setIsLogoutModalVisible(false);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("https://billingserver-manoj8524s-projects.vercel.app/api/stats");
        const data = await response.json();
        setStats({
          totalCustomer: data.totalCustomer,
          monthlyCustomer: data.monthlyCustomer,
          dailyCustomer: data.dailyCustomer,
          dayIncome: data.dayIncome,
          monthlyIncome: data.monthlyIncome,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout style={{ minHeight: "100vh", minWidth:"760px" }}>
      {loading && <Spinner />}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#ffffff",
          borderRight: "1px solid #ddd",
          paddingTop: "10px",
        }}
      >
        <div
          style={{
            height: "32px",
            margin: "16px",
            background: "none",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#000",
              fontWeight: "bold",
              marginBottom: "4px",
              marginTop: "4px",
              fontSize: "12px",
            }}
          >
            Jeevan Plumbing
          </h1>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
          style={{ backgroundColor: "#f0f2f5" }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">Bills</Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items">Items</Link>
          </Menu.Item>
          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={showLogoutConfirm}
          >
            Logout
          </Menu.Item>
        </Menu>
        <div
          style={{
            textAlign: "center",
            color: "#000",
            fontWeight: "bold",
            marginBottom: "4px",
            width: "100%",
            position: "absolute",
            bottom: "0",
            paddingBottom: "10px",
          }}
        >
          APS TECH
          <br />
          <a href="https://apsengineering.in/">Aps Engineering</a>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f0f2f5",
            boxShadow: "0 0 3px #ccc",
            borderRadius: "5px",
            margin: "4px 16px 0px 16px",
            overflow: "auto",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
              style: { padding: "0 24px", fontSize: "18px", cursor: "pointer" },
            }
          )}
          <div
            className="stats-container"
            style={{
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
              gap: "16px",
              padding: "16px",
            }}
          >
            <div
              className="stat-box"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "0 16px",
                flex: "0 0 auto",
                width: "240px",
                height: "40px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <Text strong>Total Customers:</Text>
              <div style={{ fontSize: "0.9em", margin: "0 0 0 5px" }}>
                {stats.totalCustomer}
              </div>
            </div>
            <div
              className="stat-box"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "0 16px",
                flex: "0 0 auto",
                width: "240px",
                height: "40px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <Text strong>Monthly Customers:</Text>
              <div style={{ fontSize: "0.9em", margin: "0 0 0 5px" }}>
                {stats.monthlyCustomer}
              </div>
            </div>
            <div
              className="stat-box"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "0 16px",
                flex: "0 0 auto",
                width: "240px",
                height: "40px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <Text strong>Daily Customers:</Text>
              <div style={{ fontSize: "0.9em", margin: "0 0 0 5px" }}>
                {stats.dailyCustomer}
              </div>
            </div>
            <div
              className="stat-box"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "0 16px",
                flex: "0 0 auto",
               width: "240px",
                height: "40px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <Text strong>Daily Income:</Text>
              <div style={{ fontSize: "0.9em", margin: "0 0 0 5px" }}>
                ₹{stats.dayIncome.toFixed(2)}
              </div>
            </div>
            <div
              className="stat-box"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "0 16px",
                flex: "0 0 auto",
                width: "240px",
                height: "40px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <Text strong>Monthly Income:</Text>
              <div style={{ fontSize: "0.9em", margin: "0 0 0 5px" }}>
                ₹{stats.monthlyIncome.toFixed(2)}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            <ShoppingCartOutlined
              style={{ fontSize: "18px", cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            />
            <span
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                color: "#001529",
                fontWeight: "bold",
                fontSize: "16px",
              }}
              onClick={() => navigate("/cart")}
            >
              {cartItems.length}
            </span>
          </div>
        </Header>
        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: "#fff",
            minHeight: "280px",
            boxShadow: "0 0 3px #ccc",
            borderRadius: "5px",
          }}
        >
          {children}
        </Content>
      </Layout>
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </Layout>
  );
};

export default DefaultLayout;
