import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { ShieldAlert, Flag, CheckCircle, Trash2, Eye, Search, X, AlertTriangle } from 'lucide-react';

const Input = ({ style, ...p }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', ...style }} {...p} />;

const flagReasons = ['Policy Violation', 'Duplicate Content', 'Inaccurate Metadata', 'Spam', 'Copyright Issue', 'Quality Issue'];

const initialFlags = allDatasets.slice(0, 6).map((d, i) => ({
  ...d,
  flagReason: flagReasons[i % flagReasons.length],
  flaggedAt: new Date(Date.now() - i * 86400000 * 2),
  flagStatus: i < 2 ? 'open' : i < 4 ? 'resolved' : 'dismissed',
  severity: i < 2 ? 'high' : i < 4 ? 'medium' : 'low',
}));

const sevColor = {
  high: { bg: '#fff5f5', color: '#e53e3e', border: '#fed7d7' },
  medium: { bg: '#fffaf0', color: '#dd6b20', border: '#feebc8' },
  low: { bg: '#ebf8ff', color: '#3182ce', border: '#bee3f8' },
};
const statusColor = {
  open: { bg: '#fff5f5', color: '#e53e3e', border: '#fed7d7' },
  resolved: { bg: '#f0fff4', color: '#38a169', border: '#c6f6d5' },
  dismissed: { bg: '#f7fafc', color: '#718096', border: '#e2e8f0' },
};

export default function ModerationPage() {
  const [flags, setFlags] = useState(initialFlags);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = flags.filter(f => {
    const ms = f.title.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'all' || f.flagStatus === statusFilter;
    return ms && mf;
  });

  const handleAction = (id, action) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, flagStatus: action } : f));
    showToast(`Flag ${action}`);
    setSelected(null);
  };

  const handleRemove = id => {
    setFlags(prev => prev.filter(f => f.id !== id));
    showToast('Dataset removed from platform');
    setSelected(null);
  };

  const counts = {
    open: flags.filter(f => f.flagStatus === 'open').length,
    resolved: flags.filter(f => f.flagStatus === 'resolved').length,
    dismissed: flags.filter(f => f.flagStatus === 'dismissed').length,
  };

  return (
    <DashboardLayout role="editor">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Content Moderation</h2>
          <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Review flagged content and take moderation actions</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
          {[
            { label: 'Open Flags', count: counts.open, accent: '#e53e3e', bg: '#fff', icon: <Flag size={32} /> },
            { label: 'Resolved', count: counts.resolved, accent: '#38a169', bg: '#fff', icon: <CheckCircle size={32} /> },
            { label: 'Dismissed', count: counts.dismissed, accent: '#718096', bg: '#fff', icon: <ShieldAlert size={32} /> },
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
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <Input placeholder="Search flagged content..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', paddingLeft: 44, boxSizing: 'border-box' }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 16px', color: '#1a202c', fontSize: 14, outline: 'none', cursor: 'pointer', minWidth: 160, appearance: 'none' }}>
            <option value="all">All Flags</option>
            <option value="open">Open Flags</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        {/* Flagged Dataset Cards using DatasetCard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {filtered.map(item => {
            const sc = sevColor[item.severity];
            const stc = statusColor[item.flagStatus];
            return (
              <div key={item.id} style={{ position: 'relative' }}>
                <DatasetCard dataset={item} showStatus
                  onAction={() => setSelected(item)}
                  actionLabel="Review Flag"
                  actionStyle={{ background: item.flagStatus === 'open' ? '#FF8C00' : '#f7fafc', color: item.flagStatus === 'open' ? '#fff' : '#4a5568', border: item.flagStatus === 'open' ? 'none' : '1px solid #e2e8f0' }}
                />
                {/* Flag overlay badges */}
                <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexDirection: 'column' }}>
                  <span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, textTransform: 'uppercase' }}>
                    {item.severity}
                  </span>
                  <span style={{ padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                    {item.flagReason}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: stc.bg, color: stc.color, border: `1px solid ${stc.border}`, textTransform: 'capitalize' }}>
                    {item.flagStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#718096', padding: '48px 0', fontSize: 16, fontWeight: 600 }}>No flagged content found</p>}
      </div>

      {/* Detail Modal */}
      {selected && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 580, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>Moderation Review</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 24, border: '1px solid #edf2f7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ height: 160, backgroundImage: `url(${selected.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: 24, background: '#fff' }}>
                <p style={{ color: '#1a202c', fontWeight: 800, margin: '0 0 8px', fontSize: 18 }}>{selected.title}</p>
                <p style={{ color: '#4a5568', margin: '0 0 20px', fontSize: 14, lineHeight: 1.6 }}>{selected.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  {[['Author', selected.author], ['Category', selected.category], ['Flag Reason', selected.flagReason], ['Severity', selected.severity], ['Price', `$${selected.price}`], ['Status', selected.flagStatus]].map(([k, v]) => (
                    <div key={k} style={{ padding: '8px 12px', background: '#f7fafc', borderRadius: 8, border: '1px solid #edf2f7' }}>
                      <span style={{ color: '#718096', fontWeight: 700 }}>{k}: </span>
                      <span style={{ color: '#1a202c', fontWeight: 700, textTransform: 'capitalize' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setSelected(null)} style={{ padding: '10px 22px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#4a5568', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Close</button>
              <button onClick={() => handleReview('reject')} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#e53e3e', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Dismiss Flag</button>
              <button onClick={() => handleAction(selected.id, 'resolved')} style={{ padding: '12px 24px', background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 12, color: '#38a169', cursor: 'pointer', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={18} /> Resolve Issue</button>
              <button onClick={() => handleRemove(selected.id)} style={{ padding: '12px 28px', background: '#FF8C00', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(255,140,0,0.3)' }}><Trash2 size={18} /> Remove Content</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#1a202c', borderRadius: 12, padding: '16px 24px', color: '#fff', fontSize: 15, fontWeight: 700, zIndex: 300, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>{toast}</div>}
    </DashboardLayout>
  );
}
