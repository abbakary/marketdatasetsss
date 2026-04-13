import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { Search, Bookmark, X } from 'lucide-react';

const Input = ({ style, ...p }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', ...style }} {...p} />;

const initialBookmarkIds = ['d1', 'd4', 'd8'];

export default function BookmarksPage() {
  const [bookmarkIds, setBookmarkIds] = useState(initialBookmarkIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemToRemove, setItemToRemove] = useState(null);

  const bookmarkedDatasets = allDatasets.filter(d => bookmarkIds.includes(d.id));
  const filtered = bookmarkedDatasets.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = () => {
    if (!itemToRemove) return;
    setBookmarkIds(prev => prev.filter(id => id !== itemToRemove));
    setItemToRemove(null);
  };

  return (
    <DashboardLayout role="viewer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>My Bookmarks</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Datasets you have saved for later review</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, background: '#fff', padding: '10px 20px', borderRadius: 12, border: '1px solid #edf2f7', color: '#1a202c', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <Bookmark size={18} color="#20B2AA" fill="#20B2AA" />
            <span>{bookmarkIds.length} bookmarked</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
          <Input placeholder="Search bookmarked datasets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: 44, boxSizing: 'border-box' }} />
        </div>

        {/* Dataset Cards using DatasetCard */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {filtered.map(d => (
              <div key={d.id} style={{ position: 'relative' }}>
                <DatasetCard dataset={d}
                  onAction={() => {}}
                  actionLabel="View Details"
                  actionStyle={{ background: '#20B2AA', color: '#fff' }}
                />
                <button onClick={() => setItemToRemove(d.id)}
                  style={{ position: 'absolute', top: 12, left: 12, padding: '6px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#e53e3e', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <X size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '80px 0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid #edf2f7' }}>
              <Bookmark size={40} color="#cbd5e0" />
            </div>
            <p style={{ color: '#718096', margin: '0 0 24px', fontSize: 18, fontWeight: 600 }}>Your bookmark list is empty</p>
            <a href="/dashboard/viewer/browse" style={{ padding: '14px 28px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 10px rgba(255,140,0,0.3)', transition: 'all 0.2s', display: 'inline-block' }}>Explore Datasets</a>
          </div>
        )}
      </div>

      {/* Remove Confirm */}
      {itemToRemove && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fff4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 24px', color: '#20B2AA' }}>
              <Bookmark size={32} />
            </div>
            <h3 style={{ color: '#1a202c', margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>Remove Bookmark?</h3>
            <p style={{ color: '#718096', margin: '0 0 32px', fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>Are you sure you want to remove this dataset from your bookmarks?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setItemToRemove(null)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#4a5568', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Keep it</button>
              <button onClick={handleRemove} style={{ padding: '12px 24px', background: '#e53e3e', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 800, boxShadow: '0 4px 10px rgba(229,62,62,0.3)' }}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
