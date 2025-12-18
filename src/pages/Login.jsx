// sweetalert config applied version

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { showLoginSuccess, showLoginError } from '../utils/sweetAlertConfig';
import logoImg from '../../src/assets/resha-logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (email === 'admin@example.com' && password === 'admin@123') {
                // Login user first
                login({
                    user: {
                        email: 'admin@example.com',
                        name: 'Admin User',
                        id: 'demo-123'
                    },
                    token: 'demo-token-12345'
                });
                
                // Show small toast notification
                await showLoginSuccess('Admin');
                
                // Navigate to dashboard
                navigate('/dashboard', { replace: true });
            } else if (email === 'admin@example.com') {
                // Wrong password - show error toast
                await showLoginError('Incorrect password');
            } else {
                // Invalid credentials - show error toast
                await showLoginError('Invalid email or password');
            }
        } catch (err) {
            // Network error - show error toast
            await showLoginError('Network error. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        setEmail('admin@example.com');
        setPassword('admin@123');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center mb-6">
                            <div className="w-32 h-32 flex items-center justify-center">
                                <img 
                                    src={logoImg} 
                                    alt="House of Resha Logo" 
                                    className="w-full h-full object-contain max-w-full max-h-full"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h1>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12"
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Logging in...</span>
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold mb-2">Demo Credentials:</p>
                        <div className="flex flex-col gap-1">
                            <p className="font-mono text-xs bg-white p-2 rounded border">
                                📧 admin@example.com
                            </p>
                            <p className="font-mono text-xs bg-white p-2 rounded border">
                                🔒 admin@123
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="mt-3 w-full py-2 text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all border border-purple-200"
                        >
                            Fill Demo Credentials
                        </button>
                    </div> */}

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-xs text-gray-500">
                            Secure login powered by House of Resha
                        </p>
                    </div>
                </div>

                <p className="text-center text-white text-sm mt-6 opacity-80">
                    © {new Date().getFullYear()} House of Resha. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;