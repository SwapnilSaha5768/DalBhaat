import React, { useState } from 'react';
import { registerUser } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

function RegistrationPage() {
    const [slideOut, setSlideOut] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we navigated from login page
    const fromLogin = location.state?.fromLogin;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        try {
            const userData = await registerUser(data.name, data.email, data.password);
            if (userData) {
                navigate('/login');
            }
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    const handleLoginRedirect = () => {
        setSlideOut(true);
        setTimeout(() => {
            navigate('/login', { state: { fromRegister: true } });
        }, 600); // Match animation duration
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-5">
            <div className={`flex flex-col md:flex-row w-full max-w-[750px] min-h-[550px] md:h-[480px] bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden ${fromLogin ? '' : 'animate-[fadeIn_0.8s_ease-out]'}`}>

                {/* Left Panel (Form) */}
                <div className={`flex-1 bg-white flex flex-col justify-center p-10 ${slideOut ? 'animate-panelSlideRight' : (fromLogin ? '' : 'animate-panelEnterLeft')} w-full md:w-1/2 order-1 md:order-1`}>
                    <h2 className="text-[2rem] font-bold text-[#333] mb-[25px] text-left">Create Account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[15px]">
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="name" className="font-semibold text-[#555] text-[0.9rem] ml-0">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Name"
                                {...register('name')}
                                className={`w-full p-3 border rounded-lg text-[0.95rem] text-[#333] bg-white transition-all duration-300 focus:outline-none placeholder-[#aaa] ${errors.name ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(255,0,0,0.1)]' : 'border-[#e1e1e1] focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]'}`}
                            />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="email" className="font-semibold text-[#555] text-[0.9rem] ml-0">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...register('email')}
                                className={`w-full p-3 border rounded-lg text-[0.95rem] text-[#333] bg-white transition-all duration-300 focus:outline-none placeholder-[#aaa] ${errors.email ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(255,0,0,0.1)]' : 'border-[#e1e1e1] focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]'}`}
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="password" className="font-semibold text-[#555] text-[0.9rem] ml-0">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                {...register('password')}
                                className={`w-full p-3 border rounded-lg text-[0.95rem] text-[#333] bg-white transition-all duration-300 focus:outline-none placeholder-[#aaa] ${errors.password ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(255,0,0,0.1)]' : 'border-[#e1e1e1] focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]'}`}
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                            {!errors.password && <span className="text-[0.8rem] text-[#888] mt-[5px]">Must be at least 6 characters long.</span>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full p-3 border-none rounded-lg bg-[#ff6b6b] text-white text-[1rem] font-bold cursor-pointer transition-all duration-300 mt-[5px] hover:bg-[#ff5252] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(255,107,107,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>

                {/* Right Panel (Dark) */}
                <div className={`flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white flex flex-col justify-center items-start p-10 relative ${slideOut ? 'animate-panelSlideLeft' : (fromLogin ? '' : 'animate-panelEnterRight')} w-full md:w-1/2 order-2 md:order-2`}>
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
