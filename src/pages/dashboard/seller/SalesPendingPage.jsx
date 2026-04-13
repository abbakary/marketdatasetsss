import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { DatasetCard, allDatasets } from '../lib/DatasetCard';
import { Clock, CheckCircle, XCircle, RefreshCw, MessageSquare, X } from 'lucide-react';

export default function SalesPendingPage() {
  const [datasets, setDatasets] = useState(allDatasets.filter(d => d.status === 'pending').map(d => ({ ...d, submittedAt: new Date(Date.now() - Math.random() * 7 * 86400000), editorNote: '' })));
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleWithdraw = (id) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    showToast('Submission withdrawn');
    setSelected(null);
  };

  const handleResubmit = (id) => {
    showToast('Dataset resubmitted for review');
    setSelected(null);
  };

  return (
    <DashboardLayout role="seller">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 8 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>Sales Pending</h2>
          <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 16, fontWeight: 500 }}>Datasets awaiting editor review and approval</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {[
            { label: 'Pending Review', count: datasets.length, color: '#dd6b20', bg: '#fff', icon: <Clock size={28} /> },
            { label: 'Avg Wait Time', count: '2.4 days', color: '#20B2AA', bg: '#fff', icon: <RefreshCw size={28} /> },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 16, background: s.bg, border: '1px solid #edf2f7', padding: 24, display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: 14, borderRadius: 12, background: `${s.color}15`, color: s.color }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 13, color: '#718096', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#1a202c', margin: '4px 0 0' }}>{s.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Dataset Cards */}
        {datasets.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {datasets.map(d => (
              <DatasetCard key={d.id} dataset={d} showStatus
                onAction={() => setSelected(d)}
                actionLabel="View Status"
                actionStyle={{ background: '#fffaf0', color: '#dd6b20', border: '1px solid #feebc8' }}
              />
            ))}
          </div>
        ) : (
          <ChartCard title="">
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <CheckCircle size={56} color="#cbd5e0" style={{ margin: '0 auto 20px' }} />
              <p style={{ color: '#718096', margin: 0, fontSize: 18, fontWeight: 600 }}>No pending submissions at the moment</p>
            </div>
          </ChartCard>
        )}

        {/* Tips */}
        <ChartCard title="Submission Tips">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
            {[
              { tip: 'Ensure accurate metadata', desc: 'Complete all required fields including category, format, and license.' },
              { tip: 'High usability score', desc: 'Well-documented datasets with clear descriptions get approved faster.' },
              { tip: 'Proper file formats', desc: 'Use standard formats like CSV, JSON, or Excel for better compatibility.' },
              { tip: 'Review guidelines', desc: 'Check platform content policies before submitting.' },
            ].map(t => (
              <div key={t.tip} style={{ padding: 20, borderRadius: 16, background: '#fff', border: '1px solid #edf2f7', borderLeft: '4px solid #FF8C00' }}>
                <p style={{ color: '#1a202c', fontWeight: 800, margin: '0 0 6px', fontSize: 15 }}>{t.tip}</p>
                <p style={{ color: '#718096', margin: 0, fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Status Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: '#1a202c', margin: 0, fontSize: 24, fontWeight: 800 }}>Submission Status</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 24, border: '1px solid #edf2f7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ height: 140, backgroundImage: `url(${selected.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: 20, background: '#fff' }}>
                <p style={{ color: '#1a202c', fontWeight: 800, margin: '0 0 8px', fontSize: 18 }}>{selected.title}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                  {[['Category', selected.category], ['Price', `$${selected.price}`], ['Size', selected.size], ['Format', selected.format]].map(([k, v]) => (
                    <div key={k} style={{ fontSize: 13, background: '#f7fafc', padding: '6px 12px', borderRadius: 8, border: '1px solid #edf2f7' }}><span style={{ color: '#718096', fontWeight: 700 }}>{k}: </span><span style={{ color: '#2d3748', fontWeight: 700 }}>{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: 20, borderRadius: 16, background: '#fffaf0', border: '1px solid #feebc8', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Clock size={20} color="#dd6b20" />
                <span style={{ color: '#dd6b20', fontWeight: 800, fontSize: 16 }}>Pending Review</span>
              </div>
              <p style={{ color: '#7b341e', margin: 0, fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>Submitted {selected.submittedAt?.toLocaleDateString()}. Our editors typically review within 2-3 business days. You will be notified once a decision is made.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setSelected(null)} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#4a5568', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Close</button>
              <button onClick={() => handleWithdraw(selected.id)} style={{ padding: '12px 24px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 12, color: '#e53e3e', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>Withdraw Submission</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: 32, right: 32, background: '#1a202c', borderRadius: 12, padding: '16px 24px', color: '#fff', fontSize: 15, fontWeight: 700, zIndex: 300, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>{toast}</div>}
    </DashboardLayout>
  );
}
