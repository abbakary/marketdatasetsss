import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { Search, Check, X, Clock } from 'lucide-react';

const Input = ({ style, ...p }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', ...style }} {...p} />;
const tabs = ['pending', 'approved', 'rejected', 'all'];

export default function ReviewsPage() {
  const [datasets, setDatasets] = useState(allDatasets.map(d => ({ ...d })));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const pendingCount = datasets.filter(d => d.status === 'pending').length;
  const approvedCount = datasets.filter(d => d.status === 'approved').length;
  const rejectedCount = datasets.filter(d => d.status === 'rejected').length;

  const filtered = datasets
    .filter(d => activeTab === 'all' || d.status === activeTab)
    .filter(d => !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.author.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleReview = action => {
    if (!selectedDataset) return;
    setDatasets(prev => prev.map(d => d.id === selectedDataset.id ? { ...d, status: action === 'approve' ? 'approved' : 'rejected' } : d));
    setSelectedDataset(null); setReviewNotes('');
  };

  return (
    <DashboardLayout role="editor">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Review Queue</h2>
          <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Manage dataset submissions and reviews</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
          {[
            { label: 'Pending', count: pendingCount, icon: <Clock size={40} />, bg: '#fff', accent: '#FF8C00', textColor: '#FF8C00' },
            { label: 'Approved', count: approvedCount, icon: <Check size={40} />, bg: '#fff', accent: '#20B2AA', textColor: '#20B2AA' },
            { label: 'Rejected', count: rejectedCount, icon: <X size={40} />, bg: '#fff', accent: '#e53e3e', textColor: '#e53e3e' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 16, background: s.bg, border: '1px solid #edf2f7', padding: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ padding: 12, borderRadius: 12, background: `${s.accent}15`, color: s.accent }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 13, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{s.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
          <div style={{ display: 'flex', background: '#f8fafc', borderRadius: 16, padding: 6, gap: 6, border: '1px solid #edf2f7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 800,
                background: activeTab === tab ? '#FF8C00' : 'transparent',
                color: activeTab === tab ? '#fff' : '#718096',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab ? '0 4px 10px rgba(255,140,0,0.25)' : 'none',
              }}>
                {tab === 'pending' ? `Pending Review (${pendingCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <Input placeholder="Search by title or author..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 44, width: 280 }} />
          </div>
        </div>

        {/* Dataset Cards using DatasetCard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {filtered.map(d => (
            <DatasetCard key={d.id} dataset={d} showStatus
              onAction={() => d.status === 'pending' ? setSelectedDataset(d) : null}
              actionLabel={d.status === 'pending' ? 'Review' : 'View'}
              actionStyle={{ background: d.status === 'pending' ? '#FF8C00' : '#f7fafc', color: d.status === 'pending' ? '#fff' : '#4a5568', border: d.status === 'pending' ? 'none' : '1px solid #e2e8f0' }}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <ChartCard title="">
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: '#718096', margin: 0, fontSize: 16, fontWeight: 600 }}>No reviews found matching your criteria</p>
            </div>
          </ChartCard>
        )}
      </div>

      {/* Review Dialog */}
      {selectedDataset && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 580, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: '#1a202c', margin: '0 0 6px', fontSize: 24, fontWeight: 800 }}>Review Dataset</h3>
            <p style={{ color: '#718096', margin: '0 0 24px', fontSize: 15, fontWeight: 500 }}>Review the dataset details and approve or reject.</p>
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 24, border: '1px solid #edf2f7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ height: 160, backgroundImage: `url(${selectedDataset.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: 24, background: '#fff' }}>
                <p style={{ color: '#1a202c', fontWeight: 800, margin: '0 0 8px', fontSize: 18 }}>{selectedDataset.title}</p>
                <p style={{ fontSize: 14, color: '#4a5568', margin: '0 0 20px', lineHeight: 1.6 }}>{selectedDataset.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  {[['Author', selectedDataset.author], ['Category', selectedDataset.category], ['Price', `$${selectedDataset.price}`], ['Size', selectedDataset.size], ['Files', selectedDataset.files], ['Format', selectedDataset.format], ['License', selectedDataset.license], ['Usability', selectedDataset.usability]].map(([k, v]) => (
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
              <textarea value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} rows={4} placeholder="Add review feedback for the seller..."
                style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, color: '#1a202c', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setSelectedDataset(null)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#4a5568', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Cancel Review</button>
              <button onClick={() => handleReview('reject')} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #fed7d7', borderRadius: 12, color: '#e53e3e', cursor: 'pointer', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><X size={20} /> Reject Submission</button>
              <button onClick={() => handleReview('approve')} style={{ padding: '12px 28px', background: '#FF8C00', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 10px rgba(255,140,0,0.3)' }}><Check size={20} /> Approve Dataset</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
