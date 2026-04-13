import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { DollarSign, TrendingUp, BarChart3, Download } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const tt = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1a202c', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

const monthlyRevenue = [
  { month: 'Jan', revenue: 12400, datasets: 45, downloads: 1200 },
  { month: 'Feb', revenue: 15800, datasets: 52, downloads: 1580 },
  { month: 'Mar', revenue: 19200, datasets: 61, downloads: 1920 },
  { month: 'Apr', revenue: 17600, datasets: 58, downloads: 1760 },
  { month: 'May', revenue: 23400, datasets: 72, downloads: 2340 },
  { month: 'Jun', revenue: 28900, datasets: 85, downloads: 2890 },
];

const categoryRevenue = [
  { name: 'Computer Science', revenue: 45200, color: '#FF8C00' },
  { name: 'Finance', revenue: 38700, color: '#20B2AA' },
  { name: 'Healthcare', revenue: 29400, color: '#ED8936' },
  { name: 'Agriculture', revenue: 18900, color: '#4FD1C5' },
  { name: 'ICT', revenue: 15600, color: '#F6AD55' },
  { name: 'Other', revenue: 12300, color: '#CBD5E0' },
];

const topDatasets = allDatasets.filter(d => d.status === 'approved').slice(0, 5).map((d, i) => ({
  ...d, revenue: [384598, 372255, 304722, 271660, 232227][i], revenueGrowth: [12, 8, 15, -3, 6][i],
}));

export default function RevenueAnalyticsPage() {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalDownloads = monthlyRevenue.reduce((s, m) => s + m.downloads, 0);
  const avgRevenue = Math.round(totalRevenue / monthlyRevenue.length);

  return (
    <DashboardLayout role="editor">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Revenue Analytics</h2>
          <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Platform revenue insights and dataset performance</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change={18.5} icon={<DollarSign size={24} />} />
          <StatCard title="Avg Monthly" value={`$${avgRevenue.toLocaleString()}`} change={12.3} icon={<TrendingUp size={24} />} />
          <StatCard title="Total Downloads" value={totalDownloads.toLocaleString()} change={9.7} icon={<Download size={24} />} />
          <StatCard title="Active Datasets" value={allDatasets.filter(d => d.status === 'approved').length} change={5.2} icon={<BarChart3 size={24} />} />
        </div>

        {/* Revenue Trend */}
        <ChartCard title="Monthly Revenue Trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF8C00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
              <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tt} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#FF8C00" fill="url(#revGrad)" strokeWidth={4} dot={{ fill: '#FF8C00', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Revenue + Downloads */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          <ChartCard title="Revenue by Category">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryRevenue} layout="vertical">
                <XAxis type="number" stroke="#718096" fontSize={11} axisLine={false} tickLine={false} fontWeight={600} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" stroke="#718096" fontSize={11} axisLine={false} tickLine={false} fontWeight={600} width={100} />
                <Tooltip contentStyle={tt} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                  {categoryRevenue.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Downloads vs Datasets">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenue}>
                <XAxis dataKey="month" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <Tooltip contentStyle={tt} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                <Line type="monotone" dataKey="downloads" stroke="#20B2AA" strokeWidth={4} dot={{ fill: '#20B2AA', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} name="Downloads" />
                <Line type="monotone" dataKey="datasets" stroke="#FF8C00" strokeWidth={4} dot={{ fill: '#FF8C00', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} name="Datasets" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Top Revenue Datasets — DatasetCard grid */}
        <ChartCard title="Top Revenue Generating Datasets">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginBottom: 20 }}>
            {topDatasets.slice(0, 4).map(d => (
              <DatasetCard key={d.id} dataset={d} showStatus
                onAction={() => {}}
                actionLabel="View Revenue"
                actionStyle={{ background: '#FF8C00', color: '#fff' }}
              />
            ))}
          </div>
        </ChartCard>

        {/* Top Revenue Table */}
        <ChartCard title="Revenue Breakdown Table">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                  {['Dataset', 'Category', 'Price', 'Downloads', 'Revenue', 'Growth'].map(h => (
                    <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topDatasets.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f7fafc', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundImage: `url(${d.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a202c', margin: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#718096', fontWeight: 500 }}>{d.category}</td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#1a202c', fontWeight: 700 }}>${d.price}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#4a5568', fontWeight: 600 }}>{d.downloadsLabel}</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#20B2AA' }}>${d.revenue.toLocaleString()}</td>
                    <td style={{ fontSize: 13, color: d.revenueGrowth >= 0 ? '#38a169' : '#e53e3e', fontWeight: 700, background: d.revenueGrowth >= 0 ? '#f0fff4' : '#fff5f5', borderRadius: 8, padding: '4px 8px', display: 'inline-block', marginTop: 16 }}>
                      {d.revenueGrowth >= 0 ? '+' : ''}{d.revenueGrowth}%
                    </td>
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
