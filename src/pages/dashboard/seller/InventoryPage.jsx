import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';

const Input = ({ style, ...p }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', ...style }} {...p} />;
const Sel = ({ value, onChange, children, style }) => <select value={value} onChange={e => onChange(e.target.value)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', ...style }}>{children}</select>;

export default function InventoryPage() {
  const [datasets, setDatasets] = useState(allDatasets.map(d => ({ ...d })));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = datasets.filter(d => {
    const ms = d.title.toLowerCase().includes(search.toLowerCase()) || d.author.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || d.status === statusFilter;
    return ms && mf;
  });

  const openEdit = d => { setSelected(d); setEditForm({ title: d.title, price: d.price, description: d.description }); setIsEditOpen(true); };
  const handleSave = () => {
    setDatasets(prev => prev.map(d => d.id === selected.id ? { ...d, ...editForm } : d));
    showToast('Dataset updated successfully');
    setIsEditOpen(false); setSelected(null);
  };
  const handleDelete = id => { setDatasets(prev => prev.filter(d => d.id !== id)); showToast('Dataset removed'); };

  return (
    <DashboardLayout role="seller">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Inventory</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Manage all your dataset listings</p>
          </div>
          <button style={{ padding: '12px 24px', background: '#FF8C00', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}>
            <Plus size={20} /> Add Dataset
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24 }}>
          {[
            { label: 'Total Listings', count: datasets.length, color: '#718096', accent: '#a0aec0' },
            { label: 'Active', count: datasets.filter(d => d.status === 'approved').length, color: '#38a169', accent: '#38a169' },
            { label: 'Pending', count: datasets.filter(d => d.status === 'pending').length, color: '#dd6b20', accent: '#dd6b20' },
            { label: 'Rejected', count: datasets.filter(d => d.status === 'rejected').length, color: '#e53e3e', accent: '#e53e3e' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 16, background: '#fff', border: '1px solid #edf2f7', padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: 13, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: s.color, margin: '8px 0 0' }}>{s.count}</p>
              <div style={{ height: 4, width: '40%', background: `${s.accent}20`, borderRadius: 2, marginTop: 12 }} />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <Input placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', paddingLeft: 44, boxSizing: 'border-box' }} />
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
              <button onClick={() => handleDelete(d.id)}
                style={{ position: 'absolute', top: 12, left: 12, padding: '6px 10px', background: '#fff', border: '1px solid #fed7d7', borderRadius: 8, color: '#e53e3e', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#718096', padding: '48px 0', fontSize: 16, fontWeight: 600 }}>No datasets found matching your criteria</p>}
      </div>

      {/* Edit Modal */}
      {isEditOpen && selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>Edit Dataset</h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
            </div>
            <div style={{ height: 160, borderRadius: 16, backgroundImage: `url(${selected.image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 24, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' }} />
            {[['Title', 'title', 'text'], ['Price ($)', 'price', 'number']].map(([l, k, t]) => (
              <div key={k} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</label>
                <Input type={t} value={editForm[k] || ''} onChange={e => setEditForm({ ...editForm, [k]: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
              <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={4}
                style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', color: '#1a202c', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setIsEditOpen(false)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#4a5568', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '12px 24px', background: '#FF8C00', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#1a202c', borderRadius: 12, padding: '16px 24px', color: '#fff', fontSize: 15, fontWeight: 700, zIndex: 300, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>{toast}</div>}
    </DashboardLayout>
  );
}
