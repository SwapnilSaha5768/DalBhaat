import React, { useState } from 'react';
import { registerUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [slideOut, setSlideOut] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const userData = await registerUser(name, email, password);
        if (userData) {
            navigate('/login');
        }
    };

    const handleLoginRedirect = () => {
        setSlideOut(true);
        setTimeout(() => {
            navigate('/login');
        }, 600); // Match animation duration
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-5">
            <div className="flex flex-col md:flex-row w-full max-w-[750px] min-h-[550px] md:h-[480px] bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden animate-[fadeIn_0.8s_ease-out]">

                {/* Left Panel (Form) */}
                <div className={`flex-1 bg-white flex flex-col justify-center p-10 ${slideOut ? 'animate-panelSlideRight' : 'animate-panelEnterLeft'} w-full md:w-1/2 order-1 md:order-1`}>
                    <h2 className="text-[2rem] font-bold text-[#333] mb-[25px] text-left">Create Account</h2>
                    <form onSubmit={handleRegister} className="flex flex-col gap-[15px]">
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="name" className="font-semibold text-[#555] text-[0.9rem] ml-0">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                placeholder="Name"
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-3 border border-[#e1e1e1] rounded-lg text-[0.95rem] text-[#333] bg-white transition-all duration-300 focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)] focus:outline-none placeholder-[#aaa]"
                            />
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="email" className="font-semibold text-[#555] text-[0.9rem] ml-0">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 border border-[#e1e1e1] rounded-lg text-[0.95rem] text-[#333] bg-white transition-all duration-300 focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)] focus:outline-none placeholder-[#aaa]"
                            />
                        </div>
                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="password" className="font-semibold text-[#555] text-[0.9rem] ml-0">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                placeholder="********"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-[#e1e1e1] rounded-lg text-[0.95rem] text-[#333] bg-white transition-all duration-300 focus:border-[#ff6b6b] focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)] focus:outline-none placeholder-[#aaa]"
                            />
                            <span className="text-[0.8rem] text-[#888] mt-[5px]">Must be at least 8 characters long.</span>
                        </div>
                        <button
                            type="submit"
                            className="w-full p-3 border-none rounded-lg bg-[#ff6b6b] text-white text-[1rem] font-bold cursor-pointer transition-all duration-300 mt-[5px] hover:bg-[#ff5252] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(255,107,107,0.3)]"
                        >
                            Register
                        </button>
                    </form>
                </div>

                {/* Right Panel (Dark) */}
                <div className={`flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white flex flex-col justify-center items-start p-10 relative ${slideOut ? 'animate-panelSlideLeft' : 'animate-panelEnterRight'} w-full md:w-1/2 order-2 md:order-2`}>
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
