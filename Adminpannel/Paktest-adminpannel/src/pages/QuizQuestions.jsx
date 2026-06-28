import React, { useState } from 'react';
import { FaPlus, FaSearch, FaPencilAlt, FaTrash, FaTimes, FaQuestionCircle } from 'react-icons/fa';
import '../styles/admin.css';

const SUBJECTS    = ['General Knowledge','English','Mathematics','Pakistan Studies','Current Affairs','Computer Science','Accounting','Education','Islamic Studies','Urdu'];
const DIFFICULTIES = ['Easy','Medium','Hard'];
const TESTS       = ['PPSC','FPSC','NTS','CSS/PMS','GAT','MCAT'];

const initQs = [
  { id:1, subject:'General Knowledge', difficulty:'Easy',   test:'PPSC', topic:'Pakistan Studies', question:'What is the capital city of Pakistan?',           opt_a:'Lahore', opt_b:'Karachi', opt_c:'Islamabad', opt_d:'Peshawar', correct:'C', explanation:'Islamabad has been the capital of Pakistan since 1966.' },
  { id:2, subject:'English',           difficulty:'Medium', test:'FPSC', topic:'Grammar',          question:"Which sentence is grammatically correct?",          opt_a:"She don't know", opt_b:"She doesn't knows", opt_c:"She doesn't know", opt_d:"She not know", correct:'C', explanation:"The correct third person singular form uses 'doesn't' + base verb." },
  { id:3, subject:'Mathematics',       difficulty:'Hard',   test:'NTS',  topic:'Algebra',          question:'If 3x + 7 = 22, what is the value of x?',          opt_a:'3', opt_b:'4', opt_c:'5', opt_d:'6', correct:'C', explanation:'3x = 15, so x = 5.' },
  { id:4, subject:'Pakistan Studies',  difficulty:'Easy',   test:'PPSC', topic:'Geography',        question:'Which is the largest province of Pakistan by area?',opt_a:'Punjab', opt_b:'Sindh', opt_c:'KPK', opt_d:'Balochistan', correct:'D', explanation:'Balochistan covers about 44% of Pakistan\'s total area.' },
];

const emptyQ = { subject:'', difficulty:'Easy', test:'', topic:'', question:'', opt_a:'', opt_b:'', opt_c:'', opt_d:'', correct:'A', explanation:'' };

const diffBadge = d => ({ Easy:'badge-success', Medium:'badge-warning', Hard:'badge-danger' }[d] || 'badge-gray');
const OPTS = ['A','B','C','D'];

export default function QuizQuestions() {
  const [questions, setQuestions] = useState(initQs);
  const [search, setSearch]       = useState('');
  const [filterSubj, setFilterSubj] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterTest, setFilterTest] = useState('');
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(emptyQ);
  const [editId, setEditId]       = useState(null);
  const [delId, setDelId]         = useState(null);
  const [viewQ, setViewQ]         = useState(null);

  const filtered = questions.filter(q =>
    (q.question.toLowerCase().includes(search.toLowerCase()) || q.topic.toLowerCase().includes(search.toLowerCase())) &&
    (filterSubj ? q.subject === filterSubj : true) &&
    (filterDiff ? q.difficulty === filterDiff : true) &&
    (filterTest ? q.test === filterTest : true)
  );

  const openAdd  = () => { setForm(emptyQ); setEditId(null); setModal(true); };
  const openEdit = q  => { setForm({...q}); setEditId(q.id); setModal(true); };

  const handleSave = () => {
    if (!form.question || !form.opt_a || !form.opt_b || !form.opt_c || !form.opt_d) return;
    if (editId) {
      setQuestions(questions.map(q => q.id===editId ? {...q,...form} : q));
    } else {
      setQuestions([...questions, { id:Date.now(), ...form }]);
    }
    setModal(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">❓ Quiz Questions</h1>
          <p className="page-subtitle">MCQ bank powering tests, mock papers, and the daily challenge in the mobile app</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Question</button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-card"><div className="stat-card-icon purple"><FaQuestionCircle /></div><div className="stat-card-value">{questions.length}</div><div className="stat-card-label">Total Questions</div></div>
        <div className="stat-card"><div className="stat-card-icon success"><FaQuestionCircle /></div><div className="stat-card-value">{questions.filter(q=>q.difficulty==='Easy').length}</div><div className="stat-card-label">Easy</div></div>
        <div className="stat-card"><div className="stat-card-icon warn"><FaQuestionCircle /></div><div className="stat-card-value">{questions.filter(q=>q.difficulty==='Medium').length}</div><div className="stat-card-label">Medium</div></div>
        <div className="stat-card"><div className="stat-card-icon danger"><FaQuestionCircle /></div><div className="stat-card-value">{questions.filter(q=>q.difficulty==='Hard').length}</div><div className="stat-card-label">Hard</div></div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Question Bank</span>
          <div className="toolbar">
            <div className="search-box">
              <FaSearch className="search-icon-abs" />
              <input placeholder="Search questions or topics…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterTest} onChange={e=>setFilterTest(e.target.value)}>
              <option value="">All Tests</option>
              {TESTS.map(t=><option key={t}>{t}</option>)}
            </select>
            <select className="filter-select" value={filterSubj} onChange={e=>setFilterSubj(e.target.value)}>
              <option value="">All Subjects</option>
              {SUBJECTS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="filter-select" value={filterDiff} onChange={e=>setFilterDiff(e.target.value)}>
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Subject</th><th>Topic</th><th>Test</th><th>Difficulty</th><th style={{minWidth:260}}>Question</th><th>Answer</th><th className="col-actions">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length===0 && <tr><td colSpan={8}><div className="empty-state"><div className="empty-state-icon">❓</div><h3>No questions found</h3><p>Add questions to build your MCQ bank</p><button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Question</button></div></td></tr>}
              {filtered.map((q,i) => (
                <tr key={q.id}>
                  <td><span className="row-num">{i+1}</span></td>
                  <td><span className="badge badge-gray">{q.subject}</span></td>
                  <td>{q.topic}</td>
                  <td><span className="badge badge-teal">{q.test || '—'}</span></td>
                  <td><span className={`badge ${diffBadge(q.difficulty)}`}>{q.difficulty}</span></td>
                  <td>
                    <div className="q-text" style={{maxWidth:260}} title={q.question}>{q.question}</div>
                  </td>
                  <td>
                    <span className="badge badge-success" style={{minWidth:28,justifyContent:'center'}}>{q.correct}</span>
                  </td>
                  <td className="col-actions">
                    <div className="actions-cell">
                      <button className="btn btn-outline btn-sm btn-icon" title="Preview" onClick={()=>setViewQ(q)}>👁</button>
                      <button className="btn btn-outline btn-sm btn-icon" onClick={()=>openEdit(q)}><FaPencilAlt /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={()=>setDelId(q.id)}><FaTrash /></button>
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
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Question' : 'Add Question'}</h3>
              <button className="modal-close" onClick={()=>setModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Subject <span className="req">*</span></label>
                  <select className="form-control" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Test</label>
                  <select className="form-control" value={form.test} onChange={e=>setForm({...form,test:e.target.value})}>
                    <option value="">Select test</option>
                    {TESTS.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <input className="form-control" placeholder="e.g. Pakistan Studies" value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-control" value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}>
                    {DIFFICULTIES.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group form-full">
                  <label className="form-label">Question Text <span className="req">*</span></label>
                  <textarea className="form-control" placeholder="Write the question here…" rows={3} value={form.question} onChange={e=>setForm({...form,question:e.target.value})} />
                </div>
              </div>

              <p className="form-section-title">Answer Options</p>
              <div className="options-grid">
                {OPTS.map(opt => (
                  <div key={opt} className={`option-input ${form.correct===opt ? 'correct' : ''}`} onClick={()=>setForm({...form,correct:opt})}>
                    <div className="option-label-char">{opt}</div>
                    <input
                      className="form-control"
                      style={{border:'none',padding:'4px 0',boxShadow:'none'}}
                      placeholder={`Option ${opt}`}
                      value={form[`opt_${opt.toLowerCase()}`]}
                      onChange={e=>setForm({...form,[`opt_${opt.toLowerCase()}`]:e.target.value})}
                      onClick={ev=>ev.stopPropagation()}
                    />
                    {form.correct===opt && <span style={{color:'var(--success)',fontSize:16,marginLeft:4}}>✓</span>}
                  </div>
                ))}
              </div>
              <p className="form-hint" style={{marginTop:8}}>👆 Click an option row to mark it as the correct answer</p>

              <p className="form-section-title" style={{marginTop:20}}>Explanation (Optional)</p>
              <div className="form-group">
                <textarea className="form-control" placeholder="Explain why the correct answer is right…" rows={2} value={form.explanation} onChange={e=>setForm({...form,explanation:e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Add Question'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {viewQ && (
        <div className="modal-overlay" onClick={()=>setViewQ(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Question Preview</h3>
              <button className="modal-close" onClick={()=>setViewQ(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
                <span className="badge badge-gray">{viewQ.subject}</span>
                <span className={`badge ${diffBadge(viewQ.difficulty)}`}>{viewQ.difficulty}</span>
                {viewQ.test && <span className="badge badge-teal">{viewQ.test}</span>}
              </div>
              <p style={{fontSize:16,fontWeight:700,color:'var(--text)',marginBottom:20,lineHeight:1.5}}>{viewQ.question}</p>
              {OPTS.map(opt => (
                <div key={opt} style={{display:'flex',gap:10,alignItems:'center',padding:'10px 14px',borderRadius:8,marginBottom:8,
                  background: viewQ.correct===opt ? 'var(--success-light)' : 'var(--cream)',
                  border: `1px solid ${viewQ.correct===opt ? 'var(--success)' : 'var(--border)'}`,
                  fontWeight: viewQ.correct===opt ? 700 : 400,
                  color: viewQ.correct===opt ? '#065f46' : 'var(--text-mid)'}}>
                  <div style={{width:24,height:24,borderRadius:6,background:viewQ.correct===opt?'var(--success)':'var(--teal)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{opt}</div>
                  {viewQ[`opt_${opt.toLowerCase()}`]}
                  {viewQ.correct===opt && <span style={{marginLeft:'auto'}}>✓</span>}
                </div>
              ))}
              {viewQ.explanation && <div style={{marginTop:16,padding:14,background:'var(--purple-light)',borderRadius:8,fontSize:13,color:'var(--text-mid)',lineHeight:1.5}}><strong style={{color:'var(--teal)'}}>💡 Explanation: </strong>{viewQ.explanation}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={()=>{setViewQ(null);openEdit(viewQ);}}>Edit This Question</button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="modal-overlay" onClick={()=>setDelId(null)}>
          <div className="modal confirm-dialog" onClick={e=>e.stopPropagation()}>
            <div className="modal-body" style={{textAlign:'center',padding:32}}>
              <div className="confirm-icon">🗑️</div>
              <h3>Delete Question?</h3>
              <p>This question will be permanently removed from all linked tests.</p>
            </div>
            <div className="modal-footer" style={{justifyContent:'center'}}>
              <button className="btn btn-outline" onClick={()=>setDelId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={()=>{setQuestions(questions.filter(q=>q.id!==delId));setDelId(null);}}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
