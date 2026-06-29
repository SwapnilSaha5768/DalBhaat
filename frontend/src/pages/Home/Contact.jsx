import React from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendContactMessage } from '../../services/api';

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters")
});

const Contact = () => {
    const { showToast } = useToast();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            message: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await sendContactMessage(data);
            showToast(response.message || 'Message sent successfully! We will get back to you soon.', 'success');
            reset();
        } catch (err) {
            console.error('Contact form submission error:', err);
            showToast(err.response?.data?.message || 'Failed to send message. Please try again.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-5 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex flex-col md:flex-row w-full max-w-[900px] bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden min-h-[550px]">

                <div className="md:w-5/12 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

                    <div>
                        <h2 className="text-3xl text-white font-bold mb-6">Get in Touch</h2>
                        <p className="text-white/80 mb-10 leading-relaxed">
                            Have questions about our products or your order? We're here to help you.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <Phone className="w-5 h-5 text-[#ff6b6b]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-white/90">Phone</h3>
                                    <p className="text-white/70 text-sm mt-1">+880 1712 345 678</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <Mail className="w-5 h-5 text-[#ff6b6b]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-white/90">Email</h3>
                                    <p className="text-white/70 text-sm mt-1">swapnilsaha99@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <MapPin className="w-5 h-5 text-[#ff6b6b]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-white/90">Office</h3>
                                    <p className="text-white/70 text-sm mt-1">
                                        Level 4, Gulshan Avenue<br />Dhaka, Bangladesh
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                                    <Clock className="w-5 h-5 text-[#ff6b6b]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-white/90">Hours</h3>
                                    <p className="text-white/70 text-sm mt-1">Sun - Thu: 9AM - 6PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Contact Form (Light) */}
                <div className="md:w-7/12 bg-white p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
                    <p className="text-gray-500 text-sm mb-8">We usually respond within 24 hours.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/10 outline-none transition-all placeholder:text-gray-400 text-sm`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/10 outline-none transition-all placeholder:text-gray-400 text-sm`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                {...register('message')}
                                rows="5"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-200'} focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/10 outline-none transition-all placeholder:text-gray-400 text-sm resize-none`}
                                placeholder="How can we help you today?"
                            ></textarea>
                            {errors.message && <span className="text-red-500 text-xs">{errors.message.message}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 px-6 rounded-lg bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
