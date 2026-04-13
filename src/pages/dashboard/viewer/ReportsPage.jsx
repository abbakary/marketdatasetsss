import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { FileText, Download, BarChart3, TrendingUp, Eye, Plus, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const tt = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1a202c', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

const savedReports = [
  { id: 'r1', title: 'Climate Data Analysis Q2 2024', datasetId: 'd1', createdAt: new Date('2024-06-15'), type: 'Analysis', size: '2.4 MB' },
  { id: 'r2', title: 'AI Dataset Benchmark Report', datasetId: 'd4', createdAt: new Date('2024-05-20'), type: 'Benchmark', size: '1.8 MB' },
  { id: 'r3', title: 'Financial Trends Summary', datasetId: 'd2', createdAt: new Date('2024-04-10'), type: 'Summary', size: '890 KB' },
];

const viewingTrends = [
  { week: 'W1', views: 12, reports: 2 }, { week: 'W2', views: 19, reports: 3 },
  { week: 'W3', views: 8, reports: 1 }, { week: 'W4', views: 25, reports: 4 },
  { week: 'W5', views: 15, reports: 2 }, { week: 'W6', views: 22, reports: 3 },
];

const categoryInterest = [
  { name: 'Computer Science', value: 35, color: '#FF8C00' },
  { name: 'Finance', value: 25, color: '#20B2AA' },
  { name: 'Healthcare', value: 20, color: '#ED8936' },
  { name: 'Agriculture', value: 12, color: '#4FD1C5' },
  { name: 'Other', value: 8, color: '#cbd5e0' },
];

export default function ReportsPage() {
  const [reports, setReports] = useState(savedReports);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState('');
  const [form, setForm] = useState({ title: '', type: 'Analysis', notes: '' });
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleCreate = () => {
    if (!form.title) return;
    const ds = allDatasets.find(d => d.id === selectedDatasetId);
    setReports([{ id: `r${Date.now()}`, title: form.title, datasetId: selectedDatasetId, dataset: ds?.title || 'Unknown', createdAt: new Date(), type: form.type, size: '1.2 MB' }, ...reports]);
    showToast('Report created successfully');
    setIsCreateOpen(false); setForm({ title: '', type: 'Analysis', notes: '' }); setSelectedDatasetId('');
  };

  const handleDownload = r => showToast(`Downloading ${r.title}...`);
  const handleDelete = id => { setReports(prev => prev.filter(r => r.id !== id)); showToast('Report deleted'); };

  const approvedDatasets = allDatasets.filter(d => d.status === 'approved');

  return (
    <DashboardLayout role="viewer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Reports</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Generate and manage dataset analysis reports</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} style={{ padding: '12px 24px', background: '#20B2AA', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 6px rgba(32,178,170,0.2)', transition: 'all 0.2s' }}>
            <Plus size={18} /> Generate New Report
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {[
            { label: 'Total Reports', value: reports.length, icon: <FileText size={24} />, bg: '#fff' },
            { label: 'Datasets Analyzed', value: approvedDatasets.length, icon: <BarChart3 size={24} />, bg: '#fff' },
            { label: 'Platform Views', value: '240', icon: <Eye size={24} />, bg: '#fff' },
            { label: 'Shared Insights', value: '18', icon: <TrendingUp size={24} />, bg: '#fff' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 16, background: '#fff', border: '1px solid #edf2f7', padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div>
                <p style={{ fontSize: 13, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#1a202c', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{s.value}</p>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: '#f8fafc', color: '#20B2AA' }}>{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          <ChartCard title="Viewing & Report Trends">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={viewingTrends}>
                <XAxis dataKey="week" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <Tooltip contentStyle={tt} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="views" stroke="#FF8C00" strokeWidth={3} name="Views" dot={{ fill: '#FF8C00', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="reports" stroke="#20B2AA" strokeWidth={3} name="Reports" dot={{ fill: '#20B2AA', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Category Interest">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryInterest} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                  {categoryInterest.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tt} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Saved Reports */}
        <ChartCard title={`Saved Reports (${reports.length})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reports.map(r => {
              const ds = allDatasets.find(d => d.id === r.datasetId);
              return (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 16, background: '#fff', border: '1px solid #edf2f7', flexWrap: 'wrap', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  {ds && <div style={{ width: 64, height: 48, borderRadius: 8, backgroundImage: `url(${ds.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, border: '1px solid #f1f5f9' }} />}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ color: '#1a202c', fontWeight: 700, margin: 0, fontSize: 15 }}>{r.title}</p>
                    <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 13, fontWeight: 500 }}>{ds?.title || r.dataset || 'Unknown'} · {r.createdAt.toLocaleDateString()} · {r.size}</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#FF8C0015', color: '#FF8C00', textTransform: 'uppercase' }}>{r.type}</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => handleDownload(r)} style={{ padding: '8px 16px', background: '#20B2AA', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 4px rgba(32,178,170,0.1)' }}>
                      <Download size={14} /> Download
                    </button>
                    <button onClick={() => handleDelete(r.id)} style={{ padding: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#e53e3e', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            {reports.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '32px 0' }}>No reports yet. Create your first report!</p>}
          </div>
        </ChartCard>

        {/* Datasets to Analyze — using DatasetCard */}
        <ChartCard title="Datasets Available for Analysis">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {approvedDatasets.slice(0, 4).map(d => (
              <DatasetCard key={d.id} dataset={d}
                onAction={() => { setSelectedDatasetId(d.id); setForm(f => ({ ...f, title: `${d.title} Analysis Report` })); setIsCreateOpen(true); }}
                actionLabel="Generate Report"
                actionStyle={{ background: '#20B2AA', color: '#fff' }}
              />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Create Report Modal */}
      {isCreateOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>Create New Report</h3>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#4a5568', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Report Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Climate Data Analysis"
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', color: '#1a202c', fontSize: 15, fontWeight: 600, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#4a5568', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Report Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', color: '#1a202c', fontSize: 15, fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                  {['Analysis', 'Summary', 'Benchmark', 'Comparison', 'Trend'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#4a5568', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Dataset</label>
                <select value={selectedDatasetId} onChange={e => setSelectedDatasetId(e.target.value)}
                  style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', color: '#1a202c', fontSize: 15, fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                  <option value="">Select dataset</option>
                  {approvedDatasets.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#4a5568', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Notes & Objectives</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="What insights are you looking for?"
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', color: '#1a202c', fontSize: 15, fontWeight: 600, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setIsCreateOpen(false)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#4a5568', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Cancel</button>
              <button onClick={handleCreate} style={{ padding: '12px 24px', background: '#FF8C00', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 800, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}>Generate Report</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#1a202c', color: '#fff', borderRadius: 12, padding: '16px 24px', fontSize: 14, fontWeight: 600, zIndex: 300, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>{toast}</div>}
    </DashboardLayout>
  );
}
