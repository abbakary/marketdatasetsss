import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { DollarSign, TrendingUp, Eye, Download, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const tt = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1a202c', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

const salesData = [
  { month: 'Jan', sales: 2400, views: 8200, revenue: 4800 },
  { month: 'Feb', sales: 3200, views: 10400, revenue: 6400 },
  { month: 'Mar', sales: 2800, views: 9100, revenue: 5600 },
  { month: 'Apr', sales: 4100, views: 13200, revenue: 8200 },
  { month: 'May', sales: 3600, views: 11800, revenue: 7200 },
  { month: 'Jun', sales: 4800, views: 15600, revenue: 9600 },
];

const categoryBreakdown = [
  { name: 'Computer Science', sales: 1240, color: '#FF8C00' },
  { name: 'Finance', sales: 890, color: '#20B2AA' },
  { name: 'Healthcare', sales: 560, color: '#ED8936' },
  { name: 'Agriculture', sales: 340, color: '#4FD1C5' },
  { name: 'Other', sales: 270, color: '#CBD5E0' },
];

const myDatasets = allDatasets.filter(d => d.status === 'approved').slice(0, 5).map((d, i) => ({
  ...d,
  salesCount: [1250, 892, 2100, 560, 340][i],
  viewCount: [3200, 2100, 4500, 1200, 800][i],
  conversionRate: [39.1, 42.5, 46.7, 46.7, 42.5][i],
  revenue: [372255, 534308, 1887900, 195440, 271660][i],
}));

export default function SalesAnalyticsPage() {
  const totalRevenue = myDatasets.reduce((s, d) => s + d.revenue, 0);
  const totalSales = myDatasets.reduce((s, d) => s + d.salesCount, 0);
  const totalViews = myDatasets.reduce((s, d) => s + d.viewCount, 0);

  return (
    <DashboardLayout role="seller">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Sales Analytics</h2>
          <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Track your dataset sales performance and revenue</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change={15.2} icon={<DollarSign size={24} />} />
          <StatCard title="Total Sales" value={totalSales.toLocaleString()} change={12.8} icon={<TrendingUp size={24} />} />
          <StatCard title="Total Views" value={totalViews.toLocaleString()} change={20.1} icon={<Eye size={24} />} />
          <StatCard title="Avg Conversion" value="43.5%" change={3.2} icon={<BarChart3 size={24} />} />
        </div>

        {/* Sales Trend */}
        <ChartCard title="Sales & Revenue Trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF8C00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20B2AA" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#20B2AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
              <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
              <Tooltip contentStyle={tt} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
              <Area type="monotone" dataKey="sales" stroke="#FF8C00" fill="url(#salesGrad)" strokeWidth={4} dot={{ fill: '#FF8C00', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} name="Sales" />
              <Area type="monotone" dataKey="revenue" stroke="#20B2AA" fill="url(#revGrad2)" strokeWidth={4} dot={{ fill: '#20B2AA', strokeWidth: 0, r: 4 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} name="Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category + Views */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          <ChartCard title="Sales by Category">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="sales" label={({ name, percent }) => `${(percent*100).toFixed(0)}%`} labelLine={false} stroke="none">
                  {categoryBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tt} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Views vs Sales">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <Tooltip contentStyle={tt} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                <Bar dataKey="views" name="Views" fill="#FF8C00" radius={[6,6,0,0]} />
                <Bar dataKey="sales" name="Sales" fill="#20B2AA" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Top Performing Datasets — using DatasetCard */}
        <ChartCard title="Top Performing Datasets">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {myDatasets.slice(0, 4).map(d => (
              <DatasetCard key={d.id} dataset={d} showStatus
                onAction={() => {}}
                actionLabel="View Analytics"
                 actionStyle={{ background: '#FF8C00', color: '#fff' }}
              />
            ))}
          </div>
        </ChartCard>

        {/* Dataset Performance Table */}
        <ChartCard title="Dataset Performance">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                  {['Dataset', 'Price', 'Views', 'Sales', 'Conversion', 'Revenue'].map(h => (
                    <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myDatasets.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f7fafc', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, backgroundImage: `url(${d.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a202c', margin: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#1a202c', fontWeight: 700 }}>${d.price}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#718096', fontWeight: 600 }}>{d.viewCount.toLocaleString()}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#718096', fontWeight: 600 }}>{d.salesCount.toLocaleString()}</td>
                    <td style={{ fontSize: 13, color: '#38a169', fontWeight: 700, background: '#f0fff4', borderRadius: 8, padding: '4px 8px', display: 'inline-block', marginTop: 16 }}>{d.conversionRate}%</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#20B2AA' }}>${d.revenue.toLocaleString()}</td>
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
