import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { CheckCircle, XCircle, Clock, Search, X } from 'lucide-react';

const Input = ({ style, ...p }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', ...style }} {...p} />;
const Sel = ({ value, onChange, children, style }) => <select value={value} onChange={e => onChange(e.target.value)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', ...style }}>{children}</select>;

export default function ApprovalsPage() {
  const [datasets, setDatasets] = useState(allDatasets.map(d => ({ ...d })));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = datasets.filter(d => {
    const ms = d.title.toLowerCase().includes(search.toLowerCase()) || d.author.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' || d.status === filter;
    return ms && mf;
  });

  const handleAction = (id, action) => {
    setDatasets(prev => prev.map(d => d.id === id ? { ...d, status: action } : d));
    showToast(`Dataset ${action === 'approved' ? 'approved' : 'rejected'} successfully`);
    setSelected(null); setNotes('');
  };

  const counts = {
    pending: datasets.filter(d => d.status === 'pending').length,
    approved: datasets.filter(d => d.status === 'approved').length,
    rejected: datasets.filter(d => d.status === 'rejected').length,
  };

  return (
    <DashboardLayout role="editor">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Approvals</h2>
          <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Review and approve dataset submissions</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
          {[
            { label: 'Pending', count: counts.pending, accent: '#FF8C00', bg: '#fff', icon: <Clock size={32} /> },
            { label: 'Approved', count: counts.approved, accent: '#20B2AA', bg: '#fff', icon: <CheckCircle size={32} /> },
            { label: 'Rejected', count: counts.rejected, accent: '#e53e3e', bg: '#fff', icon: <XCircle size={32} /> },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 16, background: s.bg, border: '1px solid #edf2f7', padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ padding: 12, borderRadius: 12, background: `${s.accent}15`, color: s.accent }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 13, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#1a202c', margin: '4px 0 0' }}>{s.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <Input placeholder="Search datasets..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', paddingLeft: 44, boxSizing: 'border-box' }} />
          </div>
          <Sel value={filter} onChange={setFilter} style={{ minWidth: 150 }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Sel>
        </div>

        {/* Dataset Cards using DatasetCard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {filtered.map(d => (
            <DatasetCard key={d.id} dataset={d} showStatus
              onAction={() => setSelected(d)}
              actionLabel={d.status === 'pending' ? 'Review' : 'View'}
              actionStyle={{ background: d.status === 'pending' ? '#FF8C00' : '#f7fafc', color: d.status === 'pending' ? '#fff' : '#4a5568', border: d.status === 'pending' ? 'none' : '1px solid #e2e8f0' }}
            />
          ))}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#718096', padding: '48px 0', fontSize: 16, fontWeight: 600 }}>No datasets found</p>}
      </div>

      {/* Review Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 580, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>Review Dataset</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
            </div>
            {/* Full dataset preview */}
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 24, border: '1px solid #edf2f7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ height: 160, backgroundImage: `url(${selected.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: 24, background: '#fff' }}>
                <p style={{ color: '#1a202c', fontWeight: 800, margin: '0 0 8px', fontSize: 18 }}>{selected.title}</p>
                <p style={{ color: '#4a5568', margin: '0 0 20px', fontSize: 14, lineHeight: 1.6 }}>{selected.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  {[['Author', selected.author], ['Category', selected.category], ['Price', `$${selected.price}`], ['Size', selected.size], ['Files', selected.files], ['Format', selected.format], ['License', selected.license], ['Usability', selected.usability]].map(([k, v]) => (
                    <div key={k} style={{ padding: '8px 12px', background: '#f7fafc', borderRadius: 8, border: '1px solid #edf2f7' }}>
                      <span style={{ color: '#718096', fontWeight: 700 }}>{k}: </span>
                      <span style={{ color: '#1a202c', fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, color: '#4a5568', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Review Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add decision feedback..."
                style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, color: '#1a202c', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setSelected(null)} style={{ padding: '10px 22px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#4a5568', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Cancel</button>
              <button onClick={() => handleAction(selected.id, 'rejected')} style={{ padding: '10px 22px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, color: '#e53e3e', cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><XCircle size={18} /> Reject</button>
              <button onClick={() => handleAction(selected.id, 'approved')} style={{ padding: '10px 22px', background: '#FF8C00', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(255,140,0,0.2)' }}><CheckCircle size={18} /> Approve</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#1a202c', borderRadius: 12, padding: '16px 24px', color: '#fff', fontSize: 15, fontWeight: 700, zIndex: 300, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>{toast}</div>}
    </DashboardLayout>
  );
}
