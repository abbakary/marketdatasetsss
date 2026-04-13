import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { DollarSign, TrendingUp, Download, Users, FileText, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const tt = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1a202c', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

const monthlyData = [
  { month: 'Jan', revenue: 12400, users: 1200, datasets: 45 },
  { month: 'Feb', revenue: 15800, users: 1580, datasets: 52 },
  { month: 'Mar', revenue: 19200, users: 1920, datasets: 61 },
  { month: 'Apr', revenue: 17600, users: 1760, datasets: 58 },
  { month: 'May', revenue: 23400, users: 2340, datasets: 72 },
  { month: 'Jun', revenue: 28900, users: 2890, datasets: 85 },
  { month: 'Jul', revenue: 31200, users: 3120, datasets: 91 },
  { month: 'Aug', revenue: 29800, users: 2980, datasets: 88 },
  { month: 'Sep', revenue: 34500, users: 3450, datasets: 97 },
  { month: 'Oct', revenue: 38200, users: 3820, datasets: 105 },
  { month: 'Nov', revenue: 42100, users: 4210, datasets: 118 },
  { month: 'Dec', revenue: 47800, users: 4780, datasets: 132 },
];

const revenueByRole = [
  { name: 'Sellers', value: 68, color: '#FF8C00' },
  { name: 'Subscriptions', value: 22, color: '#20B2AA' },
  { name: 'Ads', value: 10, color: '#ED8936' },
];

const topSellers = [
  { name: 'GreenData Inc.', datasets: 12, revenue: 372255, growth: 18 },
  { name: 'FinTech Solutions', revenue: 534308, datasets: 8, growth: 12 },
  { name: 'AIDataHub', revenue: 287900, datasets: 6, growth: 24 },
  { name: 'BioData Institute', revenue: 271660, datasets: 5, growth: 9 },
  { name: 'SocialMetrics', revenue: 384598, datasets: 9, growth: 15 },
];

export default function AdminRevenueReportsPage() {
  const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0);
  const totalUsers = monthlyData[monthlyData.length - 1].users;

  return (
    <DashboardLayout role="admin">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Revenue Reports</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 15, fontWeight: 500 }}>Platform-wide revenue analytics and financial insights</p>
          </div>
          <button style={{ padding: '10px 22px', background: '#FF8C00', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(255,140,0,0.2)', transition: 'all 0.2s' }}>
            <FileText size={18} /> Export Report
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change={22.4} icon={<DollarSign size={24} />} />
          <StatCard title="Monthly Growth" value="$47,800" change={13.5} icon={<TrendingUp size={24} />} />
          <StatCard title="Total Users" value={totalUsers.toLocaleString()} change={8.9} icon={<Users size={24} />} />
          <StatCard title="Active Datasets" value={allDatasets.filter(d => d.status === 'approved').length} change={6.2} icon={<BarChart3 size={24} />} />
        </div>

        {/* Annual Revenue Chart */}
        <ChartCard title="Annual Revenue Overview">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF8C00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
              <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tt} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#FF8C00" fill="url(#adminRevGrad)" strokeWidth={4} dot={{ fill: '#FF8C00', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Split + Users Growth */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          <ChartCard title="Revenue by Source">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={revenueByRole} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={6} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {revenueByRole.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={tt} formatter={v => [`${v}%`, 'Share']} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="User Growth vs Datasets">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData.slice(-6)}>
                <XAxis dataKey="month" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <Tooltip contentStyle={tt} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                <Bar dataKey="users" name="Users" fill="#FF8C00" radius={[6,6,0,0]} />
                <Bar dataKey="datasets" name="Datasets" fill="#20B2AA" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Top Sellers Table */}
        <ChartCard title="Top Revenue Sellers">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                  {['Seller', 'Datasets', 'Total Revenue', 'Growth'].map(h => (
                    <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topSellers.map((s, i) => (
                  <tr key={s.name} style={{ borderBottom: '1px solid #f7fafc', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF8C00, #ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>{s.name[0]}</div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a202c' }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#4a5568', fontWeight: 600 }}>{s.datasets}</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#20B2AA' }}>${s.revenue.toLocaleString()}</td>
                    <td style={{ padding: '4px 8px', fontSize: 14, color: '#38a169', fontWeight: 700, background: '#f0fff4', borderRadius: 8, display: 'inline-block', marginTop: 16 }}>+{s.growth}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Top Revenue Datasets — DatasetCard grid */}
        <ChartCard title="Top Revenue Datasets">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginBottom: 8 }}>
            {allDatasets.filter(d => d.status === 'approved').slice(0, 4).map(d => (
              <DatasetCard key={d.id} dataset={d} showStatus
                onAction={() => {}}
                actionLabel="View Report"
                actionStyle={{ background: '#FF8C00', color: '#fff' }}
              />
            ))}
          </div>
        </ChartCard>

        {/* Dataset Revenue Table */}
        <ChartCard title="Dataset Revenue Breakdown">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                  {['Dataset', 'Category', 'Price', 'Downloads', 'Revenue', 'Status'].map(h => (
                    <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allDatasets.filter(d => d.status === 'approved').map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundImage: `url(${d.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a202c', margin: 0, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#718096', fontWeight: 500 }}>{d.category}</td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#1a202c', fontWeight: 700 }}>${d.price}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#4a5568', fontWeight: 600 }}>{d.downloadsLabel}</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#20B2AA' }}>${(d.price * parseInt(d.downloadsLabel)).toLocaleString()}</td>
                    <td style={{ padding: '16px' }}><span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: '#f0fff4', color: '#38a169', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active</span></td>
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
