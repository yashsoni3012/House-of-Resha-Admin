import React from "react";

const Customers = () => {
  const customers = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@example.com",
      orders: 12,
      spent: "₹1,45,000",
    },
    {
      id: 2,
      name: "Amit Patel",
      email: "amit@example.com",
      orders: 8,
      spent: "₹89,000",
    },
    {
      id: 3,
      name: "Sneha Reddy",
      email: "sneha@example.com",
      orders: 15,
      spent: "₹2,10,000",
    },
    {
      id: 4,
      name: "Rahul Singh",
      email: "rahul@example.com",
      orders: 5,
      spent: "₹45,000",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 lg:p-6 border-b">
        <h3 className="text-lg font-semibold">Customer List</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                Email
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Orders
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Spent
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {customer.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                  {customer.email}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-800">
                  {customer.orders}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-gray-800">
                  {customer.spent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
