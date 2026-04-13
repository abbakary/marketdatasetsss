import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { Search, Filter, X } from 'lucide-react';

const Input = ({ style, ...p }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'all 0.2s', ...style }} {...p} />;
const Sel = ({ value, onChange, children, style }) => <select value={value} onChange={e => onChange(e.target.value)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a0aec0\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '40px', ...style }}>{children}</select>;

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [bookmarkedIds, setBookmarkedIds] = useState(['d1', 'd4']);
  const [selected, setSelected] = useState(null);

  const approved = allDatasets.filter(d => d.status === 'approved');
  const categories = [...new Set(approved.map(d => d.category))];

  const filtered = approved
    .filter(d => {
      const ms = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const mc = categoryFilter === 'all' || d.category === categoryFilter;
      return ms && mc;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return parseInt(b.downloads) - parseInt(a.downloads);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
      return 0;
    });

  const toggleBookmark = id => setBookmarkedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <DashboardLayout role="viewer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Browse Datasets</h2>
          <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Discover and explore thousands of high-quality datasets</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <Input placeholder="Search by title, description or keywords..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: 44, boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Sel value={categoryFilter} onChange={setCategoryFilter} style={{ minWidth: 180, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </Sel>
            <Sel value={sortBy} onChange={setSortBy} style={{ minWidth: 160, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </Sel>
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#718096', margin: 0, fontWeight: 600 }}>Found <span style={{ color: '#FF8C00' }}>{filtered.length}</span> datasets matching your search</p>

        {/* Dataset Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {filtered.map(d => (
            <DatasetCard key={d.id} dataset={d}
              onAction={() => setSelected(d)}
              actionLabel="View Details"
              actionStyle={{ background: '#20B2AA', color: '#fff' }}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '80px 0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid #edf2f7' }}>
              <Search size={40} color="#cbd5e0" />
            </div>
            <p style={{ color: '#718096', margin: '0 0 24px', fontSize: 18, fontWeight: 600 }}>No results found for your search</p>
            <button onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }} style={{ padding: '14px 28px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(255,140,0,0.3)', transition: 'all 0.2s' }}>Clear All Filters</button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 28, padding: 32, width: '100%', maxWidth: 580, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>{selected.title}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
            </div>
            <div style={{ height: 240, borderRadius: 20, backgroundImage: `url(${selected.image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 24, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)' }} />
            <p style={{ color: '#4a5568', fontSize: 16, margin: '0 0 24px', lineHeight: 1.6, fontWeight: 500 }}>{selected.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
              {[['Author', selected.author], ['Format', selected.format], ['Size', selected.size], ['License', selected.license]].map(([k, v]) => (
                <div key={k} style={{ padding: 12, borderRadius: 12, background: '#f8fafc', border: '1px solid #edf2f7' }}>
                  <p style={{ fontSize: 10, color: '#a0aec0', margin: '0 0 4px', fontWeight: 800, textTransform: 'uppercase' }}>{k}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1a202c', margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid #edf2f7' }}>
              <div>
                <p style={{ fontSize: 12, color: '#a0aec0', margin: '0 0 2px', fontWeight: 700, textTransform: 'uppercase' }}>Instant Download</p>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#20B2AA' }}>${selected.price}</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setSelected(null)} style={{ padding: '14px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, color: '#4a5568', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Close View</button>
                <button onClick={() => { toggleBookmark(selected.id); setSelected(null); }} style={{ padding: '14px 28px', background: '#FF8C00', border: 'none', borderRadius: 16, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 800, boxShadow: '0 4px 12px rgba(255,140,0,0.3)' }}>
                  {bookmarkedIds.includes(selected.id) ? 'Bookmarked ✓' : 'Bookmark Dataset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
