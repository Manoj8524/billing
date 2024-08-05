import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const REACT_APP_SERVER_URL = "https://billingserver.vercel.app";
      const { data } = await axios.get(`${REACT_APP_SERVER_URL}/api/items/get-item`);
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
    // Load categories from localStorage
    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories([
        { name: "Pipes and Tubing" },
        { name: "Fitting and Valves" },
        { name: "Fixtures" },
        { name: "Water Heaters" },
        { name: "Drainage System" },
        { name: "Plumbing Tools" },
        { name: "Plumbing Accessories" },
        { name: "Water Supply Systems" },
        { name: "Pump Systems" },
        { name: "Gas Plumbing" },
      ]);
    }
    //eslint-disable-next-line
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const REACT_APP_SERVER_URL = "https://billingserver.vercel.app";
      await axios.post(`${REACT_APP_SERVER_URL}/api/items/delete-item`, { itemId: record._id });
      message.success("Item Deleted Successfully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer", marginLeft: 12 }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const REACT_APP_SERVER_URL = "https://billingserver.vercel.app";
        await axios.post(`${REACT_APP_SERVER_URL}/api/items/add-item`, value);
        message.success("Item Added Successfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const REACT_APP_SERVER_URL = "https://billingserver.vercel.app";
        await axios.put(`${REACT_APP_SERVER_URL}/api/items/edit-item`, {
          ...value,
          itemId: editItem._id,
        });
        message.success("Item Updated Successfully");
        getAllItems();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    }
  };

  const filteredItemsData = itemsData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DefaultLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h6>Item List</h6>
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", borderRadius: "8px", border: "1px solid #d9d9d9", padding: "8px 16px" }}
          suffix={<SearchOutlined />}
        />
        <Button type="primary" onClick={() => setPopupModal(true)} style={{ marginLeft: "16px",
          backgroundColor:"#21252B",border:"none"
         }}>
          Add Item
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredItemsData} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item" : "Add New Item"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form layout="vertical" initialValues={editItem} onFinish={handleSubmit}>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select>
                {categories.map((category) => (
                  <Select.Option key={category.name} value={category.name}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit" style={{
                backgroundColor:"#282C34",
                border:"none"
              }}>
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
