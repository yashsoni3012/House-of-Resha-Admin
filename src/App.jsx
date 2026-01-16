// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Layout from "./components/Layout";

// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Orders from "./pages/Orders";
// import Customers from "./pages/Customers";
// import UserManagement from "./pages/UserManagement";
// import Banners from "./pages/Banners";
// import Blogs from "./pages/Blogs";
// import Products from "./pages/Products";

// import AddProducts from "./components/AddProducts";
// import EditProducts from "./components/EditProducts";
// import AddBanners from "./components/AddBanners";
// import EditBanner from "./components/EditBanners";
// import AddBlogs from "./components/AddBlogs";
// import EditBlogs from "./components/EditBlogs";
// import AddPerfumes from "./components/AddPerfumes";
// import EditPerfumes from "./components/EditPerfumes";

// /* ✅ CONTENT MANAGER (NESTED) */
// import ContentManager from "./pages/ContentManager";
// import PrivacyPolicy from "./components/PrivacyPolicy";
// import FAQ from "./components/FAQ";
// import OurStory from "./components/OurStory";

// /* ✅ React Query Client */
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000,
//       gcTime: 10 * 60 * 1000,
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
//             {/* ================= PUBLIC ================= */}
//             <Route path="/login" element={<Login />} />

//             {/* ================= PROTECTED ================= */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute>
//                   <Layout />
//                 </ProtectedRoute>
//               }
//             >
//               {/* default */}
//               <Route index element={<Navigate to="/dashboard" replace />} />

//               {/* dashboard */}
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="orders" element={<Orders />} />
//               <Route path="customers" element={<Customers />} />
//               <Route path="users" element={<UserManagement />} />

//               {/* products */}
//               <Route path="fashion" element={<Products />} />
//               <Route path="glow-rituals" element={<Products />} />
//               <Route path="featured-images" element={<Products />} />
//               <Route path="add-product" element={<AddProducts />} />
//               <Route path="edit-product/:id" element={<EditProducts />} />
//               <Route path="add-perfume" element={<AddPerfumes />} />
//               <Route path="edit-perfume/:id" element={<EditPerfumes />} />

//               {/* banners */}
//               <Route path="banners" element={<Banners />} />
//               <Route path="add-banner" element={<AddBanners />} />
//               <Route path="edit-banner/:id" element={<EditBanner />} />

//               {/* blogs */}
//               <Route path="blogs" element={<Blogs />} />
//               <Route path="add-blog" element={<AddBlogs />} />
//               <Route path="edit-blog/:id" element={<EditBlogs />} />

//               {/* ================= CONTENT MANAGER ================= */}
//               <Route path="content" element={<ContentManager />}>
//                 {/* default tab */}
//                 <Route index element={<PrivacyPolicy />} />

//                 {/* tabs */}
//                 <Route path="privacy-policy" element={<PrivacyPolicy />} />
//                 <Route path="faq" element={<FAQ />} />
//                 <Route path="our-story" element={<OurStory />} />
//               </Route>
//             </Route>

//             {/* fallback */}
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Routes>
//         </Router>
//       </AuthProvider>

//       {/* Devtools */}
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

/* ✅ CONTENT MANAGER (NESTED) */
import ContentManager from "./pages/ContentManager";
import PrivacyPolicy from "./components/PrivacyPolicy";
import FAQ from "./components/FAQ";
import OurStory from "./components/OurStory";

/* ✅ FLOATING CHAT WIDGET */
import FloatingChatWidget from "./pages/FloatingChatWidget";

/* ✅ React Query Client */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
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
            {/* ================= PUBLIC ================= */}
            <Route path="/login" element={<Login />} />

            {/* ================= PROTECTED ================= */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* default */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* dashboard */}
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
              <Route path="add-perfume" element={<AddPerfumes />} />
              <Route path="edit-perfume/:id" element={<EditPerfumes />} />

              {/* banners */}
              <Route path="banners" element={<Banners />} />
              <Route path="add-banner" element={<AddBanners />} />
              <Route path="edit-banner/:id" element={<EditBanner />} />

              {/* blogs */}
              <Route path="blogs" element={<Blogs />} />
              <Route path="add-blog" element={<AddBlogs />} />
              <Route path="edit-blog/:id" element={<EditBlogs />} />

              {/* ================= CONTENT MANAGER ================= */}
              <Route path="content" element={<ContentManager />}>
                {/* default tab */}
                <Route index element={<PrivacyPolicy />} />

                {/* tabs */}
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="our-story" element={<OurStory />} />
              </Route>
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* ✅ FLOATING CHAT WIDGET - Available on all protected routes */}
          <FloatingChatWidget />
        </Router>
      </AuthProvider>

      {/* Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
