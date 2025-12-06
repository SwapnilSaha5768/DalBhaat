import React, { useState } from 'react';
import { loginUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [slideOut, setSlideOut] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);

            if (response && response.success) {
                showToast('Login successful', 'success');
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('isAdmin', response.isAdmin || false);
                localStorage.setItem('userId', response.userId);

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

    const handleRegisterRedirect = () => {
        setSlideOut(true);
        setTimeout(() => {
            navigate('/register');
        }, 600); // Match animation duration
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-5">
            <div className="flex w-full max-w-[750px] h-[480px] bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden animate-[fadeIn_0.8s_ease-out]">

                {/* Left Panel (Dark) */}
                <div className={`flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white flex flex-col justify-center items-start p-10 relative ${slideOut ? 'animate-panelSlideRight' : 'animate-panelEnterLeft'}`}>
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
                <div className={`flex-1 bg-white flex flex-col justify-center p-10 ${slideOut ? 'animate-panelSlideLeft' : 'animate-panelEnterRight'}`}>
                    <h2 className="text-[2rem] font-bold text-[#333] mb-[30px]">Sign In</h2>
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-[#555] text-[0.9rem]">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full p-3 border border-[#e1e1e1] rounded-lg text-[0.95rem] text-[#333] bg-white transition-all duration-300 focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)] focus:outline-none placeholder-[#aaa]"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-[#555] text-[0.9rem]">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full p-3 border border-[#e1e1e1] rounded-lg text-[0.95rem] text-[#333] bg-white transition-all duration-300 focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)] focus:outline-none placeholder-[#aaa]"
                            />
                            <span className="text-right text-[0.8rem] text-[#ff6b6b] cursor-pointer mt-[15px]">Forgot password?</span>
                        </div>
                        <button
                            type="submit"
                            className="w-full p-3 border-none rounded-lg bg-[#ff6b6b] text-white text-[1rem] font-bold cursor-pointer transition-all duration-300 mt-[5px] hover:bg-[#ff5252] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(255,107,107,0.3)]"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
