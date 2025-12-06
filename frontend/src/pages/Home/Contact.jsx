import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            showToast('Message sent successfully! We will get back to you soon.', 'success');
            setFormData({ name: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
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
                                    <p className="text-white/70 text-sm mt-1">admin@support.com</p>
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6b6b] focus:ring-4 focus:ring-[#ff6b6b]/10 outline-none transition-all placeholder:text-gray-400 text-sm resize-none"
                                placeholder="How can we help you today?"
                            ></textarea>
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
