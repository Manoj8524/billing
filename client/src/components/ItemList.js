import React from "react";
import { Button, Card } from "antd";
import { useDispatch } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();

  // Update cart handler
  const handleAddTOCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
  };

  const { Meta } = Card;
  return (
    <div>
      <Card
        style={{ 
          width: 240, 
          margin: 15, 
          backgroundColor: "#ffffff", /* Light background color */
          border: "1px solid #ddd" /* Light border color */
        }}
        // cover={
        //   <img
        //     alt={item.name}
        //     src={item.image}
        //     style={{ height: 200, width: "100%", objectFit: "cover" }}
        //   />
        // }
      >
        <Meta title={item.name} style={{ color: "#333", textAlign: "center" }} /> {/* Dark text color and centered */}
        <div className="item-button" style={{ textAlign: "center", marginTop: "10px" }}>
          <Button 
            onClick={handleAddTOCart}
            style={{ 
              backgroundColor: "#f0f2f5", /* Light button background */
              color: "#333", /* Dark button text color */
              borderColor: "#ddd" /* Light button border color */
            }}
          >
            Add to cart
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
