import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPassword } from '../../services/api';
import { Link } from 'react-router-dom';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        setMessage('');
        setError('');
        try {
            const response = await forgotPassword(data.email);
            setMessage(response.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa] font-sans">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                    <p className="text-gray-500">Enter your email to receive a password reset link.</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none`}
                            placeholder="Enter your email"
                            {...register('email')}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-[#ff1e00] text-white font-bold rounded-lg hover:bg-[#e01b00] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-[#ff1e00]/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
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
