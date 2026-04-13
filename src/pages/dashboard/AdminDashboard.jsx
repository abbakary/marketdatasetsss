import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import { DatasetCard, allDatasets } from './lib/DatasetCard';
import { adminStats, userGrowthData, revenueData, categoryData, mockUsers } from './lib/mockData';
import { Users, Database, DollarSign, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useThemeColors } from '../../utils/useThemeColors';
import { useChartColors } from '../../utils/useChartColors';

const COLORS = ['#FF8C00', '#20B2AA', '#f59e0b', '#38b2ac', '#ed8936'];
const Badge = ({ children, style }) => <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, ...style }}>{children}</span>;

export default function AdminDashboard() {
  const themeColors = useThemeColors();
  const chartColors = useChartColors();

  return (
    <DashboardLayout role="admin">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Welcome Banner */}
        <div style={{ borderRadius: 16, backgroundColor: themeColors.card, border: `1px solid ${themeColors.border}`, padding: '32px', boxShadow: themeColors.isDarkMode ? '0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#FF8C00' }} />
          <h2 style={{ fontSize: 32, fontWeight: 800, color: themeColors.text, margin: 0, letterSpacing: '-0.02em' }}>Welcome, <span style={{ color: '#FF8C00' }}>Admin!</span></h2>
          <p style={{ color: themeColors.textMuted, marginTop: 8, marginBottom: 0, fontSize: 16, fontWeight: 500 }}>Here is your platform overview for today</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          <StatCard title="Total Users" value={adminStats.totalUsers} change={12.5} icon={<Users size={24} />} />
          <StatCard title="Total Datasets" value={adminStats.totalDatasets} change={8.3} icon={<Database size={24} />} />
          <StatCard title="Total Revenue" value={`$${adminStats.totalRevenue.toLocaleString()}`} change={15.2} icon={<DollarSign size={24} />} />
          <StatCard title="Active Users" value={adminStats.activeUsers} change={5.8} icon={<TrendingUp size={24} />} />
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          <ChartCard title="User Growth">
            <div style={{ height: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" stroke={chartColors.text} fontSize={12} fontWeight={600} axisLine={false} tickLine={false} />
                  <YAxis stroke={chartColors.text} fontSize={12} fontWeight={600} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartColors.tooltipStyle} />
                  <Bar dataKey="users" fill="#20B2AA" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Revenue Overview">
            <div style={{ height: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" stroke={chartColors.text} fontSize={12} fontWeight={600} axisLine={false} tickLine={false} />
                  <YAxis stroke={chartColors.text} fontSize={12} fontWeight={600} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartColors.tooltipStyle} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#FF8C00" fill="url(#revGrad)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Stats + Pie */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <ChartCard title="Recent Statistics">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'New Registrations', value: 234, change: '+12%', color: '#FF8C00' },
                { label: 'Active Sellers', value: 89, change: '+8%', color: '#20B2AA' },
                { label: 'Pending Reviews', value: 45, change: '-3%', color: '#f59e0b' },
                { label: 'Support Tickets', value: 12, change: '-15%', color: '#e53e3e' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${themeColors.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 4, background: s.color }} />
                    <span style={{ color: themeColors.textMuted, fontSize: 14, fontWeight: 600 }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ color: themeColors.text, fontWeight: 700 }}>{s.value}</span>
                    <span style={{ color: s.change.startsWith('+') ? '#10B981' : '#EF4444', fontSize: 13, fontWeight: 700, background: s.change.startsWith('+') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: 6 }}>{s.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Dataset Stats">
            <div style={{ height: 192 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={chartColors.tooltipStyle} />
                  <Legend formatter={v => <span style={{ color: themeColors.textMuted, fontSize: 12, fontWeight: 600 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Recent Datasets using DatasetCard */}
        <ChartCard title="Recent Datasets" action={
          <a href="/dashboard/admin/datasets" style={{ fontSize: 14, color: '#60a5fa', textDecoration: 'none' }}>View All</a>
        }>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {allDatasets.slice(0, 4).map(d => (
              <DatasetCard key={d.id} dataset={d} showStatus
                onAction={() => { }}
                actionLabel="Manage"
                actionStyle={{ background: '#2563eb', color: '#fff' }}
              />
            ))}
          </div>
        </ChartCard>

        {/* User Management Preview */}
        <ChartCard title="User Management" action={
          <a href="/dashboard/admin/users" style={{ fontSize: 14, color: '#3B82F6', textDecoration: 'none' }}>View All</a>
        }>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                  {['User', 'Role', 'Status', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: themeColors.textMuted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockUsers.slice(0, 5).map(user => (
                  <tr key={user.id} style={{ borderBottom: `1px solid ${themeColors.border}` }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF8C00, #ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{user.avatar}</div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: themeColors.text, margin: 0 }}>{user.name}</p>
                          <p style={{ fontSize: 13, color: themeColors.textMuted, margin: 0 }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}><Badge style={{ background: themeColors.bgSecondary, color: themeColors.textMuted, textTransform: 'capitalize' }}>{user.role}</Badge></td>
                    <td style={{ padding: '16px' }}>
                      <Badge style={{ background: user.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : user.status === 'inactive' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: user.status === 'active' ? '#10B981' : user.status === 'inactive' ? '#F59E0B' : '#EF4444' }}>{user.status}</Badge>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: themeColors.textMuted, fontWeight: 500 }}>{user.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
