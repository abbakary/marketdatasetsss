import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import {
  Database, Search, Filter, Eye, Edit, Trash2, Download,
  CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, DollarSign, Plus, Upload,
  BarChart3, RefreshCw, X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';

const initialDatasets = [
  { id: 1, name: 'Global Climate Data 2024', category: 'Environmental', seller: 'GreenData Inc.', sellerAvatar: 'GD', status: 'approved', price: 299, downloads: 1245, revenue: 372255, rating: 4.8, size: '2.5 GB', format: 'CSV, JSON', createdAt: '2024-01-15', lastUpdated: '2024-03-20' },
  { id: 2, name: 'Financial Markets Analysis', category: 'Finance', seller: 'FinTech Solutions', sellerAvatar: 'FS', status: 'approved', price: 599, downloads: 892, revenue: 534308, rating: 4.9, size: '1.8 GB', format: 'CSV, Excel', createdAt: '2024-02-01', lastUpdated: '2024-03-18' },
  { id: 3, name: 'Healthcare Patient Records', category: 'Healthcare', seller: 'MedData Corp', sellerAvatar: 'MC', status: 'pending', price: 899, downloads: 0, revenue: 0, rating: 0, size: '5.2 GB', format: 'JSON, XML', createdAt: '2024-03-25', lastUpdated: '2024-03-25' },
  { id: 4, name: 'E-commerce Trends 2024', category: 'Retail', seller: 'RetailInsights', sellerAvatar: 'RI', status: 'approved', price: 449, downloads: 567, revenue: 254583, rating: 4.6, size: '800 MB', format: 'CSV', createdAt: '2024-01-20', lastUpdated: '2024-03-15' },
  { id: 5, name: 'AI Training Dataset - Images', category: 'Technology', seller: 'AIDataHub', sellerAvatar: 'AH', status: 'rejected', price: 1299, downloads: 0, revenue: 0, rating: 0, size: '15 GB', format: 'Images, JSON', createdAt: '2024-03-10', lastUpdated: '2024-03-10' },
  { id: 6, name: 'Social Media Analytics', category: 'Marketing', seller: 'SocialMetrics', sellerAvatar: 'SM', status: 'approved', price: 349, downloads: 1102, revenue: 384598, rating: 4.7, size: '1.2 GB', format: 'CSV, JSON', createdAt: '2024-02-15', lastUpdated: '2024-03-22' },
  { id: 7, name: 'Real Estate Market Data', category: 'Real Estate', seller: 'PropData Inc.', sellerAvatar: 'PD', status: 'pending', price: 799, downloads: 0, revenue: 0, rating: 0, size: '3.1 GB', format: 'CSV, Excel', createdAt: '2024-03-28', lastUpdated: '2024-03-28' },
  { id: 8, name: 'Transportation Logistics', category: 'Logistics', seller: 'LogiData', sellerAvatar: 'LD', status: 'approved', price: 549, downloads: 423, revenue: 232227, rating: 4.5, size: '2.0 GB', format: 'CSV, JSON', createdAt: '2024-01-25', lastUpdated: '2024-03-19' },
];

const catData = [
  { name: 'Technology', value: 320, color: '#FF8C00' }, { name: 'Finance', value: 280, color: '#20B2AA' },
  { name: 'Healthcare', value: 220, color: '#ED8936' }, { name: 'Marketing', value: 180, color: '#4FD1C5' },
  { name: 'Retail', value: 150, color: '#F6AD55' }, { name: 'Other', value: 95, color: '#CBD5E0' },
];
const monthlyData = [
  { month: 'Jan', uploads: 45, approved: 38, rejected: 7 }, { month: 'Feb', uploads: 52, approved: 44, rejected: 8 },
  { month: 'Mar', uploads: 61, approved: 52, rejected: 9 }, { month: 'Apr', uploads: 58, approved: 49, rejected: 9 },
  { month: 'May', uploads: 72, approved: 63, rejected: 9 }, { month: 'Jun', uploads: 85, approved: 76, rejected: 9 },
];
const downloadTrends = [
  { date: 'Week 1', downloads: 2450 }, { date: 'Week 2', downloads: 3120 },
  { date: 'Week 3', downloads: 2890 }, { date: 'Week 4', downloads: 3540 },
];

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1a202c', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };

const Badge = ({ children, style }) => <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, ...style }}>{children}</span>;
const Input = ({ style, ...props }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', ...style }} {...props} />;
const Sel = ({ value, onChange, children, style }) => <select value={value} onChange={e => onChange(e.target.value)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', ...style }}>{children}</select>;
const Btn = ({ children, onClick, style, variant = 'primary' }) => {
  const v = { 
    primary: { background: '#FF8C00', color: '#fff', boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }, 
    ghost: { background: 'transparent', color: '#718096' }, 
    danger: { background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7' }, 
    outline: { background: '#fff', border: '1px solid #e2e8f0', color: '#4a5568' } 
  };
  return <button onClick={onClick} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', ...v[variant], ...style }}>{children}</button>;
};

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 640, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ color: '#1a202c', margin: 0, fontSize: 22, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
        </div>
        {children}
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>{footer}</div>}
      </div>
    </div>
  );
};

const getStatusBadge = (status) => {
  if (status === 'approved') return <Badge style={{ background: '#f0fff4', color: '#38a169', border: '1px solid #c6f6d5' }}><CheckCircle size={14} /> Approved</Badge>;
  if (status === 'pending') return <Badge style={{ background: '#fffaf0', color: '#dd6b20', border: '1px solid #feebc8' }}><Clock size={14} /> Pending</Badge>;
  return <Badge style={{ background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7' }}><XCircle size={14} /> Rejected</Badge>;
};

export default function AdminDatasetsPage() {
  const [datasets, setDatasets] = useState(initialDatasets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = datasets.filter(d => {
    const ms = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const mst = statusFilter === 'all' || d.status === statusFilter;
    const mc = categoryFilter === 'all' || d.category.toLowerCase() === categoryFilter.toLowerCase();
    return ms && mst && mc;
  });

  const totalDatasets = datasets.length;
  const approvedCount = datasets.filter(d => d.status === 'approved').length;
  const pendingCount = datasets.filter(d => d.status === 'pending').length;
  const totalRevenue = datasets.reduce((s, d) => s + d.revenue, 0);
  const totalDownloads = datasets.reduce((s, d) => s + d.downloads, 0);

  const handleStatusChange = (id, newStatus) => setDatasets(datasets.map(d => d.id === id ? { ...d, status: newStatus } : d));
  const handleDelete = (id) => { setDatasets(datasets.filter(d => d.id !== id)); setIsDeleteOpen(false); };

  const statCards = [
    { label: 'Total Datasets', value: totalDatasets, icon: <Database size={24} />, bg: '#fff', color: '#FF8C00' },
    { label: 'Approved', value: approvedCount, icon: <CheckCircle size={24} />, bg: '#fff', color: '#38A169' },
    { label: 'Pending Review', value: pendingCount, icon: <Clock size={24} />, bg: '#fff', color: '#DD6B20' },
    { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: <Download size={24} />, bg: '#fff', color: '#20B2AA' },
    { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: <DollarSign size={24} />, bg: '#fff', color: '#20B2AA' },
  ];

  return (
    <DashboardLayout role="admin">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Datasets Management</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 15, fontWeight: 500 }}>Manage and monitor all datasets on the platform</p>
          </div>
          <Btn onClick={() => setIsAddOpen(true)}><Plus size={20} /> Add Dataset</Btn>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #edf2f7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 13, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: s.color || '#1a202c', margin: '8px 0 0', letterSpacing: '-0.02em' }}>{s.value}</p>
                </div>
                <div style={{ padding: 12, borderRadius: 12, background: `${s.color}15`, color: s.color }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          <ChartCard title="Upload & Approval Trends">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                <Bar dataKey="uploads" name="Total Uploads" fill="#FF8C00" radius={[4,4,0,0]} />
                <Bar dataKey="approved" name="Approved" fill="#20B2AA" radius={[4,4,0,0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#e53e3e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Distribution by Category">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                  {catData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Download Trends */}
        <ChartCard title="Weekly Download Volume" action={
          <Btn variant="ghost" style={{ fontSize: 13, padding: '4px 12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}><RefreshCw size={14} /> Update Charts</Btn>
        }>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={downloadTrends}>
              <XAxis dataKey="date" stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
              <YAxis stroke="#718096" fontSize={12} axisLine={false} tickLine={false} fontWeight={600} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="downloads" stroke="#20B2AA" strokeWidth={4} dot={{ fill: '#20B2AA', r: 6, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Dataset Cards Grid View */}
        <ChartCard title="Dataset Cards Overview" action={
          <span style={{ fontSize: 13, color: '#718096', fontWeight: 600 }}>Showing all {filtered.length} datasets</span>
        }>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginBottom: 8 }}>
            {filtered.slice(0, 8).map(d => {
              const ds = allDatasets.find(x => x.name === d.name || x.title === d.name);
              const cardData = ds || {
                id: String(d.id), title: d.name, author: d.seller, category: d.category,
                usability: String(d.rating || '9.0'), updated: `Updated ${d.lastUpdated}`,
                files: `${d.format}`, size: d.size, downloads: `${d.downloads.toLocaleString()} downloads`,
                votes: Math.floor(d.downloads / 20), image: `https://images.unsplash.com/photo-1460925895917-adf4e5d1baaa?auto=format&fit=crop&w=900&q=80`,
                price: String(d.price), status: d.status, description: `${d.category} dataset by ${d.seller}`,
              };
              return (
                <DatasetCard key={d.id} dataset={cardData} showStatus
                  onAction={() => { setSelected(d); setIsViewOpen(true); }}
                  actionLabel="Manage"
                  actionStyle={{ background: '#FF8C00', color: '#fff' }}
                />
              );
            })}
          </div>
        </ChartCard>

        {/* Table */}
        <ChartCard title="All Datasets" action={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
              <Input placeholder="Search datasets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: 40, width: 240 }} />
            </div>
            <Sel value={statusFilter} onChange={setStatusFilter} style={{ minWidth: 130 }}>
              <option value="all">All Status</option>
              {['approved','pending','rejected'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </Sel>
            <Sel value={categoryFilter} onChange={setCategoryFilter} style={{ minWidth: 150 }}>
              <option value="all">All Categories</option>
              {['Technology','Finance','Healthcare','Marketing','Retail','Environmental','Logistics','Real Estate'].map(c => <option key={c} value={c}>{c}</option>)}
            </Sel>
          </div>
        }>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                  {['Dataset','Category','Seller','Status','Price','Downloads','Revenue','Actions'].map(h => (
                    <th key={h} style={{ padding: '16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f7fafc', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ padding: 10, background: '#FF8C0015', borderRadius: 12 }}><Database size={18} color="#FF8C00" /></div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a202c', margin: 0 }}>{d.name}</p>
                          <p style={{ fontSize: 13, color: '#718096', margin: '2px 0 0' }}>{d.size} | {d.format}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}><Badge style={{ background: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0' }}>{d.category}</Badge></td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#20B2AA20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#20B2AA' }}>{d.sellerAvatar}</div>
                        <span style={{ fontSize: 14, color: '#4a5568', fontWeight: 600 }}>{d.seller}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{getStatusBadge(d.status)}</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#1a202c' }}>${d.price}</td>
                    <td style={{ padding: '16px', fontSize: 14, color: '#4a5568', fontWeight: 500 }}>{d.downloads.toLocaleString()}</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#20B2AA' }}>${d.revenue.toLocaleString()}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn variant="ghost" onClick={() => { setSelected(d); setIsViewOpen(true); }} style={{ padding: '8px', background: '#f7fafc', borderRadius: 8 }}><Eye size={18} /></Btn>
                        <Btn variant="ghost" onClick={() => { setSelected(d); setIsEditOpen(true); }} style={{ padding: '8px', background: '#f7fafc', borderRadius: 8 }}><Edit size={18} /></Btn>
                        {d.status === 'pending' && <>
                          <Btn variant="ghost" onClick={() => handleStatusChange(d.id, 'approved')} style={{ padding: '8px', background: '#f0fff4', color: '#38a169', borderRadius: 8 }}><CheckCircle size={18} /></Btn>
                          <Btn variant="ghost" onClick={() => handleStatusChange(d.id, 'rejected')} style={{ padding: '8px', background: '#fff5f5', color: '#e53e3e', borderRadius: 8 }}><XCircle size={18} /></Btn>
                        </>}
                        <Btn variant="ghost" onClick={() => { setSelected(d); setIsDeleteOpen(true); }} style={{ padding: '8px', background: '#fff5f5', color: '#e53e3e', borderRadius: 8 }}><Trash2 size={18} /></Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* View Modal */}
      <Modal open={isViewOpen} onClose={() => setIsViewOpen(false)} title="Dataset Details"
        footer={[<Btn key="c" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Btn>, <Btn key="e" onClick={() => { setIsViewOpen(false); setIsEditOpen(true); }}><Edit size={14} /> Edit</Btn>]}>
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ padding: 16, background: '#FF8C0015', borderRadius: 12 }}><Database size={40} color="#FF8C00" /></div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>{selected.name}</h3>
                <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 600 }}>{selected.category}</p>
              </div>
              {getStatusBadge(selected.status)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['Seller', selected.seller], ['Price', `$${selected.price}`], ['Size', selected.size], ['Format', selected.format], ['Downloads', selected.downloads.toLocaleString()], ['Revenue', `$${selected.revenue.toLocaleString()}`], ['Created', selected.createdAt], ['Last Updated', selected.lastUpdated]].map(([k, v]) => (
                <div key={k} style={{ padding: 16, background: '#f7fafc', borderRadius: 12, border: '1px solid #edf2f7' }}>
                  <p style={{ fontSize: 12, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1a202c', margin: '4px 0 0' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Dataset"
        footer={[<Btn key="c" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Btn>, <Btn key="s" onClick={() => setIsAddOpen(false)}>Create Dataset</Btn>]}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Dataset Name','text','Enter dataset name'],['Seller','text','Seller name'],['Price ($)','number','0.00'],['Size','text','e.g., 2.5 GB'],['Format','text','e.g., CSV, JSON']].map(([l,t,p]) => (
            <div key={l}>
              <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</label>
              <Input type={t} placeholder={p} style={{ width: '100%', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Category</label>
            <Sel value="" onChange={() => {}} style={{ width: '100%' }}>
              {['Technology','Finance','Healthcare','Marketing','Retail'].map(c => <option key={c} value={c}>{c}</option>)}
            </Sel>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upload Files</label>
          <div style={{ border: '2px dashed #e2e8f0', borderRadius: 16, padding: 40, textAlign: 'center', background: '#f7fafc', transition: 'all 0.2s' }}>
            <Upload size={48} color="#cbd5e0" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 15, color: '#718096', margin: 0, fontWeight: 600 }}>Drag and drop files here or click to browse</p>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Dataset"
        footer={[<Btn key="c" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Btn>, <Btn key="s" onClick={() => setIsEditOpen(false)}>Save Changes</Btn>]}>
        {selected && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['Dataset Name', selected.name], ['Price ($)', selected.price], ['Size', selected.size], ['Format', selected.format]].map(([l, v]) => (
              <div key={l}>
                <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>{l}</label>
                <Input defaultValue={v} style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Status</label>
              <Sel defaultValue={selected.status} onChange={() => {}} style={{ width: '100%' }}>
                {['approved','pending','rejected'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </Sel>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Dataset"
        footer={[<Btn key="c" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Btn>, <Btn key="d" variant="danger" onClick={() => selected && handleDelete(selected.id)}>Delete Dataset</Btn>]}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, padding: 16, background: '#fff5f5', borderRadius: 12 }}>
          <AlertTriangle size={32} color="#e53e3e" />
          <p style={{ color: '#c53030', margin: 0, fontSize: 16, fontWeight: 600 }}>Are you sure you want to delete "{selected?.name}"? This action cannot be undone.</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
