# SalesTrack Pro

[SalesTrack Pro](/) is a comprehensive analytics platform designed to provide real-time insights into key metrics for online businesses. From monitoring total revenue and profit to tracking product performance and customer behavior, our dashboard offers a centralized hub for understanding sales trends and making data-driven decisions. With interactive charts, intuitive visuals, and live updates powered by WebSocket technology, users can gain actionable insights into their sales performance, identify growth opportunities, and optimize their business strategies effectively. Built using the MERN stack and featuring secure authentication, our dashboard ensures a seamless and user-friendly experience for businesses seeking to elevate their e-commerce operations.

<Br/>

# Table of Contents

- [Features](#features)
- [Technologies Used](#tech-stack)
- [Installation](#setup)
- [Live Updates](#live-update)
- [Working Model Screenshots]()

<a id="features"></a>

# Features
- **Total Revenue**: View real-time updates on total revenue generated by the e-commerce platform.

- **Total Profit**: Monitor the total profit earned from sales transactions, providing insights into business profitability.

- **Total Product**: Track the total number of products available in the inventory, ensuring inventory management.

- **Total Orders**: Stay informed about the total number of orders placed, enabling efficient order fulfillment.

- **Sales Analysis Line Chart**: Visualize sales data trends over time with an interactive line chart, aiding in strategic decision-making.

- **Region Distribution Doughnut Chart**: Gain insights into sales distribution across different regions with an intuitive doughnut chart.

- **Top Customer Detail**: Identify top customers based on their purchasing behavior and transaction history, fostering customer relationship management.

- **Top Product Detail: Discover top**-selling products and their performance metrics, facilitating inventory optimization.

- **Sales by Subcategory**: Analyze sales performance by subcategories, helping to identify product categories driving revenue growth.

<a id="tech-stack"></a>

# Tech Stack

- ReactJs
- React Context API
- NodeJs
- ExpressJs
- MongoDB

    ### **Libraries Used**

- WebSocket (for real-time communication)
- Context API (for state management)
- React Router (for client-side routing)
- Bootstrap (for UI components)
- Axios (for making HTTP requests)
- ChartJs, Rechart.JS (For Charts)

<a id="setup"></a>

# Project Setup Guide

## Frontend

1. Clone TailBoost-fe repo and install dependencies

   ```sh
   git clone https://github.com/garvit1166/tailboost-fe
   npm i
   ```

2. Make .env file

3. Start the react app

   ```sh
   npm start
   ```

## Backend

1. Add .env in the root directory. Here's an example env file for you.

   ```sh
   MONGODB_URL
   ```

2. Start the backend server

   ```sh
   npm start
   ```
<a id="live-update"></a>

# Real-Time Data update

Our e-commerce sales dashboard leverages WebSocket technology to provide real-time updates whenever a new order is placed on the platform. WebSocket enables bidirectional communication between the client (web browser) and the server, allowing for instant data transmission without the need for continuous HTTP requests.

When a user places a new order on the e-commerce platform, the server immediately sends a notification to all connected clients via WebSocket. Upon receiving the notification, the client-side application updates the dashboard interface in real-time to reflect the latest changes. This ensures that all users viewing the dashboard have access to up-to-date information about sales transactions, total revenue, and other key metrics.

By leveraging WebSocket for real-time updates, our e-commerce sales dashboard provides users with a seamless and dynamic experience, allowing them to stay informed about the latest sales activities and make timely decisions to optimize their business operations

<a id="working-model-ss"></a>


## Endpoints

### GET /order

**Description**: Fetches the Total Revenue, Total Profit,Total Number of products, Total Orders and top 7 Statewise data.

### GET /order/categoryWise?category={category}

**Description**: Fetches the sales data on the basis of category.

**Parameters**:
- `category`: The identifier of the categories in the data.
 
### GET /order/yearWise?year={year}

**Description**: Fetches the sales data on the basis of year.

**Parameters**:
- `year`: The identifier by which it fetches the data of that year.

### GET /product

**Description**: Fetches the products from the database.

### GET /product/:id

**Description**: Fetches the product on the basis of its unique parameter.

**Parameters**:
- `id`: The unique identifier of the product.

### POST /

**Description**: LogIn the user.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "john@123"
}
```
### POST /signup

**Description**: Signup the user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "john@123"
}

```
### POST /order/addOrder

**Description**: Adding the orderDetails.

**Request Body**:
```json
{
  "order_id": "B-26055",
  "amount": 5729,
  "profit": 64,
  "quantity": 14,
  "category": "Furniture",
  "sub_category": "Chairs",
  "payment_mode": "EMI",
  "order_date": "10/3/2018",
  "customer_name": "Harivansh",
  "state": "Uttar Pradesh",
  "city": "Mathura"
}
```
### POST /product/addProduct

**Description**: Adding the product to the product Collection.

**Request Body**:
```json
{
  "name": "RedmiNote5",
  "price": 15000,
  "product_id": "B-237",
  "category": "Electronics",
  "sub_category": "Mobile",
  "cost_price": 12000,
}
```
## Test Coverage Chart Image

![image](https://github.com/garvit1166/tailboost-be/assets/92694655/8314bf31-b1cb-4b0a-80f6-41d91ed90852)

![image](https://github.com/garvit1166/tailboost-be/assets/92694655/17df6d31-6b02-465a-8cec-3fc36a82b03f)

![image](https://github.com/garvit1166/tailboost-be/assets/92694655/dc95b81b-0003-4732-bc67-4948ad819030)

