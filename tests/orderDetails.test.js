// const mongoose = require('mongoose');
// const request = require('supertest');
// const { app } = require('../index.js');
// const orderDetailSchema = require('../models/orderDetail');

// require('dotenv').config();

// beforeEach(async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
// });

// describe('GET /data', () => {
//   it('should return aggregated data', async () => {
//     const topSellingProductMock = [
//       { _id: 'MockProduct', totalQuantitySold: 100 },
//     ];
//     const topCustomerMock = [{ _id: 'MockCustomer', totalAmountSpent: 1000 }];
//     const uniqueCategoriesMock = ['Category1', 'Category2'];
//     const uniqueYearsMock = [{ _id: 2021 }, { _id: 2022 }];
//     const stateWiseAggregateMock = [{ _id: 'State1', totalAmountSpent: 500 }];

//     const totalsMock = [
//       {
//         totalRevenue: 2000,
//         totalProfit: 1000,
//         totalProducts: 200,
//         totalOrders: 10,
//       },
//     ];

//     orderDetailSchema.aggregate = jest.fn();
//     orderDetailSchema.aggregate
//       .mockResolvedValueOnce(topSellingProductMock)
//       .mockResolvedValueOnce(topCustomerMock)
//       .mockResolvedValueOnce(uniqueCategoriesMock)
//       .mockResolvedValueOnce(stateWiseAggregateMock)
//       .mockResolvedValueOnce(totalsMock)
//       .mockResolvedValueOnce(uniqueYearsMock);

//     const response = await request(app).get('/order');

//     expect(response.statusCode).toBe(200);
//     expect(response.body.stats).toEqual([
//       { label: 'Total Revenue', value: '2000' },
//       { label: 'Total Profit', value: '1000' },
//       { label: 'Total Product', value: '200' },
//       { label: 'Total Orders', value: '10' },
//     ]);
//     expect(response.body.stateWise).toEqual(stateWiseAggregateMock);
//     expect(response.body.Top_Product).toEqual([
//       { label: 'Top Product', value: 'MockProduct' },
//     ]);
//     expect(response.body.Top_Costumer).toEqual([
//       { label: 'Top Costumer', value: 'MockCustomer' },
//     ]);
//   });

//   it('should return 500 if an error occurs', async () => {
//     orderDetailSchema.aggregate = jest
//       .fn()
//       .mockRejectedValue(new Error('Test error'));
//     const response = await request(app).get('/order');
//     expect(response.statusCode).toBe(500);
//     expect(response.body).toEqual({ message: 'Something went wrong' });
//   });
// });

// describe('POST /order', () => {
//   it('should add an order', async () => {
//     const orderData = {
//       order_id: '123456',
//       amount: 100,
//       profit: 50,
//       quantity: 2,
//       category: 'Test Category',
//       sub_category: 'Test Subcategory',
//       payment_mode: 'Cash',
//       order_date: new Date(),
//       customer_name: 'Test Customer',
//       state: 'Test State',
//       city: 'Test City',
//     };

//     const response = await request(app).post('/order').send(orderData);

//     expect(response.statusCode).toBe(201);
//     expect(response.body.product).toBeDefined();
//     expect(response.body.product.order_id).toBe(orderData.order_id);

//     const savedOrder = await orderDetailSchema.findOne({
//       order_id: orderData.order_id,
//     });
//     expect(savedOrder).toBeDefined();
//     expect(savedOrder.amount).toBe(orderData.amount);
//   });

//   it('should return 500 if an error occurs', async () => {
//     const invalidOrderData = {};
//     const response = await request(app).post('/order').send(invalidOrderData);

//     expect(response.statusCode).toBe(500);
//     expect(response.body).toEqual({ message: 'Something went wrong' });
//   });
// });

// describe('GET /yearWise', () => {
//   it('should return yearly sales data when selectedYear is "Yearly"', async () => {
//     orderDetailSchema.aggregate.mockResolvedValueOnce([
//       { _id: 2021, totalAmount: 1000 },
//       { _id: 2022, totalAmount: 1500 },
//     ]);

//     const res = await request(app)
//       .get('/order/yearWise')
//       .query({ year: 'Yearly' });

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual({
//       xAxisData: [2021, 2022],
//       yAxisData: [[1000, 1500]],
//       dataLabels: ['Sales'],
//     });
//   });
//   it('should return monthly sales data when selectedYear is a specific year', async () => {
//     const mockSalesData = [
//       { _id: 1, totalSales: 100 },
//       { _id: 2, totalSales: 150 },
//     ];

//     orderDetailSchema.aggregate.mockResolvedValueOnce(mockSalesData);

//     const res = await request(app)
//       .get('/order/yearWise')
//       .query({ year: '2018' });

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual({
//       xAxisData: [
//         'January',
//         'February',
//         'March',
//         'April',
//         'May',
//         'June',
//         'July',
//         'August',
//         'September',
//         'October',
//         'November',
//         'December',
//       ],
//       yAxisData: [[100, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
//       dataLabels: ['Sales'],
//     });
//   });
// });

// describe('GET /category', () => {
//   it('should return sales data for the selected category', async () => {
//     const selectedCategory = 'Clothing';
//     const salesDataMock = [
//       { _id: 'Shirts', totalSales: 500 },
//       { _id: 'Pants', totalSales: 700 },
//     ];

//     orderDetailSchema.aggregate = jest
//       .fn()
//       .mockResolvedValueOnce(salesDataMock);

//     const response = await request(app).get(
//       `/order/categoryWise?category=${selectedCategory}`,
//     );

//     expect(response.statusCode).toBe(200);
//     expect(response.body.xAxisData).toEqual(['Shirts', 'Pants']);
//     expect(response.body.yAxisData).toEqual([[500, 700]]);
//     expect(response.body.dataLabels).toEqual(['Sales']);
//   });

//   it('should return 404 if no data found for the selected category', async () => {
//     const selectedCategory = 'NonExistingCategory';

//     orderDetailSchema.aggregate = jest.fn().mockResolvedValueOnce([]);

//     const response = await request(app).get(
//       `/order/categoryWise?category=${selectedCategory}`,
//     );

//     expect(response.statusCode).toBe(404);
//     expect(response.body.message).toBe(
//       'No data found for the selected category',
//     );
//   });

//   it('should return 500 if an error occurs', async () => {
//     const selectedCategory = 'Clothing';

//     orderDetailSchema.aggregate = jest
//       .fn()
//       .mockRejectedValueOnce(new Error('Test error'));

//     const response = await request(app).get(
//       `/order/categoryWise?category=${selectedCategory}`,
//     );

//     expect(response.statusCode).toBe(500);
//     expect(response.body.message).toBe('internal server error');
//   });
// });

// afterEach(async () => {
//   await mongoose.connection.close();
// });
