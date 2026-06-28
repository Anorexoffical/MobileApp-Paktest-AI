import React, { useState } from 'react';
import { FaPlus, FaSearch, FaPencilAlt, FaTrash, FaTimes, FaTags } from 'react-icons/fa';
import '../styles/admin.css';

const POSITIONS = ['Accountant','Senior Secondary Teacher','Lecturer Computer Science','Assistant Director','Medical Officer','Sub-Inspector'];
const SUBJECTS  = ['General Knowledge','English','Mathematics','Pakistan Studies','Current Affairs','Computer Science','Accounting','Education','Islamic Studies','Urdu'];

const initTopics = [
  { id:1,  name:'Company Law',          position:'Accountant',                subject:'Accounting',         questions:24 },
  { id:2,  name:'Cost Accounting',      position:'Accountant',                subject:'Accounting',         questions:18 },
  { id:3,  name:'Financial Statements', position:'Accountant',                subject:'Accounting',         questions:30 },
  { id:4,  name:'Grammar',              position:'Senior Secondary Teacher',  subject:'English',            questions:45 },
  { id:5,  name:'Constitution of 1973', position:'Senior Secondary Teacher',  subject:'Pakistan Studies',   questions:20 },
  { id:6,  name:'Object Oriented Programming', position:'Lecturer Computer Science', subject:'Computer Science', questions:36 },
  { id:7,  name:'Database Management', position:'Lecturer Computer Science',  subject:'Computer Science',   questions:28 },
  { id:8,  name:'Current Affairs',      position:'Sub-Inspector',            subject:'General Knowledge',  questions:50 },
];

const empty = { name:'', position:'', subject:'', description:'' };

export default function Topics() {
  const [topics, setTopics]       = useState(initTopics);
  const [search, setSearch]       = useState('');
  const [filterPos, setFilterPos] = useState('');
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(empty);
  const [editId, setEditId]       = useState(null);
  const [delId, setDelId]         = useState(null);

  const filtered = topics.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterPos ? t.position === filterPos : true)
  );

  const openAdd  = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = t  => { setForm({name:t.name,position:t.position,subject:t.subject,description:t.description||''}); setEditId(t.id); setModal(true); };

  const handleSave = () => {
    if (!form.name) return;
    if (editId) {
      setTopics(topics.map(t => t.id===editId ? {...t,...form} : t));
    } else {
      setTopics([...topics, { id:Date.now(), ...form, questions:0 }]);
    }
    setModal(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🏷️ Topics</h1>
          <p className="page-subtitle">Subject topics linked to positions — used to organise quiz questions in the app</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Topic</button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-card"><div className="stat-card-icon teal"><FaTags /></div><div className="stat-card-value">{topics.length}</div><div className="stat-card-label">Total Topics</div></div>
        <div className="stat-card"><div className="stat-card-icon purple"><FaTags /></div><div className="stat-card-value">{topics.reduce((a,t)=>a+t.questions,0)}</div><div className="stat-card-label">Total Questions</div></div>
        <div className="stat-card"><div className="stat-card-icon warn"><FaTags /></div><div className="stat-card-value">{[...new Set(topics.map(t=>t.position))].length}</div><div className="stat-card-label">Positions Covered</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Topics</span>
          <div className="toolbar">
            <div className="search-box">
              <FaSearch className="search-icon-abs" />
              <input placeholder="Search topics…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterPos} onChange={e=>setFilterPos(e.target.value)}>
              <option value="">All Positions</option>
              {POSITIONS.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Topic Name</th><th>Position</th><th>Subject</th><th>Questions</th><th className="col-actions">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length===0 && <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">🏷️</div><h3>No topics found</h3><p>Add topics to organise your question bank</p><button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Topic</button></div></td></tr>}
              {filtered.map((t,i) => (
                <tr key={t.id}>
                  <td><span className="row-num">{i+1}</span></td>
                  <td><strong>{t.name}</strong></td>
                  <td><span className="badge badge-purple">{t.position}</span></td>
                  <td><span className="badge badge-teal">{t.subject}</span></td>
                  <td><strong style={{color:'var(--teal)'}}>{t.questions}</strong></td>
                  <td className="col-actions">
                    <div className="actions-cell">
                      <button className="btn btn-outline btn-sm btn-icon" onClick={()=>openEdit(t)}><FaPencilAlt /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={()=>setDelId(t.id)}><FaTrash /></button>
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
              <h3>{editId ? 'Edit Topic' : 'Add Topic'}</h3>
              <button className="modal-close" onClick={()=>setModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group form-full">
                  <label className="form-label">Topic Name <span className="req">*</span></label>
                  <input className="form-control" placeholder="e.g. Company Law" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <select className="form-control" value={form.position} onChange={e=>setForm({...form,position:e.target.value})}>
                    <option value="">Select position</option>
                    {POSITIONS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select className="form-control" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" placeholder="What this topic covers…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Add Topic'}</button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="modal-overlay" onClick={()=>setDelId(null)}>
          <div className="modal confirm-dialog" onClick={e=>e.stopPropagation()}>
            <div className="modal-body" style={{textAlign:'center',padding:32}}>
              <div className="confirm-icon">🗑️</div>
              <h3>Delete Topic?</h3>
              <p>Questions linked to this topic will lose their topic tag.</p>
            </div>
            <div className="modal-footer" style={{justifyContent:'center'}}>
              <button className="btn btn-outline" onClick={()=>setDelId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={()=>{setTopics(topics.filter(t=>t.id!==delId));setDelId(null);}}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
