// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import Layout from './components/Layout';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Products from './pages/Products';
// import Orders from './pages/Orders';
// import Customers from './pages/Customers';
// import MIEByResha from './pages/MIEByResha';
// import Banners from './pages/Banners';
// import BannerModel from './components/BannerModel';

// // Create a client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
//       retry: 2,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// const App = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <Router>
//           <Routes>
//             {/* Public Route */}
//             <Route path="/login" element={<Login />} />

//             {/* Protected Routes */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Layout />
//                 </ProtectedRoute>
//               }
//             >
//               <Route index element={<Navigate to="/dashboard" replace />} />
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="products" element={<Products />} />
//               <Route path="orders" element={<Orders />} />
//               <Route path="customers" element={<Customers />} />
//               <Route path="mie-by-resha" element={<MIEByResha />} />
//               <Route path="banners" element={<BannerModel />} />
//             </Route>

//             {/* Catch all route - redirect to dashboard */}
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Routes>
//         </Router>
//       </AuthProvider>

//       {/* React Query Devtools - Remove in production */}
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// };

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import MIEByResha from "./pages/MIEByResha";
import UserManagement from "./pages/UserManagement"; // Add this import
import Banners from "./pages/Banners";
import Blogs from "./pages/Blogs";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="mieh-by-resha" element={<MIEByResha />} />
              <Route path="banners" element={<Banners />} />
              <Route path="users" element={<UserManagement />} />{" "}
              <Route path="blogs" element={<Blogs />} />

              {/* Add this route */}
            </Route>

            {/* Catch all route - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
