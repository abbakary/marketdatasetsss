import { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import { DatasetCard, allDatasets } from './lib/DatasetCard';
import { buyerStats, mockPurchases } from './lib/mockData';
import { ShoppingCart, Heart, DollarSign, TrendingUp, Download, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const tt = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1a202c', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const Badge = ({ children, style }) => <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, ...style }}>{children}</span>;
const budgetData = [
   { name: 'Used', value: buyerStats.budgetUsed },
   { name: 'Remaining', value: buyerStats.budgetLimit - buyerStats.budgetUsed },
];
const COLORS = ['#FF8C00', '#20B2AA'];

const approvedDatasets = allDatasets.filter(d => d.status === 'approved');

export default function BuyerDashboard() {
   const [wishlist, setWishlist] = useState([]);
   const budgetPct = (buyerStats.budgetUsed / buyerStats.budgetLimit) * 100;

   const statusStyle = s => s === 'completed' ? { background: '#f0fff4', color: '#38a169', border: '1px solid #c6f6d5' } : s === 'pending' ? { background: '#fffaf0', color: '#dd6b20', border: '1px solid #feebc8' } : { background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7' };

   return (
      <DashboardLayout role="buyer">
         <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Welcome Banner */}
            <div style={{ borderRadius: 24, background: '#fff', border: '1px solid #e2e8f0', padding: 40, color: '#1a202c', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#1a202c' }}>Welcome back, <span style={{ color: '#FF8C00' }}>{buyerStats.name || 'Explorer'}!</span></h2>
                  <p style={{ color: '#718096', marginTop: 8, marginBottom: 0, fontSize: 18, fontWeight: 500 }}>Find the perfect data for your next project.</p>
               </div>
               <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'linear-gradient(135deg, #FF8C00 0%, transparent 70%)', opacity: 0.1, borderRadius: '50%' }} />
               <div style={{ position: 'absolute', bottom: -50, left: 100, width: 150, height: 150, background: 'linear-gradient(135deg, #20B2AA 0%, transparent 70%)', opacity: 0.1, borderRadius: '50%' }} />
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
               <StatCard title="Total Purchases" value={buyerStats.totalPurchases} change={8} icon={<ShoppingCart size={24} />} />
               <StatCard title="Wishlist Items" value={buyerStats.wishlistItems} change={15} icon={<Heart size={24} />} />
               <StatCard title="Budget Used" value={`$${buyerStats.budgetUsed.toLocaleString()}`} icon={<DollarSign size={24} />} />
               <StatCard title="Budget Limit" value={`$${buyerStats.budgetLimit.toLocaleString()}`} icon={<TrendingUp size={24} />} />
            </div>

            {/* Recommended Datasets — using DatasetCard */}
            <ChartCard title="Recommended Datasets" action={
               <a href="/dashboard/buyer/recommendations" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>View All</a>
            }>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {approvedDatasets.slice(0, 4).map(d => (
                     <DatasetCard key={d.id} dataset={d}
                        onAction={() => { }}
                        actionLabel="Buy Now"
                        actionStyle={{ background: '#0891b2', color: '#fff' }}
                     />
                  ))}
               </div>
            </ChartCard>

            {/* Budget Tracker + Purchase History */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
               <ChartCard title="Budget Tracker">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                     <div style={{ height: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                               <Pie data={budgetData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                                 {budgetData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                               </Pie>
                               <Tooltip contentStyle={tt} formatter={v => [`$${v.toLocaleString()}`, '']} />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: '#718096', fontWeight: 600 }}>Budget Used</span>
                            <span style={{ color: '#1a202c', fontWeight: 800 }}>${buyerStats.budgetUsed.toLocaleString()}</span>
                         </div>
                         <div style={{ height: 10, background: '#edf2f7', borderRadius: 5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${budgetPct}%`, background: 'linear-gradient(90deg, #FF8C00, #ED8936)', borderRadius: 5 }} />
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: '#718096', fontWeight: 600 }}>Remaining</span>
                            <span style={{ color: '#20B2AA', fontWeight: 800 }}>${(buyerStats.budgetLimit - buyerStats.budgetUsed).toLocaleString()}</span>
                         </div>
                      </div>
                  </div>
               </ChartCard>

               <ChartCard title="Purchase History">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                     <a href="/dashboard/buyer/purchases" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>View All History</a>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                         <thead>
                            <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                               {['Dataset', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
                                  <th key={h} style={{ padding: '16px', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: 13, fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                               ))}
                            </tr>
                         </thead>
                         <tbody>
                            {mockPurchases.slice(0, 5).map(p => (
                               <tr key={p.id} style={{ borderBottom: '1px solid #f7fafc', transition: 'background 0.2s' }}>
                                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#1a202c' }}>{p.datasetTitle}</td>
                                  <td style={{ padding: '16px', fontSize: 13, color: '#718096', fontWeight: 600 }}>{p.date.toLocaleDateString()}</td>
                                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 800, color: '#20B2AA' }}>${p.amount}</td>
                                  <td style={{ padding: '16px' }}><Badge style={{ ...statusStyle(p.status), fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>{p.status}</Badge></td>
                                  <td style={{ padding: '16px', textAlign: 'right' }}>
                                     <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                        <button style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, color: '#4a5568', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}><Download size={14} /> Download</button>
                                        <button style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, color: '#4a5568', cursor: 'pointer' }}><Eye size={16} /></button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                     </table>
                  </div>
               </ChartCard>
            </div>

            {/* Wishlist Preview — using DatasetCard */}
            <ChartCard title="My Wishlist" action={
               <a href="/dashboard/buyer/wishlist" style={{ fontSize: 14, color: '#20B2AA', fontWeight: 700, textDecoration: 'none' }}>View All</a>
            }>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {approvedDatasets.slice(2, 5).map(d => (
                     <DatasetCard key={d.id} dataset={d}
                        onAction={() => { }}
                        actionLabel="Buy Now"
                        actionStyle={{ background: '#0891b2', color: '#fff' }}
                     />
                  ))}
               </div>
            </ChartCard>
         </div>
      </DashboardLayout>
   );
}
