import React, { useState } from 'react';
import { FaPlus, FaSearch, FaPencilAlt, FaTrash, FaTimes, FaBriefcase } from 'react-icons/fa';
import '../styles/admin.css';

const TESTS = ['PPSC', 'FPSC', 'NTS', 'CSS/PMS', 'GAT', 'MCAT'];
const BPS   = ['BPS-14','BPS-15','BPS-16','BPS-17','BPS-18','BPS-19','BPS-20'];

const initPositions = [
  { id:1, title:'Accountant',              department:'Finance Department',       test:'PPSC', bps:'BPS-16', seats:42,  description:'Responsible for maintaining financial records and audits.' },
  { id:2, title:'Senior Secondary Teacher',department:'School Education Dept',    test:'PPSC', bps:'BPS-16', seats:156, description:'Teaching position for SST in Government Schools.' },
  { id:3, title:'Lecturer Computer Science',department:'Higher Education Dept',   test:'PPSC', bps:'BPS-17', seats:80,  description:'Teach computer science at degree colleges.' },
  { id:4, title:'Assistant Director',      department:'Federal Investigation Agency',test:'FPSC',bps:'BPS-17',seats:30, description:'Investigative and administrative role in FIA.' },
  { id:5, title:'Medical Officer',         department:'Primary & Secondary Health',test:'FPSC', bps:'BPS-17', seats:200, description:'Provide primary healthcare services.' },
  { id:6, title:'Sub-Inspector',           department:'Punjab Police',             test:'PPSC', bps:'BPS-14', seats:500, description:'Maintain law and order.' },
];

const empty = { title:'', department:'', test:'', bps:'', seats:'', description:'' };

export default function Positions() {
  const [positions, setPositions] = useState(initPositions);
  const [search, setSearch]       = useState('');
  const [filterTest, setFilterTest] = useState('');
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(empty);
  const [editId, setEditId]       = useState(null);
  const [delId, setDelId]         = useState(null);

  const filtered = positions.filter(p =>
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.department.toLowerCase().includes(search.toLowerCase())) &&
    (filterTest ? p.test === filterTest : true)
  );

  const openAdd  = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = p  => { setForm({title:p.title,department:p.department,test:p.test,bps:p.bps,seats:p.seats,description:p.description||''}); setEditId(p.id); setModal(true); };

  const handleSave = () => {
    if (!form.title || !form.test || !form.bps) return;
    if (editId) {
      setPositions(positions.map(p => p.id===editId ? {...p,...form,seats:Number(form.seats)} : p));
    } else {
      setPositions([...positions, { id:Date.now(), ...form, seats:Number(form.seats) }]);
    }
    setModal(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">💼 Positions</h1>
          <p className="page-subtitle">Job positions linked to tests — shown in the mobile app's Job Portal</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Position</button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-card"><div className="stat-card-icon purple"><FaBriefcase /></div><div className="stat-card-value">{positions.length}</div><div className="stat-card-label">Total Positions</div></div>
        <div className="stat-card"><div className="stat-card-icon teal"><FaBriefcase /></div><div className="stat-card-value">{positions.filter(p=>p.test==='PPSC').length}</div><div className="stat-card-label">PPSC</div></div>
        <div className="stat-card"><div className="stat-card-icon warn"><FaBriefcase /></div><div className="stat-card-value">{positions.filter(p=>p.test==='FPSC').length}</div><div className="stat-card-label">FPSC</div></div>
        <div className="stat-card"><div className="stat-card-icon success"><FaBriefcase /></div><div className="stat-card-value">{positions.reduce((a,p)=>a+(Number(p.seats)||0),0)}</div><div className="stat-card-label">Total Seats</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Positions</span>
          <div className="toolbar">
            <div className="search-box">
              <FaSearch className="search-icon-abs" />
              <input placeholder="Search positions…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterTest} onChange={e=>setFilterTest(e.target.value)}>
              <option value="">All Tests</option>
              {TESTS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Title</th><th>Department</th><th>Test</th><th>BPS Level</th><th>Seats</th><th className="col-actions">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length===0 && <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">💼</div><h3>No positions found</h3><p>Add your first position to get started</p><button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Position</button></div></td></tr>}
              {filtered.map((p,i) => (
                <tr key={p.id}>
                  <td><span className="row-num">{i+1}</span></td>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.department}</td>
                  <td><span className="badge badge-teal">{p.test}</span></td>
                  <td><span className="badge badge-dark">{p.bps}</span></td>
                  <td>{p.seats || '—'}</td>
                  <td className="col-actions">
                    <div className="actions-cell">
                      <button className="btn btn-outline btn-sm btn-icon" onClick={()=>openEdit(p)}><FaPencilAlt /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={()=>setDelId(p.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Position' : 'Add Position'}</h3>
              <button className="modal-close" onClick={()=>setModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group form-full">
                  <label className="form-label">Position Title <span className="req">*</span></label>
                  <input className="form-control" placeholder="e.g. Accountant" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Department</label>
                  <input className="form-control" placeholder="e.g. Finance Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Test <span className="req">*</span></label>
                  <select className="form-control" value={form.test} onChange={e=>setForm({...form,test:e.target.value})}>
                    <option value="">Select test</option>
                    {TESTS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">BPS Level <span className="req">*</span></label>
                  <select className="form-control" value={form.bps} onChange={e=>setForm({...form,bps:e.target.value})}>
                    <option value="">Select BPS</option>
                    {BPS.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Available Seats</label>
                  <input className="form-control" type="number" min="0" placeholder="e.g. 42" value={form.seats} onChange={e=>setForm({...form,seats:e.target.value})} />
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" placeholder="Brief job description…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Add Position'}</button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="modal-overlay" onClick={()=>setDelId(null)}>
          <div className="modal confirm-dialog" onClick={e=>e.stopPropagation()}>
            <div className="modal-body" style={{textAlign:'center',padding:32}}>
              <div className="confirm-icon">🗑️</div>
              <h3>Delete Position?</h3>
              <p>This will permanently remove this position and its linked content from the app.</p>
            </div>
            <div className="modal-footer" style={{justifyContent:'center'}}>
              <button className="btn btn-outline" onClick={()=>setDelId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={()=>{setPositions(positions.filter(p=>p.id!==delId));setDelId(null);}}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
