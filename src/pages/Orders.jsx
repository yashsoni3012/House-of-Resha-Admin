import React from 'react';

const Orders = () => {
  const orders = [
    { id: '#1234', customer: 'Priya Sharma', date: '2024-11-28', amount: '₹15,999', status: 'Delivered' },
    { id: '#1235', customer: 'Amit Patel', date: '2024-11-28', amount: '₹8,499', status: 'Processing' },
    { id: '#1236', customer: 'Sneha Reddy', date: '2024-11-27', amount: '₹25,999', status: 'Shipped' },
    { id: '#1237', customer: 'Rahul Singh', date: '2024-11-27', amount: '₹3,999', status: 'Pending' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 lg:p-6 border-b">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4 text-sm font-medium text-purple-600">{order.id}</td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-800">{order.customer}</td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
                <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-gray-800">{order.amount}</td>
                <td className="px-4 lg:px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;