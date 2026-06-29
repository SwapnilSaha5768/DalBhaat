import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPassword, resetPassword } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const emailSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const otpResetSchema = z.object({
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { register: registerEmail, handleSubmit: handleSubmitEmail, formState: { errors: emailErrors, isSubmitting: isSendingOtp } } = useForm({
        resolver: zodResolver(emailSchema),
    });

    const { register: registerReset, handleSubmit: handleSubmitReset, setValue: setResetValue, formState: { errors: resetErrors, isSubmitting: isResetting } } = useForm({
        resolver: zodResolver(otpResetSchema),
    });

    const onSendOtp = async (data) => {
        setMessage('');
        setError('');
        try {
            const response = await forgotPassword(data.email);
            setEmail(data.email);
            setMessage(response.message || 'OTP sent successfully to your email');
            setStep(2);
            setResetValue('otp', '');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const onResetPassword = async (data) => {
        setMessage('');
        setError('');
        try {
            const response = await resetPassword(email, data.otp, data.password);
            setMessage(response.message || 'Password reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP.');
        }
    };

    const otpRegisterProps = registerReset('otp');

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa] font-sans p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {step === 1 ? 'Forgot Password' : 'Verify OTP & Reset'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {step === 1 
                            ? 'Enter your email address to receive a 6-digit verification code.'
                            : `We have sent a 6-digit OTP to ${email}.`
                        }
                    </p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 101.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSubmitEmail(onSendOtp)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                className={`w-full px-4 py-3 rounded-lg border ${emailErrors.email ? 'border-red-500' : 'border-gray-200'} focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none`}
                                placeholder="Enter your email"
                                {...registerEmail('email')}
                            />
                            {emailErrors.email && <p className="mt-1 text-xs text-red-500">{emailErrors.email.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSendingOtp}
                            className="w-full py-3 bg-[#ff1e00] text-white font-bold rounded-lg hover:bg-[#e01b00] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-[#ff1e00]/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isSendingOtp ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmitReset(onResetPassword)} className="space-y-5" autoComplete="off">
                        {/* Hidden username input to satisfy browser password managers */}
                        <input type="text" name="username" autoComplete="username" defaultValue={email} style={{ display: 'none' }} readOnly />

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">6-Digit OTP Code</label>
                            <input
                                id="reset-otp-code"
                                type="text"
                                maxLength={6}
                                autoComplete="off"
                                inputMode="numeric"
                                data-lpignore="true"
                                className={`w-full px-4 py-3 rounded-lg border text-center tracking-widest text-xl font-mono ${resetErrors.otp ? 'border-red-500' : 'border-gray-200'} focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none`}
                                placeholder="123456"
                                ref={otpRegisterProps.ref}
                                name={otpRegisterProps.name}
                                onBlur={otpRegisterProps.onBlur}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    otpRegisterProps.onChange(e);
                                }}
                            />
                            {resetErrors.otp && <p className="mt-1 text-xs text-red-500">{resetErrors.otp.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                className={`w-full px-4 py-3 rounded-lg border ${resetErrors.password ? 'border-red-500' : 'border-gray-200'} focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none`}
                                placeholder="Enter new password"
                                {...registerReset('password')}
                            />
                            {resetErrors.password && <p className="mt-1 text-xs text-red-500">{resetErrors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                className={`w-full px-4 py-3 rounded-lg border ${resetErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none`}
                                placeholder="Confirm new password"
                                {...registerReset('confirmPassword')}
                            />
                            {resetErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{resetErrors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isResetting}
                            className="w-full py-3 bg-[#ff1e00] text-white font-bold rounded-lg hover:bg-[#e01b00] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-[#ff1e00]/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isResetting ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        <div className="text-center mt-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-xs text-gray-500 hover:text-[#ff1e00] underline"
                            >
                                Change email or resend OTP
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Remember your password?{' '}
                        <Link to="/login" className="text-[#ff1e00] font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
