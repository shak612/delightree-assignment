const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/order');
const Product = require('../models/product');
const Customer = require('../models/customer');


const parseCSV = (filePath, parserFn) =>
  new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          results.push(parserFn(row));
        } catch (err) {
          console.error(`❌ Error parsing row in ${filePath}:`, row, err.message);
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });

exports.insertAllDataInDB = async () => {
  try {

    // 🛒 Import Orders
    const orders = await parseCSV('./csvData/orders.csv', (row) => ({
      _id: row._id || uuidv4(),
      customerId: row.customerId,
      products: JSON.parse(row.products.replace(/'/g, '"')),
      totalAmount: parseFloat(row.totalAmount),
      orderDate: new Date(row.orderDate),
      status: row.status
    }));

    // 🛍️ Import Products
    const products = await parseCSV('./csvData/products.csv', (row) => ({
      _id: row._id || uuidv4(),
      name: row.name,
      category: row.category,
      price: parseFloat(row.price),
      stock: parseInt(row.stock)
    }));

    // 👤 Import Customers
    const customers = await parseCSV('./csvData/customers.csv', (row) => ({
      _id: row._id || uuidv4(),
      name: row.name,
      email: row.email,
      age: parseInt(row.age),
      location: row.location,
      gender: row.gender
    }));

    await Promise.allSettled([
      Order.insertMany(orders),
      Product.insertMany(products),
      Customer.insertMany(customers)
    ]);

    console.log('✅ All CSV data imported successfully!');
  } catch (err) {
    console.error('❌ Import failed:', err);
  }
};
