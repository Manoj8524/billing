import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, message, Form, Input, Select } from "antd";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(18); // Default GST percentage
  const [discountPercentage, setDiscountPercentage] = useState(0); // Default discount percentage
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);

  const handleIncreament = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecreament = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncreament(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecreament(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp += item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const handleSubmit = async (value) => {
    try {
      const tax = Number(((subTotal / 100) * gstPercentage).toFixed(2));
      const discount = Number(((subTotal / 100) * discountPercentage).toFixed(2));
      const totalAmount = Number(subTotal) + tax - discount;

      const newObject = {
        ...value,
        cartItems,
        subTotal,
        tax,
        discount,
        totalAmount,
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };
      const REACT_APP_SERVER_URL = "https://billingserver.vercel.app";
      await axios.post(`${REACT_APP_SERVER_URL}/api/bills/add-bills`, newObject);
      message.success("Bill Generated");
      clearCart();
      navigate("/bills");
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <h1>Cart Page</h1>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex flex-column align-items-end">
        <hr />
        <h3>
          SUB TOTAL : $ <b>{subTotal}</b> /-
        </h3>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Create Invoice
        </Button>
      </div>
      <Modal
        title="Create Invoice"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="customerName" label="Customer Name">
            <Input />
          </Form.Item>
          <Form.Item name="customerNumber" label="Contact Number">
            <Input />
          </Form.Item>
          <Form.Item name="paymentMode" label="Payment Method">
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="G pay">G pay</Select.Option>
              <Select.Option value="Cash and G pay">Cash and G pay</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="gstPercentage" label="GST Percentage">
            <Input
              type="number"
              value={gstPercentage}
              onChange={(e) => setGstPercentage(Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item name="discountPercentage" label="Discount Percentage">
            <Input
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            />
          </Form.Item>
          <div className="bill-it">
            <h5>
              Sub Total : <b>{subTotal}</b>
            </h5>
            <h4>
              TAX ({gstPercentage}%) : <b>{((subTotal / 100) * gstPercentage).toFixed(2)}</b>
            </h4>
            <h4>
              DISCOUNT ({discountPercentage}%) : <b>{((subTotal / 100) * discountPercentage).toFixed(2)}</b>
            </h4>
            <h4>
              GRAND TOTAL : <b>{Number(subTotal) + Number(((subTotal / 100) * gstPercentage).toFixed(2)) - Number(((subTotal / 100) * discountPercentage).toFixed(2))}</b>
            </h4>
          </div>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
