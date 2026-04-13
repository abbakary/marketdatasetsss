export default function ChartCard({ title, children, action, style }) {
  return (
    <div style={{
      borderRadius: 16, 
      background: '#fff', 
      padding: '24px', 
      border: '1px solid #edf2f7',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 20 
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2d3748', margin: 0 }}>{title}</h3>
        {action}
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
