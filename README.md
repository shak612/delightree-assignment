# Delightree Assignment – Sales & Revenue Analytics API

This project is a Node.js + GraphQL + MongoDB backend application for managing customers, products, and orders. It includes:

- GraphQL API with Express & Express-GraphQL
- CSV Import utility for initial data
- UUID-based unique IDs
- Example queries for testing

---

## 🛠️ Tech Stack

- Node.js
- Express
- Express-GraphQL
- MongoDB (via Mongoose)
- CSV Parser
- UUID
- Dotenv

---
## 📁 Project Structure

```
.
├── csvData/
│   ├── customers.csv
│   ├── orders.csv
│   └── products.csv
├── index.js
├── graphql/
│   ├── schema.js
│   └── resolvers.js
├── models/
│   ├── customer.js
│   ├── order.js
│   └── product.js
├── utils/
│   └── insertDataInDB.js
├── .env
├── package.json
└── README.md
```

---

## 🚀 Getting Started


## 🛠️ Setup

### Installation

```bash
git clone https://github.com/shak612/delightree-assignment.git
cd delightree-assignment
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/delightree
PORT=4000
```
---

## ▶️ Run the Server

```bash
npm start
```

Visit: `http://localhost:4000/graphql` to open GraphQL Playground

---

## 🧪 Sample GraphQL Queries

### 📊 getCustomerSpending

```json
{
  "query": "query { getCustomerSpending(customerId: "adf96a4e-6987-4731-8798-09b109ff65c3") { customerId totalSpent averageOrderValue lastOrderDate } }"
}
```

### 🥇 getTopSellingProducts

```json
{
  "query": "query { getTopSellingProducts(limit: 5) { productId name totalSold } }"
}
```

### 📈 getSalesAnalytics

```json
{
  "query": "query { getSalesAnalytics(startDate: "2024-01-01", endDate: "2024-12-31") { totalRevenue completedOrders categoryBreakdown { category revenue } } }"
}
```

---

## 🧹 Scripts

```bash
npm run dev              # Start server in dev mode using nodemon
npm start                # Start server
```

---

## 👨‍💻 Author

**Shakir** – Delightree Assignment – 2025

---

## 📝 License

This project is licensed for educational purposes.
