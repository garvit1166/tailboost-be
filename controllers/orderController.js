const orderDetailSchema= require('../models/orderDetail');
const WebSocket = require('ws');
const { wss } = require('../WebSocket');

let refreshTimeout;

const sendRefreshMessage = () => {
  console.log(wss);
  wss &&
    wss.clients &&
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ message: 'refresh' }));
      }
    });
};





const debounceRefreshMessage = () => {
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(sendRefreshMessage, 20000);
};

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
    debounceRefreshMessage();
    console.log('Added Order');
    res.status(201).json({
      product: product,
      message: 'Added the Order Details Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getData = async (req, res) => {
  try {
    const topSellingProduct = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: '$sub_category',
          totalQuantitySold: { $sum: '$quantity' },
        },
      },
      {
        $sort: { totalQuantitySold: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    console.log(topSellingProduct);
    const topCustomer = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: '$customer_name',
          totalAmountSpent: { $sum: '$amount' },
        },
      },
      {
        $sort: { totalAmountSpent: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    console.log('topCustomer:', topCustomer);
    const uniqueCategories = await orderDetailSchema.distinct('category');
    console.log('uniqueCategories:', uniqueCategories);
    const uniqueYears = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: { $year: { $toDate: '$order_date' } },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    console.log('uniqueYears:', uniqueYears);
    const stateWiseAggregate = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: '$state',
          totalAmountSpent: { $sum: '$amount' },
        },
      },
      {
        $sort: { totalAmountSpent: -1 },
      },
      {
        $limit:7
      }
    ]);
    console.log('stateWiseAggregate ', stateWiseAggregate);
    const totals = await orderDetailSchema.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$amount' },
          totalProfit: { $sum: '$profit' },
          totalProducts: { $sum: '$quantity' },
        },
      },
    ]);
    const formattedStats = [
      { label: 'Total Revenue', value: `${totals[0].totalRevenue}` },
      { label: 'Total Profit', value: `${totals[0].totalProfit}` },
      { label: 'Total Product', value: `${totals[0].totalProducts}` },
      { label: 'Total Orders', value: `${totals[0].totalOrders}` },
    ];
    console.log('Formatted Stats:', totals);
    const Top_Costumer = [
      { label: 'Top Costumer', value: `${topCustomer[0]._id}` },
    ];
    const Top_Product = [
      { label: 'Top Product', value: `${topSellingProduct[0]._id}` },
    ];
    res.status(200).json({
      stats: formattedStats,
      stateWise: stateWiseAggregate,
      uniqueCategories: uniqueCategories,
      uniqueYears: uniqueYears,
      Top_Product: Top_Product,
      Top_Costumer: Top_Costumer,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' });
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
          _id: '$sub_category',
          totalSales: { $sum: '$amount' },
        },
      },
    ]);

    if (salesData.length === 0) {
      return res
        .status(404)
        .json({ message: 'No data found for the selected category' });
    }

    const xAxisData = salesData.map((entry) => entry._id);
    const yAxisData = [salesData.map((entry) => entry.totalSales)];

    const dataLabels = ['Sales'];

    res.json({ xAxisData, yAxisData, dataLabels });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'internal server error' });
  }
};

const yearWise = async (req, res) => {
  const selectedYear = req.query.year;
  console.log(selectedYear);
  try {
    let xAxisData = [];
    let yAxisData = [];
    let dataLabels = ['Sales'];
    if (selectedYear == 'Yearly') {
      const salesData = await orderDetailSchema.aggregate([
        {
          $group: {
            _id: { $year: { $toDate: '$order_date' } },
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      if (salesData.length === 0) {
        return res.status(404).json({ message: 'No data found' });
      }

      xAxisData = salesData.map((entry) => entry._id);
      yAxisData.push(salesData.map((entry) => entry.totalAmount));
    } else {
      const salesData = await orderDetailSchema.aggregate([
        {
          $match: {
            $expr: {
              $eq: [
                { $year: { $toDate: '$order_date' } },
                parseInt(selectedYear),
              ],
            },
          },
        },
        {
          $group: {
            _id: { $month: { $toDate: '$order_date' } },
            totalSales: { $sum: '$amount' },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      if (salesData.length === 0) {
        return res
          .status(404)
          .json({ message: 'No data found for the selected year' });
      }

      xAxisData = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const temp = new Array(12).fill(0);
      salesData.forEach((entry) => {
        temp[entry._id - 1] = entry.totalSales;
      });
      yAxisData.push(temp);

      console.log(salesData);
    }

    res.json({ xAxisData, yAxisData, dataLabels });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  addOrder,
  getData,
  categoryWise,
  yearWise,
};
