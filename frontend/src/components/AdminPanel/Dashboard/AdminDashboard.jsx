import React, { useMemo, useState } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, ShoppingCart, Clock,
    CreditCard, ArrowUpRight, ArrowDownRight,
    Trophy
} from 'lucide-react';

const AdminDashboard = ({ data, loading, onNavigate }) => {
    const { users, orders, coupons, totalIncome } = data;
    const [timeRange, setTimeRange] = useState('7d');
    const [selectedMonthOffset, setSelectedMonthOffset] = useState(0); // 0 = Current Month, 1 = Previous Month, etc.

    // --- Statistics Calculations ---
    const stats = useMemo(() => {
        const pendingOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
        const totalRevenue = totalIncome;
        const totalOrders = orders.length;
        const totalCustomers = users.length;

        return [
            {
                title: 'Total Revenue',
                value: `BDT ${totalRevenue.toLocaleString()}`,
                icon: CreditCard,
                trend: '+12.5%',
                isPositive: true,
                color: 'bg-emerald-500'
            },
            {
                title: 'Total Orders',
                value: totalOrders,
                icon: ShoppingCart,
                trend: '+8.2%',
                isPositive: true,
                color: 'bg-indigo-500'
            },
            {
                title: 'Total Customers',
                value: totalCustomers,
                icon: Users,
                trend: '-2.4%',
                isPositive: false,
                color: 'bg-amber-500'
            },
            {
                title: 'Pending Delivery',
                value: pendingOrders,
                icon: Clock,
                trend: 'Active',
                isPositive: true,
                color: 'bg-rose-500'
            },
        ];
    }, [orders, users, totalIncome]);

    // --- Chart Data Preparation ---
    const salesData = useMemo(() => {
        const now = new Date();
        let startDate = new Date();
        let groupBy = 'day'; // 'day' or 'month'

        switch (timeRange) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                groupBy = 'day';
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                groupBy = 'day';
                break;
            case '3m':
                startDate.setMonth(now.getMonth() - 3);
                groupBy = 'month';
                break;
            case '6m':
                startDate.setMonth(now.getMonth() - 6);
                groupBy = 'month';
                break;
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1);
                groupBy = 'year';
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }

        const filteredOrders = orders.filter(order => new Date(order.createdAt) >= startDate);
        const grouped = {};

        filteredOrders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            let key;
            if (groupBy === 'day') {
                key = orderDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            } else {
                key = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }

            if (!grouped[key]) {
                grouped[key] = { name: key, income: 0, orders: 0, dateObj: orderDate };
            }
            grouped[key].income += order.totalAmount;
            grouped[key].orders += 1;
        });

        // Ensure chronological order
        return Object.values(grouped).sort((a, b) => a.dateObj - b.dateObj);
    }, [orders, timeRange]);

    const topProducts = useMemo(() => {
        const productCounts = {};
        orders.forEach(order => {
            order.orderSummary.forEach(item => {
                if (!productCounts[item.productName]) {
                    productCounts[item.productName] = {
                        name: item.productName,
                        sales: 0,
                        revenue: 0
                    };
                }
                productCounts[item.productName].sales += item.quantity;
            });
        });
        return Object.values(productCounts)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);
    }, [orders]);

    const topCustomers = useMemo(() => {
        const customerStats = {};

        orders.forEach(order => {
            // ONLY consider Completed orders
            if (order.status !== 'Completed') return;

            let userId = 'unknown';
            let userName = 'Unknown';
            let userEmail = '';

            // Robust user data extraction
            if (order.user && typeof order.user === 'object') {
                // Case 1: Populated user object
                userId = order.user._id || order.user.id || 'unknown';
                userName = order.user.name || 'Unknown';
                userEmail = order.user.email || '';
            } else if (order.userId) {
                // Case 2: Explicit userId field (String) as per schema
                userId = order.userId;
            } else if (order.user) {
                // Case 3: user field as ID string
                userId = order.user;
            }

            // Look up user details if we have an ID but no name
            if (userId !== 'unknown' && userName === 'Unknown') {
                const foundUser = users.find(u => u._id === userId || u.id === userId);
                if (foundUser) {
                    userName = foundUser.name;
                    userEmail = foundUser.email;
                }
            }

            if (userId !== 'unknown') {
                if (!customerStats[userId]) {
                    customerStats[userId] = {
                        id: userId,
                        name: userName,
                        email: userEmail,
                        totalSpent: 0,
                        ordersCount: 0
                    };
                }
                customerStats[userId].totalSpent += order.totalAmount;
                customerStats[userId].ordersCount += 1;
            }
        });

        const result = Object.values(customerStats)
            .sort((a, b) => b.ordersCount - a.ordersCount)
            .slice(0, 3);

        return result;
    }, [orders, users]);

    // --- Helper for Month Options ---
    const last6Months = useMemo(() => {
        const months = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push({
                offset: i,
                label: i === 0 ? 'Current Month' : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            });
        }
        return months;
    }, []);

    // Pie Chart Data
    const orderStatusData = useMemo(() => {
        const now = new Date();
        const targetMonth = new Date(now.getFullYear(), now.getMonth() - selectedMonthOffset, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - selectedMonthOffset + 1, 1);

        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= targetMonth && orderDate < nextMonth;
        });

        const statusCounts = filteredOrders.reduce((acc, order) => {
            const status = order.status || 'Pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const finalData = Object.keys(statusCounts).map(status => ({
            name: status,
            value: statusCounts[status]
        }));

        return finalData.length > 0 ? finalData : [{ name: 'No Data', value: 1 }];
    }, [orders, selectedMonthOffset]);

    const STATUS_COLORS = {
        'Completed': '#10b981', // emerald-500
        'Pending': '#f59e0b',   // amber-500
        'Cancelled': '#f43f5e', // rose-500
        'Confirmed': '#6366f1', // indigo-500
        'No Data': '#e2e8f0'    // slate-200
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div className={`p-3 rounded-xl w-fit ${stat.color} bg-opacity-10`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                    <h4 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h4>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Center Row: Analytics & Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Analytics Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Sales Analytics</h3>
                            <p className="text-sm text-gray-500">Income over time</p>
                        </div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-gray-50 border-none text-sm font-medium text-gray-500 rounded-lg px-3 py-2 cursor-pointer outline-none hover:bg-gray-100 transition-colors"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="3m">Last 3 Months</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last Year</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
                        <select
                            value={selectedMonthOffset}
                            onChange={(e) => setSelectedMonthOffset(Number(e.target.value))}
                            className="bg-gray-50 border-none text-xs font-medium text-gray-500 rounded-lg px-2 py-1.5 cursor-pointer outline-none hover:bg-gray-100 transition-colors"
                        >
                            {last6Months.map((m) => (
                                <option key={m.offset} value={m.offset}>{m.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Left Side: Stats */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <span className="text-4xl font-bold text-gray-900 block">
                                    {orderStatusData[0]?.name === 'No Data' ? 0 : orderStatusData.reduce((acc, curr) => acc + curr.value, 0)}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Orders</span>
                            </div>

                            <div className="space-y-3 pt-2">
                                {[
                                    { label: 'Completed', color: 'bg-emerald-500', value: orderStatusData.find(d => d.name === 'Completed')?.value || 0 },
                                    { label: 'Pending', color: 'bg-amber-500', value: (orderStatusData.find(d => d.name === 'Pending')?.value || 0) },
                                    { label: 'Cancelled', color: 'bg-rose-500', value: orderStatusData.find(d => d.name === 'Cancelled')?.value || 0 }
                                ].map((stat) => (
                                    <div key={stat.label} className="flex justify-between items-center text-sm">
                                        <span className="flex items-center gap-2 text-gray-600">
                                            <span className={`w-3 h-3 rounded-full ${stat.color}`}></span> {stat.label}
                                        </span>
                                        <span className="font-bold text-gray-900">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Chart */}
                        <div className="h-[200px] w-[200px] relative flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={STATUS_COLORS[entry.name] || '#94a3b8'}
                                                strokeWidth={0}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                            border: 'none',
                                            padding: '8px 12px'
                                        }}
                                        itemStyle={{
                                            color: '#1f2937',
                                            fontSize: '12px',
                                            fontWeight: 600
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Products & (Coupons + Top Customers) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Selling Products */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
                        <button
                            onClick={() => onNavigate('manageProducts')}
                            className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                        >
                            See All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm">
                                        📦
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                        <p className="text-xs text-gray-500">{product.sales} sales</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-gray-900">#{idx + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column Wrapper with Space-y */}
                <div className="space-y-6">
                    {/* Active Coupons */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Active Coupons</h3>
                            <button
                                className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                                onClick={() => onNavigate('coupons')}
                            >
                                Manage
                            </button>
                        </div>
                        <div className="space-y-4">
                            {coupons.slice(0, 2).map((coupon, idx) => (
                                <div key={idx} className="relative overflow-hidden rounded-xl border border-gray-200 p-4 group hover:border-indigo-500/30 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                    <div className="flex justify-between items-center pl-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono font-bold text-gray-900 text-lg tracking-wide">{coupon.code}</span>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase">
                                                    Active
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold text-gray-900">৳{coupon.discount}</span>
                                            <span className="text-[10px] text-gray-400 uppercase">Discount</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {coupons.length === 0 && (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No active coupons found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Customers (Completed Orders) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Top Customers (Completed)</h3>
                            <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {topCustomers.map((customer, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${idx === 0 ? 'bg-amber-100 text-amber-600' :
                                            idx === 1 ? 'bg-gray-100 text-gray-600' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>
                                            {idx === 0 ? <Trophy className="w-5 h-5" /> : customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{customer.name}</h4>
                                            <p className="text-xs text-gray-500">{customer.ordersCount} orders</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-indigo-600 text-sm">৳{customer.totalSpent.toLocaleString()}</span>
                                        <span className="text-[10px] text-gray-400 uppercase">Spent</span>
                                    </div>
                                </div>
                            ))}
                            {topCustomers.length === 0 && (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    No customer data.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
