/* =====================================================
   USER CSV EXPORT (UNCHANGED)
===================================================== */
export const exportToCSV = (users, activeTab, getUserField, fileName = null) => {
  if (!users || users.length === 0) {
    throw new Error("No users to export");
  }

  try {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Status",
      "User ID",
      "Created At",
      "Last Login",
    ];

    const rows = users.map((user) => {
      const firstName = getUserField(user, [
        "firstname",
        "firstName",
        "first_name",
        "fname",
        "name",
      ]);
      const lastName = getUserField(user, [
        "lastname",
        "lastName",
        "last_name",
        "lname",
        "surname",
      ]);
      const email = getUserField(user, [
        "email",
        "emailAddress",
        "email_address",
      ]);
      const phone = getUserField(user, [
        "phone",
        "phoneNumber",
        "phone_number",
        "number",
        "mobile",
        "contact",
      ]);

      const userId = user.id || user._id || "N/A";
      const status = activeTab;
      const createdAt =
        user.createdAt || user.created_at || user.dateCreated || "N/A";
      const lastLogin =
        user.lastLogin || user.last_login || user.lastActive || "N/A";

      return [
        `"${firstName || "N/A"}"`,
        `"${lastName || "N/A"}"`,
        `"${email || "N/A"}"`,
        `"${phone || "N/A"}"`,
        `"${status}"`,
        `"${userId}"`,
        `"${createdAt}"`,
        `"${lastLogin}"`,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const timestamp = new Date().toISOString().split("T")[0];
    const defaultFileName =
      fileName || `users_${activeTab}_${timestamp}.csv`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = defaultFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, count: users.length, fileName: defaultFileName };
  } catch (error) {
    console.error("CSV export error:", error);
    throw error;
  }
};

/* =====================================================
   USER JSON EXPORT (UNCHANGED)
===================================================== */
export const exportToJSON = (users, activeTab, fileName = null) => {
  if (!users || users.length === 0) {
    throw new Error("No users to export");
  }

  try {
    const data = {
      exportedAt: new Date().toISOString(),
      userType: activeTab,
      totalUsers: users.length,
      users,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8;",
    });

    const timestamp = new Date().toISOString().split("T")[0];
    const defaultFileName =
      fileName || `users_${activeTab}_${timestamp}.json`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = defaultFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, count: users.length, fileName: defaultFileName };
  } catch (error) {
    console.error("JSON export error:", error);
    throw error;
  }
};

/* =====================================================
   EXPORT DISPATCHER (UNCHANGED)
===================================================== */
export const exportData = (users, activeTab, getUserField, options = {}) => {
  const { format = "csv", fileName = null } = options;

  switch (format.toLowerCase()) {
    case "csv":
      return exportToCSV(users, activeTab, getUserField, fileName);
    case "json":
      return exportToJSON(users, activeTab, fileName);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

/* =====================================================
   CSV FORMAT HELPER (UNCHANGED)
===================================================== */
export const formatCSVData = (users, activeTab, getUserField) => {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Status",
    "User ID",
    "Created At",
    "Last Login",
  ];

  const rows = users.map((user) => ({
    "First Name": getUserField(user, [
      "firstname",
      "firstName",
      "first_name",
      "fname",
      "name",
    ]),
    "Last Name": getUserField(user, [
      "lastname",
      "lastName",
      "last_name",
      "lname",
      "surname",
    ]),
    Email: getUserField(user, [
      "email",
      "emailAddress",
      "email_address",
    ]),
    Phone: getUserField(user, [
      "phone",
      "phoneNumber",
      "phone_number",
      "number",
      "mobile",
      "contact",
    ]),
    Status: activeTab,
    "User ID": user.id || user._id || "N/A",
    "Created At":
      user.createdAt || user.created_at || user.dateCreated || "N/A",
    "Last Login":
      user.lastLogin || user.last_login || user.lastActive || "N/A",
  }));

  return { headers, rows };
};

/* =====================================================
   ORDERS CSV EXPORT (NEW)
===================================================== */
export const exportOrdersToCSV = (orders, fileName = null) => {
  if (!orders || orders.length === 0) {
    throw new Error("No orders to export");
  }

  try {
    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Phone",
      "City",
      "Amount (INR)",
      "Payment Status",
      "Order Date",
    ];

    const rows = orders.map((order) => {
      const user = order.userId || {};
      const address = order.address || {};

      const customerName =
        `${address.firstName || user.firstName || ""} ${
          address.lastName || user.lastName || ""
        }`.trim() || "N/A";

      return [
        `"${order._id || "N/A"}"`,
        `"${customerName}"`,
        `"${user.email || "N/A"}"`,
        `"${address.phone || user.mobile || "N/A"}"`,
        `"${address.city || "N/A"}"`,
        `"${order.amount || 0}"`,
        `"${order.paymentStatus || "pending"}"`,
        `"${order.createdAt || "N/A"}"`,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const timestamp = new Date().toISOString().split("T")[0];
    const defaultFileName = fileName || `orders_${timestamp}.csv`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = defaultFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, count: orders.length, fileName: defaultFileName };
  } catch (error) {
    console.error("Orders CSV export error:", error);
    throw error;
  }
};

/* =====================================================
   DEFAULT EXPORT
===================================================== */
export default {
  exportToCSV,
  exportToJSON,
  exportData,
  formatCSVData,
  exportOrdersToCSV,
};
