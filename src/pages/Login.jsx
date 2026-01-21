// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { Eye, EyeOff } from "lucide-react";
// // // import { useAuthStore } from "../store/authStore";
// // // import { showLoginSuccess, showLoginError } from "../utils/sweetAlertConfig";
// // // import logoImg from "../../src/assets/resha-logo.png";

// // // const Login = () => {
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const login = useAuthStore((state) => state.login);
// // //   const navigate = useNavigate();

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       // Simulate API delay
// // //       await new Promise((resolve) => setTimeout(resolve, 800));

// // //       if (email === "admin@example.com" && password === "admin@123") {
// // //         // Login user first
// // //         login({
// // //           user: {
// // //             email: "admin@example.com",
// // //             name: "Admin User",
// // //             id: "demo-123",
// // //           },
// // //           token: "demo-token-12345",
// // //         });

// // //         // Show small toast notification
// // //         await showLoginSuccess("Admin");

// // //         // Navigate to dashboard
// // //         navigate("/dashboard", { replace: true });
// // //       } else if (email === "admin@example.com") {
// // //         // Wrong password - show error toast
// // //         await showLoginError("Incorrect password");
// // //       } else {
// // //         // Invalid credentials - show error toast
// // //         await showLoginError("Invalid email or password");
// // //       }
// // //     } catch (err) {
// // //       // Network error - show error toast
// // //       await showLoginError("Network error. Please try again.");
// // //       console.error("Login error:", err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleDemoLogin = () => {
// // //     setEmail("admin@example.com");
// // //     setPassword("admin@123");
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 flex items-center justify-center p-4">
// // //       <div className="w-full max-w-md">
// // //         <div className="bg-white rounded-2xl shadow-2xl p-8">
// // //           <div className="text-center mb-8">
// // //             <div className="flex justify-center items-center mb-6">
// // //               <div className="w-32 h-32 flex items-center justify-center">
// // //                 <img
// // //                   src={logoImg}
// // //                   alt="House of Resha Logo"
// // //                   className="w-full h-full object-contain max-w-full max-h-full"
// // //                 />
// // //               </div>
// // //             </div>
// // //             <h1 className="text-2xl font-bold text-gray-800 mb-2">
// // //               Admin Panel
// // //             </h1>
// // //             <p className="text-gray-600">Sign in to your account</p>
// // //           </div>

// // //           <form onSubmit={handleSubmit} className="space-y-6">
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Email Address
// // //               </label>
// // //               <input
// // //                 type="email"
// // //                 value={email}
// // //                 onChange={(e) => setEmail(e.target.value)}
// // //                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
// // //                 placeholder="admin@example.com"
// // //                 required
// // //               />
// // //             </div>

// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                 Password
// // //               </label>
// // //               <div className="relative">
// // //                 <input
// // //                   type={showPassword ? "text" : "password"}
// // //                   value={password}
// // //                   onChange={(e) => setPassword(e.target.value)}
// // //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12"
// // //                   placeholder="Enter your password"
// // //                   required
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowPassword(!showPassword)}
// // //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition p-1"
// // //                   aria-label={showPassword ? "Hide password" : "Show password"}
// // //                 >
// // //                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             <div className="flex items-center justify-between">
// // //               <label className="flex items-center cursor-pointer">
// // //                 <input
// // //                   type="checkbox"
// // //                   className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
// // //                 />
// // //                 <span className="ml-2 text-sm text-gray-600">Remember me</span>
// // //               </label>
// // //             </div>

// // //             <button
// // //               type="submit"
// // //               disabled={loading}
// // //               className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
// // //             >
// // //               {loading ? (
// // //                 <span className="flex items-center justify-center gap-2">
// // //                   <svg
// // //                     className="animate-spin h-5 w-5 text-white"
// // //                     xmlns="http://www.w3.org/2000/svg"
// // //                     fill="none"
// // //                     viewBox="0 0 24 24"
// // //                   >
// // //                     <circle
// // //                       className="opacity-25"
// // //                       cx="12"
// // //                       cy="12"
// // //                       r="10"
// // //                       stroke="currentColor"
// // //                       strokeWidth="4"
// // //                     ></circle>
// // //                     <path
// // //                       className="opacity-75"
// // //                       fill="currentColor"
// // //                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// // //                     ></path>
// // //                   </svg>
// // //                   <span>Logging in...</span>
// // //                 </span>
// // //               ) : (
// // //                 "Login"
// // //               )}
// // //             </button>
// // //           </form>

// // //           <div className="mt-6 pt-6 border-t border-gray-200">
// // //             <p className="text-center text-xs text-gray-500">
// // //               Secure login powered by House of Resha
// // //             </p>
// // //           </div>
// // //         </div>

// // //         <p className="text-center text-white text-sm mt-6 opacity-80">
// // //           © {new Date().getFullYear()} House of Resha. All rights reserved.
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;

// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { Eye, EyeOff } from "lucide-react";
// // // import { useAuthStore } from "../store/authStore";
// // // import { showLoginSuccess, showLoginError } from "../utils/sweetAlertConfig";
// // // import logoImg from "../../src/assets/resha-logo.png";

// // // const Login = () => {
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const login = useAuthStore((state) => state.login);
// // //   const navigate = useNavigate();

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);

// // //     try {
// // //       // Simulate API delay
// // //       await new Promise((resolve) => setTimeout(resolve, 100));

// // //       if (email === "admin@example.com" && password === "admin@123") {
// // //         // Login user first
// // //         login({
// // //           user: {
// // //             email: "admin@example.com",
// // //             name: "Admin User",
// // //             id: "demo-123",
// // //           },
// // //           token: "demo-token-12345",
// // //         });

// // //         // Show small toast notification
// // //         await showLoginSuccess("Admin");

// // //         // Navigate to dashboard
// // //         navigate("/dashboard", { replace: true });
// // //       } else if (email === "admin@example.com") {
// // //         // Wrong password - show error toast
// // //         await showLoginError("Incorrect password");
// // //       } else {
// // //         // Invalid credentials - show error toast
// // //         await showLoginError("Invalid email or password");
// // //       }
// // //     } catch (err) {
// // //       // Network error - show error toast
// // //       await showLoginError("Network error. Please try again.");
// // //       console.error("Login error:", err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleDemoLogin = () => {
// // //     setEmail("admin@example.com");
// // //     setPassword("admin@123");
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 flex items-center justify-center p-4">
// // //       <div className="w-full max-w-4xl">
// // //         {" "}
// // //         {/* Changed from max-w-md to max-w-4xl for wider layout */}
// // //         <div className="bg-white rounded-2xl shadow-2xl p-8 flex">
// // //           {" "}
// // //           {/* Added flex here */}
// // //           {/* Left side with logo and branding */}
// // //           <div className="w-1/2 pr-8 flex flex-col justify-center items-center border-r border-gray-200">
// // //             <div className="text-center">
// // //               <div className="flex justify-center items-center mb-6">
// // //                 <div className="w-48 h-48 flex items-center justify-center">
// // //                   {" "}
// // //                   {/* Increased logo size */}
// // //                   <img
// // //                     src={logoImg}
// // //                     alt="House of Resha Logo"
// // //                     className="w-full h-full object-contain max-w-full max-h-full"
// // //                   />
// // //                 </div>
// // //               </div>
// // //               <h1 className="text-3xl font-bold text-gray-800 mb-3">
// // //                 {" "}
// // //                 {/* Increased text size */}
// // //                 House of Resha
// // //               </h1>
// // //               <h2 className="text-xl font-semibold text-gray-700 mb-2">
// // //                 Admin Panel
// // //               </h2>
// // //               <p className="text-gray-600 max-w-xs">
// // //                 Secure access to manage your platform and users
// // //               </p>
// // //             </div>

// // //             <div className="mt-8 w-full">
// // //               <button
// // //                 type="button"
// // //                 onClick={handleDemoLogin}
// // //                 className="w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-3 rounded-lg font-semibold hover:from-purple-200 hover:to-pink-200 transition-all duration-200 border border-purple-200"
// // //               >
// // //                 Use Demo Credentials
// // //               </button>
// // //             </div>
// // //           </div>
// // //           {/* Right side with login form */}
// // //           <div className="w-1/2 pl-8">
// // //             <div className="text-center mb-8">
// // //               <h3 className="text-2xl font-bold text-gray-800 mb-2">
// // //                 Welcome Back
// // //               </h3>
// // //               <p className="text-gray-600">Sign in to continue</p>
// // //             </div>

// // //             <form onSubmit={handleSubmit} className="space-y-6">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                   Email Address
// // //                 </label>
// // //                 <input
// // //                   type="email"
// // //                   value={email}
// // //                   onChange={(e) => setEmail(e.target.value)}
// // //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
// // //                   placeholder="admin@example.com"
// // //                   required
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                   Password
// // //                 </label>
// // //                 <div className="relative">
// // //                   <input
// // //                     type={showPassword ? "text" : "password"}
// // //                     value={password}
// // //                     onChange={(e) => setPassword(e.target.value)}
// // //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12"
// // //                     placeholder="Enter your password"
// // //                     required
// // //                   />
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => setShowPassword(!showPassword)}
// // //                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition p-1"
// // //                     aria-label={
// // //                       showPassword ? "Hide password" : "Show password"
// // //                     }
// // //                   >
// // //                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               {/* <div className="flex items-center justify-between">
// // //                 <label className="flex items-center cursor-pointer">
// // //                   <input
// // //                     type="checkbox"
// // //                     className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
// // //                   />
// // //                   <span className="ml-2 text-sm text-gray-600">
// // //                     Remember me
// // //                   </span>
// // //                 </label>
// // //               </div> */}

// // //               <button
// // //                 type="submit"
// // //                 disabled={loading}
// // //                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
// // //               >
// // //                 {loading ? (
// // //                   <span className="flex items-center justify-center gap-2">
// // //                     <svg
// // //                       className="animate-spin h-5 w-5 text-white"
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       fill="none"
// // //                       viewBox="0 0 24 24"
// // //                     >
// // //                       <circle
// // //                         className="opacity-25"
// // //                         cx="12"
// // //                         cy="12"
// // //                         r="10"
// // //                         stroke="currentColor"
// // //                         strokeWidth="4"
// // //                       ></circle>
// // //                       <path
// // //                         className="opacity-75"
// // //                         fill="currentColor"
// // //                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// // //                       ></path>
// // //                     </svg>
// // //                     <span>Logging in...</span>
// // //                   </span>
// // //                 ) : (
// // //                   "Login"
// // //                 )}
// // //               </button>
// // //             </form>

// // //             <div className="mt-8 pt-6 border-t border-gray-200">
// // //               <p className="text-center text-xs text-gray-500">
// // //                 Secure login powered by House of Resha
// // //               </p>
// // //               <p className="text-center text-xs text-gray-500 mt-2">
// // //                 Demo: admin@example.com / admin@123
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <p className="text-center text-white text-sm mt-6 opacity-80">
// // //           © {new Date().getFullYear()} House of Resha. All rights reserved.
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;


// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Eye, EyeOff } from "lucide-react";
// // import { useAuthStore } from "../store/authStore";
// // import { showLoginSuccess, showLoginError } from "../utils/sweetAlertConfig";
// // import logoImg from "../../src/assets/resha-logo.png";

// // const Login = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const login = useAuthStore((state) => state.login);
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       await new Promise((resolve) => setTimeout(resolve, 100));

// //       if (email === "admin@example.com" && password === "admin@123") {
// //         login({
// //           user: {
// //             email: "admin@example.com",
// //             name: "Admin User",
// //             id: "demo-123",
// //           },
// //           token: "demo-token-12345",
// //         });

// //         await showLoginSuccess("Admin");
// //         navigate("/dashboard", { replace: true });
// //       } else if (email === "admin@example.com") {
// //         await showLoginError("Incorrect password");
// //       } else {
// //         await showLoginError("Invalid email or password");
// //       }
// //     } catch (err) {
// //       await showLoginError("Network error. Please try again.");
// //       console.error("Login error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDemoLogin = () => {
// //     setEmail("admin@example.com");
// //     setPassword("admin@123");
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
// //       <div className="w-full max-w-md lg:max-w-4xl">
// //         <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row">
// //           {/* Left side - Logo and Branding */}
// //           <div className="w-full lg:w-1/2 lg:pr-8 flex flex-col justify-center items-center lg:border-r border-gray-200 pb-6 lg:pb-0">
// //             <div className="text-center">
// //               {/* Logo */}
// //               <div className="flex justify-center items-center mb-4 sm:mb-6">
// //                 <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center">
// //                   <img
// //                     src={logoImg}
// //                     alt="House of Resha Logo"
// //                     className="w-full h-full object-contain max-w-full max-h-full"
// //                   />
// //                 </div>
// //               </div>
              
// //               {/* Branding Text */}
// //               <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
// //                 House of Resha
// //               </h1>
// //               <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
// //                 Admin Panel
// //               </h2>
// //               <p className="text-sm sm:text-base text-gray-600 max-w-xs mx-auto px-4">
// //                 Secure access to manage your platform and users
// //               </p>
// //             </div>

// //             {/* Demo Button */}
// //             <div className="mt-6 sm:mt-8 w-full px-4 sm:px-0">
// //               <button
// //                 type="button"
// //                 onClick={handleDemoLogin}
// //                 className="w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:from-purple-200 hover:to-pink-200 transition-all duration-200 border border-purple-200 text-sm sm:text-base"
// //               >
// //                 Use Demo Credentials
// //               </button>
// //             </div>
// //           </div>

// //           {/* Right side - Login Form */}
// //           <div className="w-full lg:w-1/2 lg:pl-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200">
// //             {/* Form Header */}
// //             <div className="text-center mb-6 sm:mb-8">
// //               <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
// //                 Welcome Back
// //               </h3>
// //               <p className="text-sm sm:text-base text-gray-600">Sign in to continue</p>
// //             </div>

// //             {/* Login Form */}
// //             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
// //               {/* Email Field */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Email Address
// //                 </label>
// //                 <input
// //                   type="email"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm sm:text-base"
// //                   placeholder="admin@example.com"
// //                   required
// //                 />
// //               </div>

// //               {/* Password Field */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Password
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type={showPassword ? "text" : "password"}
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12 text-sm sm:text-base"
// //                     placeholder="Enter your password"
// //                     required
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition p-1"
// //                     aria-label={showPassword ? "Hide password" : "Show password"}
// //                   >
// //                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Login Button */}
// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
// //               >
// //                 {loading ? (
// //                   <span className="flex items-center justify-center gap-2">
// //                     <svg
// //                       className="animate-spin h-5 w-5 text-white"
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       fill="none"
// //                       viewBox="0 0 24 24"
// //                     >
// //                       <circle
// //                         className="opacity-25"
// //                         cx="12"
// //                         cy="12"
// //                         r="10"
// //                         stroke="currentColor"
// //                         strokeWidth="4"
// //                       ></circle>
// //                       <path
// //                         className="opacity-75"
// //                         fill="currentColor"
// //                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// //                       ></path>
// //                     </svg>
// //                     <span>Logging in...</span>
// //                   </span>
// //                 ) : (
// //                   "Login"
// //                 )}
// //               </button>
// //             </form>

// //             {/* Footer Info */}
// //             <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
// //               <p className="text-center text-xs text-gray-500">
// //                 Secure login powered by House of Resha
// //               </p>
// //               <p className="text-center text-xs text-gray-500 mt-2">
// //                 Demo: admin@example.com / admin@123
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Copyright */}
// //         <p className="text-center text-white text-xs sm:text-sm mt-4 sm:mt-6 opacity-80">
// //           © {new Date().getFullYear()} House of Resha. All rights reserved.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { useAuthStore } from "../store/authStore";
// import { showLoginError } from "../utils/sweetAlertConfig";
// import logoImg from "../../src/assets/resha-logo.png";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const login = useAuthStore((state) => state.login);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 100));

//       if (email === "admin@example.com" && password === "admin@123") {
//         login({
//           user: {
//             email: "admin@example.com",
//             name: "Admin User",
//             id: "demo-123",
//           },
//           token: "demo-token-12345",
//         });

//         // INSTANT REDIRECT - no SweetAlert delay
//         navigate("/dashboard", { replace: true });
//       } else if (email === "admin@example.com") {
//         await showLoginError("Incorrect password");
//       } else {
//         await showLoginError("Invalid email or password");
//       }
//     } catch (err) {
//       await showLoginError("Network error. Please try again.");
//       console.error("Login error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDemoLogin = () => {
//     setEmail("admin@example.com");
//     setPassword("admin@123");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//       <div className="w-full max-w-md lg:max-w-4xl">
//         <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row">
//           {/* Left side - Logo and Branding */}
//           <div className="w-full lg:w-1/2 lg:pr-8 flex flex-col justify-center items-center lg:border-r border-gray-200 pb-6 lg:pb-0">
//             <div className="text-center">
//               {/* Logo */}
//               <div className="flex justify-center items-center mb-4 sm:mb-6">
//                 <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center">
//                   <img
//                     src={logoImg}
//                     alt="House of Resha Logo"
//                     className="w-full h-full object-contain max-w-full max-h-full"
//                   />
//                 </div>
//               </div>
              
//               {/* Branding Text */}
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
//                 House of Resha
//               </h1>
//               <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
//                 Admin Panel
//               </h2>
//               <p className="text-sm sm:text-base text-gray-600 max-w-xs mx-auto px-4">
//                 Secure access to manage your platform and users
//               </p>
//             </div>

//             {/* Demo Button */}
//             <div className="mt-6 sm:mt-8 w-full px-4 sm:px-0">
//               <button
//                 type="button"
//                 onClick={handleDemoLogin}
//                 className="w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:from-purple-200 hover:to-pink-200 transition-all duration-200 border border-purple-200 text-sm sm:text-base"
//               >
//                 Use Demo Credentials
//               </button>
//             </div>
//           </div>

//           {/* Right side - Login Form */}
//           <div className="w-full lg:w-1/2 lg:pl-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200">
//             {/* Form Header */}
//             <div className="text-center mb-6 sm:mb-8">
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//                 Welcome Back
//               </h3>
//               <p className="text-sm sm:text-base text-gray-600">Sign in to continue</p>
//             </div>

//             {/* Login Form */}
//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//               {/* Email Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm sm:text-base"
//                   placeholder="admin@example.com"
//                   required
//                 />
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12 text-sm sm:text-base"
//                     placeholder="Enter your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition p-1"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg
//                       className="animate-spin h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     <span>Logging in...</span>
//                   </span>
//                 ) : (
//                   "Login"
//                 )}
//               </button>
//             </form>

//             {/* Footer Info */}
//             <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
//               <p className="text-center text-xs text-gray-500">
//                 Secure login powered by House of Resha
//               </p>
//               <p className="text-center text-xs text-gray-500 mt-2">
//                 Demo: admin@example.com / admin@123
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Copyright */}
//         <p className="text-center text-white text-xs sm:text-sm mt-4 sm:mt-6 opacity-80">
//           © {new Date().getFullYear()} House of Resha. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Swal from "sweetalert2";
import { showLoginError } from "../utils/sweetAlertConfig";
import logoImg from "../../src/assets/resha-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (email === "admin@example.com" && password === "admin@123") {
        login({
          user: {
            email: "admin@example.com",
            name: "Admin User",
            id: "demo-123",
          },
          token: "demo-token-12345",
        });

        // Show success toast on right side
        Swal.fire({
          title: "Welcome, Admin!",
          text: "Login successful",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          background: "#10b981",
          color: "white",
          iconColor: "white",
          customClass: {
            popup: "colored-toast",
          },
        });

        // Redirect immediately
        navigate("/dashboard", { replace: true });
      } else if (email === "admin@example.com") {
        await showLoginError("Incorrect password");
      } else {
        await showLoginError("Invalid email or password");
      }
    } catch (err) {
      await showLoginError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("admin@example.com");
    setPassword("admin@123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-4xl">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row">
          {/* Left side - Logo and Branding */}
          <div className="w-full lg:w-1/2 lg:pr-8 flex flex-col justify-center items-center lg:border-r border-gray-200 pb-6 lg:pb-0">
            <div className="text-center">
              {/* Logo */}
              <div className="flex justify-center items-center mb-4 sm:mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="House of Resha Logo"
                    className="w-full h-full object-contain max-w-full max-h-full"
                  />
                </div>
              </div>
              
              {/* Branding Text */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                House of Resha
              </h1>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                Admin Panel
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-xs mx-auto px-4">
                Secure access to manage your platform and users
              </p>
            </div>

            {/* Demo Button */}
            <div className="mt-6 sm:mt-8 w-full px-4 sm:px-0">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:from-purple-200 hover:to-pink-200 transition-all duration-200 border border-purple-200 text-sm sm:text-base"
              >
                Use Demo Credentials
              </button>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full lg:w-1/2 lg:pl-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200">
            {/* Form Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h3>
              <p className="text-sm sm:text-base text-gray-600">Sign in to continue</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm sm:text-base"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12 text-sm sm:text-base"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] text-sm sm:text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Logging in...</span>
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Footer Info */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500">
                Secure login powered by House of Resha
              </p>
              <p className="text-center text-xs text-gray-500 mt-2">
                Demo: admin@example.com / admin@123
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-white text-xs sm:text-sm mt-4 sm:mt-6 opacity-80">
          © {new Date().getFullYear()} House of Resha. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;