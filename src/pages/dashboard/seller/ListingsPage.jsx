import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { Plus, Search, Edit, Trash2, Eye, Package, DollarSign, X } from 'lucide-react';

const Input = ({ style, ...p }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', ...style }} {...p} />;
const Sel = ({ value, onChange, children, style }) => <select value={value} onChange={e => onChange(e.target.value)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', ...style }}>{children}</select>;
const Badge = ({ children, style }) => <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', ...style }}>{children}</span>;
const statusStyle = s => s === 'approved' ? { background: '#f0fff4', color: '#38a169', border: '1px solid #c6f6d5' } : s === 'pending' ? { background: '#fffaf0', color: '#dd6b20', border: '1px solid #feebc8' } : { background: '#ebf8ff', color: '#3182ce', border: '1px solid #bee3f8' };

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
        </div>
        {children}
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>{footer}</div>}
      </div>
    </div>
  );
};

export default function ListingsPage() {
  const [datasets, setDatasets] = useState(allDatasets.map(d => ({ ...d })));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = datasets.filter(d => {
    const ms = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const mst = statusFilter === 'all' || d.status === statusFilter;
    return ms && mst;
  });

  const resetForm = () => setForm({ title: '', description: '', price: '', category: '' });

  const handleAdd = () => {
    const newDs = {
      id: `new-${Date.now()}`, title: form.title, author: 'My Store', category: form.category || 'Computer Science',
      usability: '9.0', updated: 'Just now', files: '1 File (CSV)', size: '0 MB', downloads: '0 downloads',
      votes: 0, image: 'https://images.unsplash.com/photo-1460925895917-adf4e5d1baaa?auto=format&fit=crop&w=900&q=80',
      price: form.price || '0', status: 'pending', description: form.description, format: 'CSV', license: 'CC BY 4.0',
    };
    setDatasets([newDs, ...datasets]);
    setIsAddOpen(false); resetForm(); showToast('Listing created successfully');
  };

  const handleEdit = () => {
    setDatasets(datasets.map(d => d.id === selected.id ? { ...d, title: form.title, price: form.price || d.price, description: form.description } : d));
    setIsEditOpen(false); setSelected(null); resetForm(); showToast('Listing updated');
  };

  const handleDelete = () => {
    setDatasets(datasets.filter(d => d.id !== selected.id));
    setIsDeleteOpen(false); setSelected(null); showToast('Listing deleted');
  };

  const openEdit = d => { setSelected(d); setForm({ title: d.title, description: d.description || '', price: String(d.price), category: d.category }); setIsEditOpen(true); };
  const openDelete = d => { setSelected(d); setIsDeleteOpen(true); };

  const activeCount = datasets.filter(d => d.status === 'approved').length;
  const totalRevenue = datasets.filter(d => d.status === 'approved').reduce((s, d) => s + parseFloat(d.price) * (d.votes || 0), 0);
  const totalViews = datasets.reduce((s, d) => s + (d.votes || 0) * 50, 0);

  return (
    <DashboardLayout role="seller">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>My Listings</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Manage your dataset listings</p>
          </div>
          <button onClick={() => setIsAddOpen(true)} style={{ padding: '12px 24px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}>
            <Plus size={20} /> New Listing
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
          {[
            { label: 'Active Listings', value: activeCount, icon: <Package size={32} />, accent: '#38a169', bg: '#fff' },
            { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign size={32} />, accent: '#20B2AA', bg: '#fff' },
            { label: 'Total Views', value: totalViews.toLocaleString(), icon: <Eye size={32} />, accent: '#805ad5', bg: '#fff' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 16, background: s.bg, border: '1px solid #edf2f7', padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ padding: 12, borderRadius: 12, background: `${s.accent}15`, color: s.accent }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 13, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#1a202c', margin: '4px 0 0' }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <Input placeholder="Search listings..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: 44, boxSizing: 'border-box' }} />
          </div>
          <Sel value={statusFilter} onChange={setStatusFilter} style={{ minWidth: 160 }}>
            <option value="all">All Status</option>
            <option value="approved">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </Sel>
        </div>

        {/* Dataset Cards using DatasetCard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {filtered.map(d => (
            <div key={d.id} style={{ position: 'relative' }}>
              <DatasetCard dataset={d} showStatus
                onAction={() => openEdit(d)}
                actionLabel="Edit"
                actionStyle={{ background: '#FF8C00', color: '#fff' }}
              />
              <button onClick={() => openDelete(d)}
                style={{ position: 'absolute', top: 12, left: 12, padding: '6px 10px', background: '#fff', border: '1px solid #fed7d7', borderRadius: 8, color: '#e53e3e', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#718096', padding: '48px 0', fontSize: 16, fontWeight: 600 }}>No listings found matching your criteria</p>}
      </div>

      {/* Add Modal */}
      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Listing"
        footer={[
          <button key="c" onClick={() => setIsAddOpen(false)} style={{ padding: '10px 22px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#4a5568', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Cancel</button>,
          <button key="a" onClick={handleAdd} style={{ padding: '10px 22px', background: '#FF8C00', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}>Create Listing</button>,
        ]}>
        {[['Dataset Title', 'title', 'text', 'Enter dataset title'], ['Price ($)', 'price', 'number', '299']].map(([l, k, t, p]) => (
          <div key={k} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</label>
            <Input type={t} placeholder={p} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe your dataset..."
            style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', color: '#1a202c', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
          <Sel value={form.category} onChange={v => setForm({ ...form, category: v })} style={{ width: '100%' }}>
            {['Computer Science', 'Finance and Investment', 'Social Services', 'Agriculture and Environment', 'ICT and Digital Economy', 'Natural Resources and Energy', 'Infrastructure and Transport', 'Urban Development and Housing'].map(c => <option key={c} value={c}>{c}</option>)}
          </Sel>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Listing"
        footer={[
          <button key="c" onClick={() => setIsEditOpen(false)} style={{ padding: '10px 22px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#4a5568', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Cancel</button>,
          <button key="s" onClick={handleEdit} style={{ padding: '10px 22px', background: '#FF8C00', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}>Save Changes</button>,
        ]}>
        {selected && <div style={{ height: 80, borderRadius: 8, backgroundImage: `url(${selected.image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 14 }} />}
        {[['Dataset Title', 'title', 'text'], ['Price ($)', 'price', 'number']].map(([l, k, t]) => (
          <div key={k} style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</label>
            <Input type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
        ))}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4}
            style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', color: '#1a202c', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Listing"
        footer={[
          <button key="c" onClick={() => setIsDeleteOpen(false)} style={{ padding: '10px 22px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#4a5568', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Cancel</button>,
          <button key="d" onClick={handleDelete} style={{ padding: '10px 22px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, color: '#e53e3e', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Delete Permanently</button>,
        ]}>
        <p style={{ color: '#4a5568', margin: 0, fontSize: 16, lineHeight: 1.6, fontWeight: 500 }}>Are you sure you want to delete <strong style={{ color: '#1a202c' }}>"{selected?.title}"</strong>? This action is irreversible and the listing will be removed from the platform.</p>
      </Modal>

      {toast && <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#1a202c', borderRadius: 12, padding: '16px 24px', color: '#fff', fontSize: 15, fontWeight: 700, zIndex: 300, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>{toast}</div>}
    </DashboardLayout>
  );
}
