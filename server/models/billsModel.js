const mongoose = require("mongoose");

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
 
  return `${hours}:${minutes}`;
};

const billSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerNumber: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    cartItems: {
      type: Array,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    time: { type: String, default: getCurrentTime },
  

  },
  { timestamp: true },
);

const Bills = mongoose.model("bills", billSchema);

module.exports = Bills;
