const mongoose = require('mongoose');
const request = require('supertest');
const { app } = require('../index.js');
const userSchema = require('../models/user.js');

require('dotenv').config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

describe('POST /signup', () => {
    it('should add a user', async () => {
      const user = {
        name: 'Test Name',
        email: 'test@abc.com',
        password: '123456'
      };
  
      const response = await request(app).post('/signup').send(user);
  
      expect(response.statusCode).toBe(201);
  
      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe(user.name);
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.message).toBe('Added the User Successfully');
      const savedProduct = await userSchema.findOne({
        email: user.email,
      });
      expect(savedProduct).toBeDefined();
    });
    
  });
  describe('POST /signup', () => {
    it('should verify a user', async () => {
      const user = {
        email: 'test@abc.com',
        password: '123456'
      };
  
      const response = await request(app).post('/').send(user);
  
      expect(response.statusCode).toBe(201);
  
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.message).toBe('loggedIn Successful');
      const savedProduct = await userSchema.findOne({
        email: user.email,
      });
      expect(savedProduct).toBeDefined();
    });
    
  });