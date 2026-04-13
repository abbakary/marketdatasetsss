import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { Search, History, Trash2, Clock, Bookmark, X } from 'lucide-react';

const Input = ({ style, ...p }) => <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', ...style }} {...p} />;

const initialHistory = [
  { id: 'h1', datasetId: 'd1', viewedAt: new Date('2024-11-05T10:30:00') },
  { id: 'h2', datasetId: 'd4', viewedAt: new Date('2024-11-05T14:15:00') },
  { id: 'h3', datasetId: 'd2', viewedAt: new Date('2024-11-04T09:00:00') },
  { id: 'h4', datasetId: 'd6', viewedAt: new Date('2024-11-04T16:45:00') },
  { id: 'h5', datasetId: 'd8', viewedAt: new Date('2024-11-03T11:20:00') },
  { id: 'h6', datasetId: 'd9', viewedAt: new Date('2024-11-03T15:00:00') },
];

export default function HistoryPage() {
  const [history, setHistory] = useState(initialHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const historyWithDatasets = history
    .map(item => ({ ...item, dataset: allDatasets.find(d => d.id === item.datasetId) }))
    .filter(item => item.dataset);

  const filtered = historyWithDatasets.filter(item =>
    item.dataset?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by date
  const grouped = filtered.reduce((groups, item) => {
    const date = item.viewedAt.toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {});

  const handleClear = () => { setHistory([]); setIsClearDialogOpen(false); };
  const removeItem = id => setHistory(history.filter(h => h.id !== id));

  return (
    <DashboardLayout role="viewer">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Viewing History</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Keep track of the datasets you've explored</p>
          </div>
          <button onClick={() => setIsClearDialogOpen(true)} disabled={history.length === 0}
            style={{ padding: '12px 24px', background: history.length === 0 ? '#f8fafc' : '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: history.length === 0 ? '#cbd5e0' : '#e53e3e', cursor: history.length === 0 ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
            <Trash2 size={18} /> Clear History
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
          <Input placeholder="Search your history..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: 44, boxSizing: 'border-box' }} />
        </div>

        {/* Grouped History — each group shows DatasetCards */}
        {Object.entries(grouped).map(([date, items]) => (
          <ChartCard key={date} title={date}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
               {items.map(item => (
                 <div key={item.id} style={{ position: 'relative' }}>
                   <DatasetCard dataset={item.dataset}
                     onAction={() => {}}
                     actionLabel="View Again"
                     actionStyle={{ background: '#20B2AA', color: '#fff' }}
                   />
                   <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
                     <div style={{ padding: '4px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                       <Clock size={12} color="#FF8C00" />
                       <span style={{ fontSize: 12, color: '#1a202c', fontWeight: 700 }}>{item.viewedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                   </div>
                   <button onClick={() => removeItem(item.id)}
                     style={{ position: 'absolute', top: 12, right: 12, padding: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#e53e3e', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                     <X size={14} />
                   </button>
                 </div>
               ))}
            </div>
          </ChartCard>
        ))}

        {Object.keys(grouped).length === 0 && (
          <ChartCard title="">
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: '80px 0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
             <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid #edf2f7' }}>
               <History size={40} color="#cbd5e0" />
             </div>
             <p style={{ color: '#718096', margin: '0 0 24px', fontSize: 18, fontWeight: 600 }}>You haven't viewed any datasets yet</p>
             <a href="/dashboard/viewer/browse" style={{ padding: '14px 28px', background: '#FF8C00', color: '#fff', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 10px rgba(255,140,0,0.3)', transition: 'all 0.2s', display: 'inline-block' }}>Explore Datasets</a>
           </div>
          </ChartCard>
        )}
      </div>

      {/* Clear Confirm */}
       {isClearDialogOpen && (
         <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
           <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
             <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 24px', color: '#e53e3e' }}>
               <Trash2 size={32} />
             </div>
             <h3 style={{ color: '#1a202c', margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>Clear History?</h3>
             <p style={{ color: '#718096', margin: '0 0 32px', fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>Are you sure you want to clear your entire viewing history? This action cannot be reversed.</p>
             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
               <button onClick={() => setIsClearDialogOpen(false)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#4a5568', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Keep History</button>
               <button onClick={handleClear} style={{ padding: '12px 24px', background: '#e53e3e', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 800, boxShadow: '0 4px 10px rgba(229,62,62,0.3)' }}>Yes, Clear All</button>
             </div>
           </div>
         </div>
       )}
    </DashboardLayout>
  );
}
