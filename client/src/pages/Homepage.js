import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import { Input } from "antd";
import { SearchOutlined } from '@ant-design/icons';

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder,] = useState("asc");

  const categories = [
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
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" });
        const REACT_APP_SERVER_URL = "https://billingserver-manoj8524s-projects.vercel.app";
        const { data } = await axios.get(`${REACT_APP_SERVER_URL}/api/items/get-item`);
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log(error);
        dispatch({ type: "HIDE_LOADING" });
      }
    };
    getAllItems();
  }, [dispatch]);

  const filteredItems = itemsData
    .filter((item) => item.category === selectedCategory)
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  const categoryStyles = {
    marginRight: '10px',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '8px',
    backgroundColor: '#1890ff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const activeCategoryStyles = {
    ...categoryStyles,
    backgroundColor: '#40a9ff',
  };

  const flexContainerStyles = {
    display: 'flex',
    flexWrap: 'wrap',
  };

  const inputStyles = {
    width: '300px',
    borderRadius: '8px',
    border: '1px solid #d9d9d9',
    padding: '8px 16px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  return (
    <DefaultLayout>
      <div style={headerStyles}>
        <h6>Category Lists</h6>
        <Input
          placeholder="Search customers..."
          suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyles}
        />
      </div>
      <div style={flexContainerStyles}>
        {categories.map((category) => (
          <div
            key={category.name}
            style={selectedCategory === category.name ? activeCategoryStyles : categoryStyles}
            onClick={() => setSelectedCategory(category.name)}
          >
            <h8 style={{ color: 'white', textTransform: 'uppercase' }}>{category.name}</h8>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredItems.map((item) => (
          <div key={item.id}>
            <ItemList item={item} />
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default Homepage;
