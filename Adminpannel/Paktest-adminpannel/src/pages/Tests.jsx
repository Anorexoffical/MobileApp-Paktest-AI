import React, { useState } from 'react';
import { FaPlus, FaSearch, FaPencilAlt, FaTrash, FaTimes, FaFlask } from 'react-icons/fa';
import '../styles/admin.css';

const CATEGORIES = ['Finance', 'Healthcare', 'Education', 'Administration', 'General', 'Medical', 'Engineering'];

const initTests = [
  { id: 1, name: 'PPSC',    full_name: 'Punjab Public Service Commission',   category: 'Finance',        positions: 8,  active: true },
  { id: 2, name: 'FPSC',    full_name: 'Federal Public Service Commission',  category: 'Healthcare',     positions: 5,  active: true },
  { id: 3, name: 'NTS',     full_name: 'National Testing Service',           category: 'Education',      positions: 6,  active: true },
  { id: 4, name: 'CSS/PMS', full_name: 'Competitive Civil Services',         category: 'Administration', positions: 4,  active: true },
  { id: 5, name: 'GAT',     full_name: 'Graduate Assessment Test',           category: 'General',        positions: 3,  active: true },
  { id: 6, name: 'MCAT',    full_name: 'Medical College Admission Test',     category: 'Medical',        positions: 2,  active: true },
];

const empty = { name: '', full_name: '', description: '', category: '', active: true };

export default function Tests() {
  const [tests, setTests]       = useState(initTests);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(empty);
  const [editId, setEditId]     = useState(null);
  const [delId, setDelId]       = useState(null);

  const filtered = tests.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = t  => { setForm({ name: t.name, full_name: t.full_name, description: t.description || '', category: t.category, active: t.active }); setEditId(t.id); setModal(true); };

  const handleSave = () => {
    if (!form.name || !form.full_name || !form.category) return;
    if (editId) {
      setTests(tests.map(t => t.id === editId ? { ...t, ...form } : t));
    } else {
      setTests([...tests, { id: Date.now(), ...form, positions: 0 }]);
    }
    setModal(false);
  };

  const confirmDelete = () => {
    setTests(tests.filter(t => t.id !== delId));
    setDelId(null);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🏛️ Test Categories</h1>
          <p className="page-subtitle">Manage exam categories shown in the mobile app (PPSC, FPSC, NTS…)</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Test</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-card"><div className="stat-card-icon teal"><FaFlask /></div><div className="stat-card-value">{tests.length}</div><div className="stat-card-label">Total Tests</div></div>
        <div className="stat-card"><div className="stat-card-icon success"><FaFlask /></div><div className="stat-card-value">{tests.filter(t=>t.active).length}</div><div className="stat-card-label">Active</div></div>
        <div className="stat-card"><div className="stat-card-icon purple"><FaFlask /></div><div className="stat-card-value">{tests.reduce((a,t)=>a+t.positions,0)}</div><div className="stat-card-label">Total Positions</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Test Categories</span>
          <div className="toolbar">
            <div className="search-box">
              <FaSearch className="search-icon-abs" />
              <input placeholder="Search tests…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Full Name</th>
                <th>Category</th>
                <th>Positions</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">🔍</div><h3>No tests found</h3><p>Try adjusting your search</p></div></td></tr>
              )}
              {filtered.map((t, i) => (
                <tr key={t.id}>
                  <td><span className="row-num">{i+1}</span></td>
                  <td><span className="badge badge-teal">{t.name}</span></td>
                  <td><strong>{t.full_name}</strong></td>
                  <td><span className="badge badge-gray">{t.category}</span></td>
                  <td>{t.positions} positions</td>
                  <td><span className={`badge ${t.active ? 'badge-success' : 'badge-gray'}`}>{t.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="col-actions">
                    <div className="actions-cell">
                      <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(t)} title="Edit"><FaPencilAlt /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDelId(t.id)} title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Test' : 'Add New Test'}</h3>
              <button className="modal-close" onClick={()=>setModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Short Name <span className="req">*</span></label>
                  <input className="form-control" placeholder="e.g. PPSC" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category <span className="req">*</span></label>
                  <select className="form-control" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Full Name <span className="req">*</span></label>
                  <input className="form-control" placeholder="e.g. Punjab Public Service Commission" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} />
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" placeholder="Brief description…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.active} onChange={e=>setForm({...form,active:e.target.value==='true'})}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Create Test'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {delId && (
        <div className="modal-overlay" onClick={()=>setDelId(null)}>
          <div className="modal confirm-dialog" onClick={e=>e.stopPropagation()}>
            <div className="modal-body" style={{textAlign:'center',padding:32}}>
              <div className="confirm-icon">🗑️</div>
              <h3>Delete Test?</h3>
              <p>This will remove the test category and all linked data from the app.</p>
            </div>
            <div className="modal-footer" style={{justifyContent:'center'}}>
              <button className="btn btn-outline" onClick={()=>setDelId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
