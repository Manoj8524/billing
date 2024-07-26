import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table, Input, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const CustomerPage = () => {
  const [billsData, setBillsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const REACT_APP_SERVER_URL = "https://billingserver-manoj8524s-projects.vercel.app";
      const { data } = await axios.get(`${REACT_APP_SERVER_URL}/api/bills/get-bills`);
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBills();
    // eslint-disable-next-line
  }, []);

  const filteredBillsData = billsData.filter((bill) =>
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "ID", dataIndex: "_id", width: 100 },
    { title: "Customer Name", dataIndex: "customerName", width: 200 },
    { title: "Contact No", dataIndex: "customerNumber", width: 150 },
    { title: "Payment Mode", dataIndex: "paymentMode", width: 150 },
    { title: "Total Amount", dataIndex: "totalAmount", width: 150 },
    { title: "Date", dataIndex: "date", width: 150 },
    { title: "Time", dataIndex: "time", width: 100 },
  ];

  return (
    <DefaultLayout>
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col xs={24} md={12}>
          <h6 style={{ color: "#262A31" }}>Customer Page</h6>
        </Col>
        <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Input
            placeholder="Search customers..."
            suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
              padding: '8px 16px',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredBillsData}
        bordered
        pagination={false}
        scroll={{ x: true }} // Add horizontal scrolling for smaller screens
      />
    </DefaultLayout>
  );
};

export default CustomerPage;
