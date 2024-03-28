const orderDetailSchema = require("../models/orderDetail");

const addOrder = async (req, res) => {
  try {
    const {
      order_id,
      amount,
      profit,
      quantity,
      category,
      sub_category,
      payment_mode,
      order_date,
      customer_name,
      state,
      city,
    } = req.body;
    const product = await orderDetailSchema.create({
      order_id: order_id,
      amount: amount,
      profit: profit,
      quantity: quantity,
      category: category,
      sub_category: sub_category,
      payment_mode: payment_mode,
      order_date: order_date,
      customer_name: customer_name,
      state: state,
      city: city,
    });
    console.log("Added Order");
    res
      .status(201)
      .json({
        product: product,
        message: "Added the Order Details Successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getData = async (req, res) => {
  try {
    const topSellingProduct = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: "$sub_category",
          totalQuantitySold: { $sum: "$quantity" },
        },
      },
      {
        $sort: { totalQuantitySold: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // Aggregate the total amount spent by each customer
    const topCustomer = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: "$customer_name",
          totalAmountSpent: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmountSpent: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    const uniqueCategories = await orderDetailSchema.distinct('category');

    const uniqueYears = await orderDetailSchema.aggregate([
        {
          $group: {
            _id: { $year: { $toDate: '$order_date' } }
          }
        }
      ]);

    const stateWiseAggregate = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: "$state",
          totalAmountSpent: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmountSpent: -1 },
      },
    ]);

    const totals = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          totalProfit: { $sum: "$profit" },
          totalProducts: { $sum: "$quantity" },
        },
      },
    ]);
    const formattedStats = [
      { label: "Total Revenue", value: `${totals[0].totalRevenue}` },
      { label: "Total Profit", value: `${totals[0].totalProfit}` },
      { label: "Total Product", value: `${totals[0].totalProducts}` },
      { label: "Total Orders", value: `${totals[0].totalOrders}` },
    ];
    res
      .status(200)
      .json({
        stats: formattedStats,
        stateWise:stateWiseAggregate,
        uniqueCategories:uniqueCategories,
        uniqueYears:uniqueYears,
        Top_Product: topSellingProduct[0]._id,
        Top_Costumer: topCustomer[0]._id,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const lineChart = async (req, res) => {
  try {
    const { filter } = req.body;
    console.log(filter);
    let matchStage = {};

    switch (filter) {
      case "daily":
        matchStage = {
          $match: {
            order_date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          },
        };
        break;
      case "weekly":
        matchStage = {
          $match: {
            order_date: {
              $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
              $lt: new Date(),
            },
          },
        };
        break;
      case "monthly":
        matchStage = {
          $match: {
            order_date: {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ),
              $lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              ),
            },
          },
        };
        break;
      case "yearly":
        matchStage = {
          $match: {
            order_date: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lt: new Date(new Date().getFullYear() + 1, 0, 1),
            },
          },
        };
        break;
      default:
        break;
    }

    const analysis = await orderDetailSchema.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalProfit: { $sum: "$profit" },
          totalOrders: { $sum: "$Profit" },
        },
      },
    ]);

    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const categoryWise = async (req, res) => {
  try {
    const selectedCategory = req.query.category;
    console.log(selectedCategory);

    const salesData = await orderDetailSchema.aggregate([
      {
        $match: { category: selectedCategory },
      },
      {
        $group: {
          _id: "$sub_category",
          totalSales: { $sum: "$amount" },
        },
      },
    ]);

    // If no data found, return 404
    if (salesData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the selected category" });
    }

    // Prepare xAxisBarData and yAxisBarData
    const xAxisBarData = salesData.map((entry) => entry._id);
    const yAxisBarData = [salesData.map((entry) => entry.totalSales)];

    // Prepare barDataLabels
    const barDataLabels = ["Sales"];

    // Return the formatted data
    res.json({ xAxisBarData, yAxisBarData, barDataLabels });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const yearWise = async (req, res) => {
  const selectedYear = parseInt(req.query.year); // Convert year to integer

  try {
    // Aggregate the total sales for each month within the selected year
    const salesData = await orderDetailSchema.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: { $toDate: "$order_date" } }, selectedYear] },
        },
      },
      {
        $group: {
          _id: { $month: { $toDate: "$order_date" } },
          totalSales: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month ascending
      },
    ]);

    // If no data found, return 404
    if (salesData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the selected year" });
    }

    // Prepare xAxisData and yAxisData
    const xAxisData = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const yAxisData = [new Array(12).fill(0)]; // Initialize array for sales data for each month
    salesData.forEach((entry) => {
      yAxisData[0][entry._id - 1] = entry.totalSales; // Map sales data to corresponding month index
    });

    // Prepare dataLabels
    const dataLabels = ["Product A"];

    // Return the formatted data
    res.json({ xAxisData, yAxisData, dataLabels });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  addOrder,
  getData,
  lineChart,
  categoryWise,
  yearWise,
};
