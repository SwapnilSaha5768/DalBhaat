import React, { useState } from 'react';
import { loginUser, googleLogin } from '../../services/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

function Login({ onLogin }) {
    const [slideOut, setSlideOut] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    // Check if we navigated from registration page
    const fromRegister = location.state?.fromRegister;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await loginUser(data.email, data.password);

            if (response && response.success) {
                showToast('Login successful', 'success');
                if (onLogin) {
                    onLogin(response.isAdmin || false);
                }
                navigate('/');
            } else {
                showToast(response.message || 'Login failed: Incorrect email or password', 'error');
            }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            showToast(
                error.response?.data?.message || 'Login failed: An error occurred. Please try again.',
                'error'
            );
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await googleLogin(credentialResponse.credential);
            if (response && response.success) {
                showToast('Google login successful', 'success');
                if (onLogin) {
                    onLogin(response.isAdmin || false);
                }
                navigate('/');
            } else {
                showToast(response.message || 'Google authentication failed', 'error');
            }
        } catch (error) {
            console.error('Google login error:', error);
            showToast(error.response?.data?.message || 'Google authentication failed', 'error');
        }
    };

    const handleRegisterRedirect = () => {
        setSlideOut(true);
        setTimeout(() => {
            navigate('/register', { state: { fromLogin: true } });
        }, 500);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-5">
            <div className="flex flex-col md:flex-row w-full max-w-[750px] min-h-[580px] md:h-[520px] bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden">

                {/* Left Panel (Dark) */}
                <div className={`flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white flex flex-col justify-center items-start p-10 relative ${slideOut ? 'animate-slide-out-right' : (fromRegister ? 'animate-slide-in-left' : 'animate-[fadeIn_0.6s_ease-out]')} w-full md:w-1/2 order-2 md:order-1`}>
                    <h2 className="text-[2.2rem] font-bold mb-4 text-white/80 leading-[1.2]">Welcome Back</h2>
                    <p className="text-[0.95rem] leading-[1.5] text-white/80 mb-[30px]">
                        Sign in to access our store, track your orders, and continue your shopping journey.
                    </p>
                    <div className="absolute bottom-[30px] left-10 text-[0.85rem] text-white/60">
                        Don't have an account?
                        <span
                            className="text-white font-bold ml-[5px] cursor-pointer transition-colors duration-300 hover:text-[#ff6b6b]"
                            onClick={handleRegisterRedirect}
                        >
                            Create an account →
                        </span>
                    </div>
                </div>

                {/* Right Panel (Light) */}
                <div className={`flex-1 bg-white flex flex-col justify-center p-8 ${slideOut ? 'animate-slide-out-left' : (fromRegister ? 'animate-slide-in-right' : 'animate-[fadeIn_0.6s_ease-out]')} w-full md:w-1/2 order-1 md:order-2`}>
                    <h2 className="text-[1.8rem] font-bold text-[#333] mb-[20px]">Sign In</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold text-[#555] text-[0.85rem]">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                {...register('email')}
                                className={`w-full p-2.5 border rounded-lg text-[0.9rem] text-[#333] bg-white transition-all duration-300 focus:outline-none placeholder-[#aaa] ${errors.email ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(255,0,0,0.1)]' : 'border-[#e1e1e1] focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]'}`}
                            />
                            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold text-[#555] text-[0.85rem]">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                {...register('password')}
                                className={`w-full p-2.5 border rounded-lg text-[0.9rem] text-[#333] bg-white transition-all duration-300 focus:outline-none placeholder-[#aaa] ${errors.password ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(255,0,0,0.1)]' : 'border-[#e1e1e1] focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]'}`}
                            />
                            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                            <Link to="/forgot-password" className="text-right text-[0.8rem] text-[#ff6b6b] cursor-pointer mt-1 hover:underline">Forgot password?</Link>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full p-2.5 border-none rounded-lg bg-[#ff6b6b] text-white text-[0.95rem] font-bold cursor-pointer transition-all duration-300 mt-1 hover:bg-[#ff5252] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(255,107,107,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-4 flex flex-col items-center w-full">
                        <div className="relative flex py-1 items-center w-full">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-3 text-gray-400 text-[0.75rem] font-semibold uppercase">Or continue with</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <div className="mt-2 w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => showToast('Google login failed', 'error')}
                                shape="rectangular"
                                theme="outline"
                                size="large"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
