const Order = require('../models/order');
const Product = require('../models/product');
const Customer = require('../models/customer');  // Assuming there's a customer model

module.exports = {
  async getCustomerSpending({ customerId }) {
    try {
      const result = await Order.aggregate([
        { $match: { customerId: String(customerId), status: 'completed' }},
        {
          $group: {
            _id: '$customerId',
            totalSpent: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            lastOrderDate: { $max: '$orderDate' }
          }
        },
        { $project: {
            customerId: '$_id',
            totalSpent: 1,
            averageOrderValue: 1,
            lastOrderDate: 1,
            _id: 0
        }}
      ]);
  
      
      if (result.length === 0) return null;
       
      return result[0] || null;
    } catch (error) {
      console.log(error);
      return null; 
    }
  },

  async getTopSellingProducts({ limit }) {
    const result = await Order.aggregate([
      { $match: { status: 'completed' }},
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalSold: { $sum: '$products.quantity' }
        }
      },
      { $sort: { totalSold: -1 }},
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          productId: '$_id',
          name: '$product.name',
          totalSold: 1,
          _id: 0
        }
      }
    ]);

    return result;
  },

  async getSalesAnalytics({ startDate, endDate }) {
    const result = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: 'completed'
        }
      },
      {
        $facet: {
          revenueData: [
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, completedOrders: { $sum: 1 } }}
          ],
          categoryBreakdown: [
            { $unwind: '$products' },
            {
              $lookup: {
                from: 'products',
                localField: 'products.productId',
                foreignField: '_id',
                as: 'productInfo'
              }
            },
            { $unwind: '$productInfo' },
            {
              $group: {
                _id: '$productInfo.category',
                revenue: {
                  $sum: {
                    $multiply: ['$products.quantity', '$productInfo.price']
                  }
                }
              }
            },
            {
              $project: {
                category: '$_id',
                revenue: 1,
                _id: 0
              }
            }
          ]
        }
      },
      {
        $project: {
          totalRevenue: { $arrayElemAt: ['$revenueData.totalRevenue', 0] },
          completedOrders: { $arrayElemAt: ['$revenueData.completedOrders', 0] },
          categoryBreakdown: 1
        }
      }
    ]);

    return result[0];
  }
};