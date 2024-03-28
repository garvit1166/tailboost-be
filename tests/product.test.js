// const mongoose = require('mongoose');
// const request = require('supertest');
// const { app } = require('../index.js');
// const productDetailSchema = require('../models/productDetail');

// require('dotenv').config();

// beforeEach(async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
// });

// describe('GET /product', () => {
//   it('should return all products', async () => {
//     const res = await request(app).get('/product');
//     expect(res.statusCode).toBe(200);
//     expect(res.body.data).toBeDefined();
//     expect(Array.isArray(res.body.data)).toBe(true);
//     expect(res.body.data.length).toBeGreaterThan(0);
//   });
// });

// describe('POST /product', () => {
//   it('should add a product', async () => {
//     const productData = {
//       name: 'Test Product',
//       price: 10,
//       product_id: '123456',
//       category: 'Test Category',
//       sub_category: 'Test Subcategory',
//       cost_price: 5,
//     };

//     const response = await request(app).post('/product').send(productData);

//     expect(response.statusCode).toBe(201);

//     expect(response.body.product).toBeDefined();
//     expect(response.body.product.name).toBe(productData.name);
//     expect(response.body.product.price).toBe(productData.price);
//     expect(response.body.message).toBe('Added the product Successfully');
//     const savedProduct = await productDetailSchema.findOne({
//       product_id: productData.product_id,
//     });
//     expect(savedProduct).toBeDefined();
//   });
// });

// afterEach(async () => {
//   await mongoose.connection.close();
// });
