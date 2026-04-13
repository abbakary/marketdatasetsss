import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { Megaphone, Plus, Eye, MousePointer, DollarSign, TrendingUp, X, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const tt = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1a202c', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

const initialCampaigns = [
  { id: 'c1', name: 'Summer Data Sale', datasetId: 'd1', budget: 500, spent: 320, impressions: 12400, clicks: 840, status: 'active', startDate: '2024-06-01', endDate: '2024-06-30' },
  { id: 'c2', name: 'AI Dataset Promo', datasetId: 'd4', budget: 800, spent: 800, impressions: 18900, clicks: 1240, status: 'completed', startDate: '2024-05-01', endDate: '2024-05-31' },
  { id: 'c3', name: 'Finance Data Boost', datasetId: 'd2', budget: 300, spent: 0, impressions: 0, clicks: 0, status: 'paused', startDate: '2024-07-01', endDate: '2024-07-31' },
];

const adPerformance = [
  { day: 'Mon', impressions: 1800, clicks: 120 },
  { day: 'Tue', impressions: 2200, clicks: 148 },
  { day: 'Wed', impressions: 1950, clicks: 132 },
  { day: 'Thu', impressions: 2600, clicks: 175 },
  { day: 'Fri', impressions: 2100, clicks: 142 },
  { day: 'Sat', impressions: 1400, clicks: 95 },
  { day: 'Sun', impressions: 1350, clicks: 88 },
];

const statusColor = { active: { bg: '#f0fff4', color: '#38a169', border: '1px solid #c6f6d5' }, completed: { bg: '#ebf8ff', color: '#3182ce', border: '1px solid #bee3f8' }, paused: { bg: '#fffaf0', color: '#dd6b20', border: '1px solid #feebc8' } };

export default function AdvertisementsPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [form, setForm] = useState({ name: '', budget: '', startDate: '', endDate: '' });
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleCreate = () => {
    if (!form.name || !form.budget) return;
    setCampaigns([{ id: `c${Date.now()}`, name: form.name, datasetId: selectedDataset, budget: parseFloat(form.budget), spent: 0, impressions: 0, clicks: 0, status: 'active', startDate: form.startDate, endDate: form.endDate }, ...campaigns]);
    showToast('Campaign created successfully');
    setIsCreateOpen(false); setForm({ name: '', budget: '', startDate: '', endDate: '' }); setSelectedDataset('');
  };

  const toggleStatus = (id) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c));
    showToast('Campaign status updated');
  };

  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);

  return (
    <DashboardLayout role="seller">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Advertisements</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Promote your datasets with targeted ad campaigns</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} style={{ padding: '12px 24px', background: '#FF8C00', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}>
            <Plus size={20} /> New Campaign
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
          {[
            { label: 'Total Impressions', value: totalImpressions.toLocaleString(), icon: <Eye size={24} />, color: '#FF8C00', change: 14 },
            { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: <MousePointer size={24} />, color: '#20B2AA', change: 9 },
            { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, icon: <DollarSign size={24} />, color: '#f56565', change: -2 },
            { label: 'CTR', value: totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(1)}%` : '0%', icon: <TrendingUp size={24} />, color: '#805ad5', change: 5 },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 16, background: '#fff', border: '1px solid #edf2f7', padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div>
                <p style={{ fontSize: 13, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#1a202c', margin: '4px 0 0' }}>{s.value}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.change >= 0 ? '#38a169' : '#e53e3e', background: s.change >= 0 ? '#f0fff4' : '#fff5f5', padding: '2px 8px', borderRadius: 6 }}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
                  <span style={{ fontSize: 12, color: '#a0aec0', fontWeight: 500 }}>from last month</span>
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <ChartCard title="Ad Performance (Last 7 Days)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={adPerformance}>
              <XAxis dataKey="day" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
              <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
              <Tooltip contentStyle={tt} />
              <Bar dataKey="impressions" name="Impressions" fill="#FF8C00" radius={[6,6,0,0]} />
              <Bar dataKey="clicks" name="Clicks" fill="#20B2AA" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Campaigns Table */}
        <ChartCard title={`Campaigns (${campaigns.length})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {campaigns.map(c => {
              const ds = allDatasets.find(d => d.id === c.datasetId);
              const sc = statusColor[c.status];
              const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(1) : '0.0';
              return (
                <div key={c.id} style={{ padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #edf2f7', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  {ds && <div style={{ width: 80, height: 60, borderRadius: 12, backgroundImage: `url(${ds.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ color: '#1a202c', fontWeight: 800, margin: '0 0 6px', fontSize: 16 }}>{c.name}</p>
                    <p style={{ color: '#718096', margin: 0, fontSize: 13, fontWeight: 500 }}>{ds?.title || 'No dataset'} · <span style={{ color: '#a0aec0' }}>{c.startDate} to {c.endDate}</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {[['Budget', `$${c.budget}`], ['Spent', `$${c.spent}`], ['Impressions', c.impressions.toLocaleString()], ['Clicks', c.clicks.toLocaleString()], ['CTR', `${ctr}%`]].map(([k, v]) => (
                      <div key={k} style={{ textAlign: 'left' }}>
                        <p style={{ color: '#718096', margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{k}</p>
                        <p style={{ color: '#1a202c', fontWeight: 800, margin: '4px 0 0', fontSize: 14 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: sc.bg, color: sc.color, border: sc.border }}>{c.status}</span>
                    {c.status !== 'completed' && (
                      <button onClick={() => toggleStatus(c.id)} style={{ padding: '8px 16px', background: c.status === 'active' ? '#fffaf0' : '#f0fff4', border: c.status === 'active' ? '1px solid #feebc8' : '1px solid #c6f6d5', borderRadius: 10, color: c.status === 'active' ? '#dd6b20' : '#38a169', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                        {c.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Promoted Datasets */}
        <ChartCard title="Promote a Dataset">
          <p style={{ color: '#718096', fontSize: 15, margin: '0 0 24px', fontWeight: 500 }}>Select a dataset to create a high-impact promotion campaign</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {allDatasets.filter(d => d.status === 'approved').slice(0, 4).map(d => (
              <DatasetCard key={d.id} dataset={d}
                onAction={() => { setSelectedDataset(d.id); setIsCreateOpen(true); }}
                actionLabel="Promote"
                actionStyle={{ background: '#FF8C00', color: '#fff' }}
              />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Create Campaign Modal */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>Create Campaign</h3>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
            </div>
            {[['Campaign Name', 'name', 'text', 'Cloud Analytics Launch'], ['Budget ($)', 'budget', 'number', '500'], ['Start Date', 'startDate', 'date', ''], ['End Date', 'endDate', 'date', '']].map(([l, k, t, p]) => (
              <div key={k} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</label>
                <input type={t} placeholder={p} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                  style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', color: '#1a202c', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dataset to Promote</label>
              <select value={selectedDataset} onChange={e => setSelectedDataset(e.target.value)}
                style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', color: '#1a202c', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none' }}>
                <option value="">Select a dataset</option>
                {allDatasets.filter(d => d.status === 'approved').map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setIsCreateOpen(false)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#4a5568', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Cancel</button>
              <button onClick={handleCreate} style={{ padding: '12px 24px', background: '#FF8C00', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}>Launch Campaign</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#1a202c', borderRadius: 12, padding: '16px 24px', color: '#fff', fontSize: 15, fontWeight: 700, zIndex: 300, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>{toast}</div>}
    </DashboardLayout>
  );
}
