import React, { useState } from 'react';
import { registerUser, googleLogin } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';
import { useToast } from '../../context/ToastContext';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

function RegistrationPage({ onLogin }) {
    const [slideOut, setSlideOut] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    // Check if we navigated from login page
    const fromLogin = location.state?.fromLogin;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        try {
            const userData = await registerUser(data.name, data.email, data.password);
            if (userData) {
                showToast('Registration successful! Please login.', 'success');
                navigate('/login');
            }
        } catch (error) {
            console.error("Registration failed", error);
            showToast(error.response?.data?.message || 'Registration failed', 'error');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await googleLogin(credentialResponse.credential);
            if (response && response.success) {
                showToast('Google registration successful', 'success');
                if (onLogin) {
                    onLogin(response.isAdmin || false);
                }
                navigate('/');
            } else {
                showToast(response.message || 'Google authentication failed', 'error');
            }
        } catch (error) {
            console.error('Google registration error:', error);
            showToast(error.response?.data?.message || 'Google authentication failed', 'error');
        }
    };

    const handleLoginRedirect = () => {
        setSlideOut(true);
        setTimeout(() => {
            navigate('/login', { state: { fromRegister: true } });
        }, 500);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-5">
            <div className="flex flex-col md:flex-row w-full max-w-[750px] min-h-[580px] md:h-[520px] bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden">

                {/* Left Panel (Form) */}
                <div className={`flex-1 bg-white flex flex-col justify-center p-8 ${slideOut ? 'animate-slide-out-right' : (fromLogin ? 'animate-slide-in-left' : 'animate-[fadeIn_0.6s_ease-out]')} w-full md:w-1/2 order-1 md:order-1`}>
                    <h2 className="text-[1.8rem] font-bold text-[#333] mb-[15px] text-left">Create Account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="font-semibold text-[#555] text-[0.85rem] ml-0">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Name"
                                {...register('name')}
                                className={`w-full p-2.5 border rounded-lg text-[0.9rem] text-[#333] bg-white transition-all duration-300 focus:outline-none placeholder-[#aaa] ${errors.name ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(255,0,0,0.1)]' : 'border-[#e1e1e1] focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]'}`}
                            />
                            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-semibold text-[#555] text-[0.85rem] ml-0">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                                className={`w-full p-2.5 border rounded-lg text-[0.9rem] text-[#333] bg-white transition-all duration-300 focus:outline-none placeholder-[#aaa] ${errors.email ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(255,0,0,0.1)]' : 'border-[#e1e1e1] focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]'}`}
                            />
                            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="font-semibold text-[#555] text-[0.85rem] ml-0">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                {...register('password')}
                                className={`w-full p-2.5 border rounded-lg text-[0.9rem] text-[#333] bg-white transition-all duration-300 focus:outline-none placeholder-[#aaa] ${errors.password ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(255,0,0,0.1)]' : 'border-[#e1e1e1] focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]'}`}
                            />
                            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full p-2.5 border-none rounded-lg bg-[#ff6b6b] text-white text-[0.95rem] font-bold cursor-pointer transition-all duration-300 mt-1 hover:bg-[#ff5252] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(255,107,107,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-3 flex flex-col items-center w-full">
                        <div className="relative flex py-1 items-center w-full">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-3 text-gray-400 text-[0.75rem] font-semibold uppercase">Or sign up with</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <div className="mt-2 w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => showToast('Google registration failed', 'error')}
                                shape="rectangular"
                                theme="outline"
                                size="large"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel (Dark) */}
                <div className={`flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white flex flex-col justify-center items-start p-10 relative ${slideOut ? 'animate-slide-out-left' : (fromLogin ? 'animate-slide-in-right' : 'animate-[fadeIn_0.6s_ease-out]')} w-full md:w-1/2 order-2 md:order-2`}>
                    <h2 className="text-[2.2rem] font-bold mb-[15px] text-white/80 leading-[1.2]">Join Us</h2>
                    <p className="text-[0.95rem] leading-[1.5] text-white/80 mb-[30px]">
                        Create an account to unlock seamless shopping.
                    </p>
                    <div className="absolute bottom-[30px] left-10 text-[0.85rem] text-white/60">
                        Already have an account?
                        <span
                            className="text-white font-bold ml-[5px] cursor-pointer transition-colors duration-300 hover:text-[#ff6b6b]"
                            onClick={handleLoginRedirect}
                        >
                            Sign in here →
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RegistrationPage;
