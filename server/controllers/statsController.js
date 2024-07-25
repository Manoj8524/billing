const Bills = require("../models/billsModel");

// Function to calculate the total number of customers
const getTotalCustomers = async () => {
  const totalCustomers = await Bills.distinct("customerName").count();
  return totalCustomers;
};

// Function to calculate the number of customers this month
const getMonthlyCustomers = async () => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthlyCustomers = await Bills.distinct("customerName").count({
    date: { $gte: startOfMonth }
  });
  return monthlyCustomers;
};

// Function to calculate the number of customers today
const getDailyCustomers = async () => {
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const dailyCustomers = await Bills.distinct("customerName").count({
    date: { $gte: startOfDay }
  });
  return dailyCustomers;
};

// Function to calculate the daily income
const getDailyIncome = async () => {
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const dailyIncome = await Bills.aggregate([
    { $match: { date: { $gte: startOfDay } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  return dailyIncome[0] ? dailyIncome[0].total : 0;
};

// Function to calculate the monthly income
const getMonthlyIncome = async () => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthlyIncome = await Bills.aggregate([
    { $match: { date: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  return monthlyIncome[0] ? monthlyIncome[0].total : 0;
};

const getStats = async (req, res) => {
  try {
    const totalCustomer = await getTotalCustomers();
    const monthlyCustomer = await getMonthlyCustomers();
    const dailyCustomer = await getDailyCustomers();
    const dayIncome = await getDailyIncome();
    const monthlyIncome = await getMonthlyIncome();

    res.status(200).json({ totalCustomer, monthlyCustomer, dailyCustomer, dayIncome, monthlyIncome });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStats };
