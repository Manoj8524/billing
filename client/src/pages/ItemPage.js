import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Modal, Button, Table, Form, Input, Select, message } from "antd";
const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  // const notAllowed = () => {
  //   message.error("This function is not allowed in demo mode");
  // };
  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const REACT_APP_SERVER_URL= "https://billing-server-6caq.onrender.com";
      const { data } = await axios.get(
        `${REACT_APP_SERVER_URL}/api/items/get-item`
      );
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllItems();
    //eslint-disable-next-line
  }, []);

  //handle deleet
  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const REACT_APP_SERVER_URL= "https://billing-server-6caq.onrender.com";
      await axios.post(
        `${REACT_APP_SERVER_URL}/api/items/delete-item`,
        { itemId: record._id }
      );
      message.success("Item Deleted Succesfully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  //able data
  const columns = [
    { title: "Name", dataIndex: "name" },
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   render: (image, record) => (
    //     <img src={image} alt={record.name} height="60" width="60" />
    //   ),
    // },
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
            style={{ cursor: "pointer" }}
            onClick={() => {
              
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // handle form  submit
  const handleSubmit = async (value) => {
    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const REACT_APP_SERVER_URL= "https://billing-server-6caq.onrender.com";
        const res = await axios.post(
          `${REACT_APP_SERVER_URL}/api/items/add-item`,
          value
        );
        message.success("Item Added Succesfully");
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
        const REACT_APP_SERVER_URL= "https://billing-server-6caq.onrender.com";
        await axios.put(
          `${REACT_APP_SERVER_URL}/api/items/edit-item`,
          {
            ...value,
            itemId: editItem._id,
          }
        );
        message.success("Item Updated Succesfully");
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

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Item List</h1>
        <Button type="primary" onClick={() => setPopupModal(true)}>
          Add Item
        </Button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item " : "Add New Item"}`}
          visible={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
            
          >
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input />
            </Form.Item>
            {/* <Form.Item name="image" label="Image URL">
              <Input />
            </Form.Item> */}
            <Form.Item name="category" label="Category">
              <Select>
              {/* {
      name: "Pipes and Tubing",
     
      name: "Fitting and Valves",
     
      name: "Fixtures",
     
      name: "Water Heaters",
     
      name: "Drainage System",
    
      name: "Plumbing Tools",
     
      name: "Plumbing Accessories",
  
      name: "Water Supply Systems",
   
      name: "Pump Systems",
   
      name: "Gas Plumbing", */}
                <Select.Option value="Pipes and Tubing">Pipes and Tubing</Select.Option>
                <Select.Option value="Fitting and Valves">Fitting and Valves</Select.Option>
                <Select.Option value="Fixtures">Fixtures</Select.Option>
                <Select.Option value="Water Heaters">Water Heaters</Select.Option>
                <Select.Option value="Drainage System">Drainage System</Select.Option>
                <Select.Option value="Plumbing Tools">Plumbing Tools</Select.Option>
                <Select.Option value="Plumbing Accessories">Plumbing Accessories</Select.Option>
                <Select.Option value="Water Supply Systems">Water Supply Systems</Select.Option>
                <Select.Option value="Pump Systems">Pump Systems</Select.Option>
                <Select.Option value="Gas Plumbing">Gas Plumbing</Select.Option>
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit" //onClick={handleSubmit}
              >
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
