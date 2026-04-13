import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, icon }) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div style={{
      borderRadius: 16, background: '#fff', 
      padding: '24px', border: '1px solid #edf2f7',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      transition: 'transform 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#718096', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: '8px 0 0', letterSpacing: '-0.02em' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 14, fontWeight: 600,
              color: isPositive ? '#38a169' : isNegative ? '#e53e3e' : '#718096',
              padding: '2px 8px', borderRadius: 20, background: isPositive ? '#f0fff4' : isNegative ? '#fff5f5' : '#f7fafc',
              width: 'fit-content'
            }}>
              {isPositive && <TrendingUp size={14} />}
              {isNegative && <TrendingDown size={14} />}
              <span>{isPositive ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div style={{ 
            padding: 12, borderRadius: 12, 
            background: 'linear-gradient(135deg, #20B2AA15, #20B2AA30)', 
            color: '#20B2AA',
            boxShadow: 'inset 0 2px 4px rgba(32,178,170,0.1)'
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
