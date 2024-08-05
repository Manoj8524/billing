import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortOrder,] = useState("asc");

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" });
        const REACT_APP_SERVER_URL = "https://billingserver.vercel.app";
        const { data } = await axios.get(`${REACT_APP_SERVER_URL}/api/items/get-item`);
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log(error);
        dispatch({ type: "HIDE_LOADING" });
      }
    };
    getAllItems();

    // Load categories from local storage
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
  }, [dispatch]);

  useEffect(() => {
    // Save categories to local storage whenever they are updated
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

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

  const addCategory = () => {
    if (newCategory.trim() !== "") {
      setCategories([...categories, { name: newCategory.trim() }]);
      setNewCategory("");
    }
  };

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

  const categoryInputStyles = {
    marginRight: '10px',
    borderRadius: '8px',
    padding: '5px',
    border: '1px solid #d9d9d9',
  };

  const categoryButtonStyles = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <DefaultLayout>
      <div style={headerStyles}>
        <div style={categoryButtonStyles}>
          <Input
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={categoryInputStyles}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={addCategory} />
        </div>
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
