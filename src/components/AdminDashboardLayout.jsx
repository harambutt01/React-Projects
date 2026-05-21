import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const mockChartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 8000 },
    { name: 'May', revenue: 7000 },
    { name: 'Jun', revenue: 9000 },
];

const KpiCard = ({ title, value, percentage, icon }) => (
    <Card sx={{ minWidth: 275, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography color="text.secondary" gutterBottom variant="subtitle2">
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: '50%', color: 'primary.main' }}>
                    {icon}
                </Box>
            </Box>
            <Typography variant="body2" color={percentage.startsWith('+') ? 'success.main' : 'error.main'} sx={{ mt: 1, fontWeight: 'medium' }}>
                {percentage} <TrendingUpIcon fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.5 }} />
                <Typography component="span" variant="caption" color="text.secondary"> vs last month</Typography>
            </Typography>
        </CardContent>
    </Card>
);

const AdminDashboardLayout = () => {
    // Backend se data lene ke liye state
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0 });

    useEffect(() => {
        fetch('http://localhost:4000/api/admin/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.log("Error fetching stats:", err));
    }, []);

    return (
        <Box sx={{ p: 4, flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Statistics Overview
            </Typography>

            {/* KPI Cards Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue}`}
                        percentage="+15%"
                        icon={<AttachMoneyIcon />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="Total Users"
                        value={stats.totalUsers}
                        percentage="+11%"
                        icon={<PersonIcon />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        percentage="+8%"
                        icon={<ShoppingCartIcon />}
                    />
                </Grid>
            </Grid>

            {/* Revenue Area Chart Section */}
            <Card sx={{ borderRadius: 3, p: 3, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Total Sales Trend
                </Typography>
                <Box height={400}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#26c6da" fill="#80deea" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            </Card>
        </Box>
    );
};

export default AdminDashboardLayout;