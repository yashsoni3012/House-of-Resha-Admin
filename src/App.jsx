import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import UserManagement from "./pages/UserManagement";
import Banners from "./pages/Banners";
import Blogs from "./pages/Blogs";
import Products from "./pages/Products";

import AddProducts from "./components/AddProducts";
import EditProducts from "./components/EditProducts";
import AddBanners from "./components/AddBanners";
import EditBanner from "./components/EditBanners";
import AddBlogs from "./components/AddBlogs";
import EditBlogs from "./components/EditBlogs";
import AddPerfumes from "./components/AddPerfumes";
import EditPerfumes from "./components/EditPerfumes";

// ✅ Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      gcTime: 10 * 60 * 1000, // 10 min
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
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected */}
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
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="users" element={<UserManagement />} />

              {/* products */}
              <Route path="fashion" element={<Products />} />
              <Route path="glow-rituals" element={<Products />} />
              <Route path="featured-images" element={<Products />} />
              <Route path="add-product" element={<AddProducts />} />
              <Route path="edit-product/:id" element={<EditProducts />} />
              <Route path="/add-perfume" element={<AddPerfumes />} />
              <Route path="/edit-perfume/:id" element={<EditPerfumes />} />


              {/* banners */}
              <Route path="banners" element={<Banners />} />
              <Route path="add-banner" element={<AddBanners />} />
              <Route path="edit-banner/:id" element={<EditBanner />} />

              {/* blogs */}
              <Route path="blogs" element={<Blogs />} />
              <Route path="add-blog" element={<AddBlogs />} />
              <Route path="edit-blog/:id" element={<EditBlogs />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>

      {/* ✅ REACT QUERY DEVTOOLS */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
