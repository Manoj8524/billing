import React, { useEffect, useState, useRef, useCallback } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table, Input, Row, Col } from "antd";

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBills = useCallback(async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const REACT_APP_SERVER_URL = "https://billingserver-manoj8524s-projects.vercel.app";
      const { data } = await axios.get(`${REACT_APP_SERVER_URL}/api/bills/get-bills`);
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    { title: "ID", dataIndex: "_id", width: 80 },
    { title: "Customer Name", dataIndex: "customerName", width: 150 },
    { title: "Contact No", dataIndex: "customerNumber", width: 120 },
    { title: "Subtotal", dataIndex: "subTotal", width: 100 },
    { title: "Tax", dataIndex: "tax", width: 100 },
    { title: "Total Amount", dataIndex: "totalAmount", width: 120 },
    { title: "Payment Mode", dataIndex: "paymentMode", width: 150 },
    { title: "Date", dataIndex: "date", width: 150 },
    { title: "Time", dataIndex: "time", width: 100 },
    {
      title: "View",
      dataIndex: "_id",
      width: 60,
      render: (id, record) => (
        <EyeOutlined
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedBill(record);
            setPopupModal(true);
          }}
        />
      ),
    },
  ];

  const filteredBills = billsData.filter((bill) =>
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DefaultLayout>
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={16} md={12}>
          <h6>Invoice List</h6>
        </Col>
        <Col xs={24} sm={8} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Input
            placeholder="Search bills..."
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
        dataSource={filteredBills}
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }} // Enable horizontal scrolling for table
      />

      {popupModal && (
        <Modal
          width="500px"
          title="Invoice Details"
          visible={popupModal}
          onCancel={() => setPopupModal(false)}
          footer={[
            <Button key="back" onClick={() => setPopupModal(false)}>
              Close
            </Button>,
            <Button key="print" type="primary" onClick={handlePrint}>
              Print
            </Button>,
          ]}
          style={{ maxWidth: '100%' }}
          bodyStyle={{ overflowX: 'auto' }}
        >
          <div ref={componentRef} style={{ padding: '20px', backgroundColor: '#fff' }}>
            <Row gutter={16}>
              <Col span={24} style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h2>Jeevan Plumbing</h2>
                <p>Contact: 9234445834 | NGO Colony, Thirunelveli</p>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <p>
                  Customer Name: <b>{selectedBill.customerName}</b>
                  <br />
                  Phone No: <b>{selectedBill.customerNumber}</b>
                  <br />
                  Date: <b>{new Date(selectedBill.date).toLocaleDateString()}</b>
                  <br />
                  Time: <b>{selectedBill.time}</b>
                </p>
                <hr />
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Table
                  columns={[
                    { title: 'Item', dataIndex: 'name', key: 'name' },
                    { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
                    { title: 'Price', dataIndex: 'price', key: 'price' },
                    { title: 'Total', dataIndex: 'total', key: 'total' },
                  ]}
                  dataSource={selectedBill.cartItems.map(item => ({
                    ...item,
                    total: item.quantity * item.price
                  }))}
                  pagination={false}
                  bordered
                  size="small"
                />
                <Row>
                  <Col span={24}>
                    <p><strong>GST:</strong> Rs {selectedBill.tax}</p>
                    <p><strong>Grand Total:</strong> Rs {selectedBill.totalAmount}</p>
                  </Col>
                </Row>
                <p>
                  <strong>Thank you for your visit!</strong> 18% GST is applied on the total amount. This amount is non-refundable. For assistance, please email <b>jeevanpluming@example.com</b>.
                </p>
              </Col>
            </Row>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
