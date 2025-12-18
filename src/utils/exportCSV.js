// utils/exportCSV.js
export const exportToCSV = (users, activeTab, getUserField, fileName = null) => {
  if (!users || users.length === 0) {
    throw new Error('No users to export');
  }

  try {
    // Create CSV headers
    const headers = [
      'First Name',
      'Last Name', 
      'Email',
      'Phone',
      'Status',
      'User ID',
      'Created At',
      'Last Login'
    ];

    // Create CSV rows from user data
    const rows = users.map(user => {
      // Extract user data with fallbacks
      const firstName = getUserField(user, ['firstname', 'firstName', 'first_name', 'fname', 'name']);
      const lastName = getUserField(user, ['lastname', 'lastName', 'last_name', 'lname', 'surname']);
      const email = getUserField(user, ['email', 'emailAddress', 'email_address']);
      const phone = getUserField(user, ['phone', 'phoneNumber', 'phone_number', 'number', 'mobile', 'contact']);
      const userId = user.id || user._id || 'N/A';
      const status = activeTab;
      
      // Additional fields if available
      const createdAt = user.createdAt || user.created_at || user.dateCreated || 'N/A';
      const lastLogin = user.lastLogin || user.last_login || user.lastActive || 'N/A';

      // Format values for CSV (wrap in quotes to handle commas)
      return [
        `"${firstName || 'N/A'}"`,
        `"${lastName || 'N/A'}"`,
        `"${email || 'N/A'}"`,
        `"${phone || 'N/A'}"`,
        `"${status}"`,
        `"${userId}"`,
        `"${createdAt}"`,
        `"${lastLogin}"`
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create BOM for UTF-8 to handle special characters
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    // Create blob and download
    const blob = new Blob([csvWithBOM], { 
      type: 'text/csv;charset=utf-8;' 
    });

    // Generate filename if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const defaultFileName = fileName || `users_${activeTab}_${timestamp}.csv`;

    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', defaultFileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      count: users.length,
      fileName: defaultFileName
    };

  } catch (error) {
    console.error('CSV export error:', error);
    throw error;
  }
};

// Additional export formats (optional)
export const exportToJSON = (users, activeTab, fileName = null) => {
  if (!users || users.length === 0) {
    throw new Error('No users to export');
  }

  try {
    const data = {
      exportedAt: new Date().toISOString(),
      userType: activeTab,
      totalUsers: users.length,
      users: users
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { 
      type: 'application/json;charset=utf-8;' 
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const defaultFileName = fileName || `users_${activeTab}_${timestamp}.json`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', defaultFileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      count: users.length,
      fileName: defaultFileName
    };

  } catch (error) {
    console.error('JSON export error:', error);
    throw error;
  }
};

// Export multiple formats
export const exportData = (users, activeTab, getUserField, options = {}) => {
  const { format = 'csv', fileName = null } = options;

  switch (format.toLowerCase()) {
    case 'csv':
      return exportToCSV(users, activeTab, getUserField, fileName);
    case 'json':
      return exportToJSON(users, activeTab, fileName);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

// Helper to format data for CSV
export const formatCSVData = (users, activeTab, getUserField) => {
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Status', 'User ID', 'Created At', 'Last Login'
  ];

  const rows = users.map(user => ({
    'First Name': getUserField(user, ['firstname', 'firstName', 'first_name', 'fname', 'name']),
    'Last Name': getUserField(user, ['lastname', 'lastName', 'last_name', 'lname', 'surname']),
    'Email': getUserField(user, ['email', 'emailAddress', 'email_address']),
    'Phone': getUserField(user, ['phone', 'phoneNumber', 'phone_number', 'number', 'mobile', 'contact']),
    'Status': activeTab,
    'User ID': user.id || user._id || 'N/A',
    'Created At': user.createdAt || user.created_at || user.dateCreated || 'N/A',
    'Last Login': user.lastLogin || user.last_login || user.lastActive || 'N/A'
  }));

  return { headers, rows };
};

export default {
  exportToCSV,
  exportToJSON,
  exportData,
  formatCSVData
};