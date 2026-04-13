import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChartCard from '../components/ChartCard';
import { mockUsers } from '../lib/mockData';
import { Plus, Search, MoreHorizontal, Edit, Trash2, UserCheck, UserX, Filter, X } from 'lucide-react';

const Badge = ({ children, style }) => (
  <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, ...style }}>{children}</span>
);

const Input = ({ style, ...props }) => (
  <input style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', '&:focus': { borderColor: '#FF8C00' }, ...style }} {...props} />
);

const Select = ({ value, onChange, children, style }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', color: '#1a202c', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', transition: 'border-color 0.2s', ...style }}>
    {children}
  </select>
);

const Btn = ({ children, onClick, style, variant = 'primary' }) => {
  const base = { padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' };
  const variants = {
    primary: { background: '#FF8C00', color: '#fff', boxShadow: '0 4px 10px rgba(255,140,0,0.2)' },
    outline: { background: '#fff', border: '1px solid #e2e8f0', color: '#4a5568' },
    ghost: { background: 'transparent', color: '#718096' },
    danger: { background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7' },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ color: '#1a202c', margin: 0, fontSize: 22, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 4 }}><X size={24} /></button>
        </div>
        {children}
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>{footer}</div>}
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#4a5568', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    {children}
  </div>
);

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'viewer', status: 'active' });

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const resetForm = () => setForm({ name: '', email: '', role: 'viewer', status: 'active' });

  const handleAdd = () => {
    setUsers([{ id: String(Date.now()), ...form, avatar: form.name.split(' ').map(n => n[0]).join('').toUpperCase(), createdAt: new Date() }, ...users]);
    setIsAddOpen(false); resetForm();
  };

  const handleEdit = () => {
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...form } : u));
    setIsEditOpen(false); setSelectedUser(null); resetForm();
  };

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setIsDeleteOpen(false); setSelectedUser(null);
  };

  const openEdit = (user) => { setSelectedUser(user); setForm({ name: user.name, email: user.email, role: user.role, status: user.status }); setIsEditOpen(true); };
  const openDelete = (user) => { setSelectedUser(user); setIsDeleteOpen(true); };
  const toggleStatus = (id) => setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));

  const statusColor = (s) => s === 'active' ? { bg: '#f0fff4', color: '#38a169' } : s === 'inactive' ? { bg: '#fffaf0', color: '#dd6b20' } : { bg: '#fff5f5', color: '#e53e3e' };

  return (
    <DashboardLayout role="admin">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 24, marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1a202c', margin: 0, letterSpacing: '-0.02em' }}>User Management</h2>
            <p style={{ color: '#718096', margin: '4px 0 0', fontSize: 15, fontWeight: 500 }}>Manage and oversee all platform users</p>
          </div>
          <Btn onClick={() => setIsAddOpen(true)}><Plus size={20} /> Add User</Btn>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <Input placeholder="Search by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: 44, boxSizing: 'border-box' }} />
          </div>
          <Select value={roleFilter} onChange={setRoleFilter} style={{ minWidth: 130 }}>
            <option value="all">All Roles</option>
            {['admin','editor','seller','buyer','viewer'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
          </Select>
          <Select value={statusFilter} onChange={setStatusFilter} style={{ minWidth: 130 }}>
            <option value="all">All Status</option>
            {['active','inactive','suspended'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </Select>
        </div>

        {/* Table */}
        <ChartCard title={`Users (${filtered.length})`}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                  {['User','Role','Status','Joined','Actions'].map(h => (
                    <th key={h} style={{ padding: '16px', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: 13, fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => {
                  const sc = statusColor(user.status);
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f7fafc', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #FF8C00, #ed8936)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>{user.avatar}</div>
                          <div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#1a202c', margin: 0 }}>{user.name}</p>
                            <p style={{ fontSize: 13, color: '#718096', margin: 0 }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}><Badge style={{ background: '#f7fafc', color: '#4a5568', textTransform: 'capitalize' }}>{user.role}</Badge></td>
                      <td style={{ padding: '16px' }}><Badge style={{ background: sc.bg, color: sc.color }}>{user.status}</Badge></td>
                      <td style={{ padding: '16px', fontSize: 14, color: '#718096', fontWeight: 500 }}>{user.createdAt.toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                          <Btn variant="ghost" onClick={() => openEdit(user)} style={{ padding: '6px 8px' }}><Edit size={16} /></Btn>
                          <Btn variant="ghost" onClick={() => toggleStatus(user.id)} style={{ padding: '6px 8px' }}>
                            {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                          </Btn>
                          <Btn variant="ghost" onClick={() => openDelete(user)} style={{ padding: '6px 8px', color: '#e53e3e', background: '#fff5f5' }}><Trash2 size={18} /></Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* Add Modal */}
      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New User"
        footer={[<Btn key="c" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Btn>, <Btn key="a" onClick={handleAdd}>Add User</Btn>]}>
        <Field label="Full Name"><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" style={{ width: '100%', boxSizing: 'border-box' }} /></Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" style={{ width: '100%', boxSizing: 'border-box' }} /></Field>
        <Field label="Role"><Select value={form.role} onChange={v => setForm({...form, role: v})} style={{ width: '100%' }}>{['admin','editor','seller','buyer','viewer'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}</Select></Field>
        <Field label="Status"><Select value={form.status} onChange={v => setForm({...form, status: v})} style={{ width: '100%' }}>{['active','inactive','suspended'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</Select></Field>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit User"
        footer={[<Btn key="c" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Btn>, <Btn key="s" onClick={handleEdit}>Save Changes</Btn>]}>
        <Field label="Full Name"><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></Field>
        <Field label="Role"><Select value={form.role} onChange={v => setForm({...form, role: v})} style={{ width: '100%' }}>{['admin','editor','seller','buyer','viewer'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}</Select></Field>
        <Field label="Status"><Select value={form.status} onChange={v => setForm({...form, status: v})} style={{ width: '100%' }}>{['active','inactive','suspended'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</Select></Field>
      </Modal>

      {/* Delete Modal */}
      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete User"
        footer={[<Btn key="c" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Btn>, <Btn key="d" variant="danger" onClick={handleDelete}>Delete</Btn>]}>
        <p style={{ color: '#4a5568', margin: 0, fontSize: 16 }}>Are you sure you want to delete <b>{selectedUser?.name}</b>? This action cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
}
