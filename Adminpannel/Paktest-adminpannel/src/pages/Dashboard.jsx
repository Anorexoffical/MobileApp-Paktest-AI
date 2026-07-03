import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Modal, Form, Badge, Row, Col, 
  Table, ProgressBar, Alert, Container
} from 'react-bootstrap';
import { 
  FiPlus, FiEdit, FiTrash2, FiSearch, FiFolder, 
  FiBook, FiFileText, FiCheckCircle, FiChevronRight,
  FiChevronDown, FiGrid, FiList, FiArrowLeft,
  FiEye, FiX, FiHome, FiBriefcase, FiTag,
  FiBookOpen, FiLayers, FiActivity
} from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { 
  addCategory, updateCategory, deleteCategory,
  addPosition, updatePosition, deletePosition,
  addSubject, updateSubject, deleteSubject,
  addBook, updateBook, deleteBook,
  addChapter, updateChapter, deleteChapter,
  addMcq, updateMcq, deleteMcq
} from '../data/store';

// ── Constants ──────────────────────────────────────────────────────────
const BPS_LEVELS = ['BPS-14', 'BPS-15', 'BPS-16', 'BPS-17', 'BPS-18', 'BPS-19', 'BPS-20'];
const MCQ_OPTIONS = ['A', 'B', 'C', 'D'];

// ── Stat Cards Component ─────────────────────────────────────────────
const StatCards = ({ stats }) => (
  <Row className="g-3 mb-4">
    {stats.map((stat, idx) => (
      <Col md={2} sm={4} xs={6} key={idx}>
        <Card className="shadow-sm h-100" style={{ borderRadius: '12px', border: 'none' }}>
          <Card.Body className="text-center">
            <div style={{ 
              background: stat.bg, 
              padding: '8px', 
              borderRadius: '10px',
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              {stat.icon}
            </div>
            <h5 className="mb-0 fw-bold">{stat.value}</h5>
            <small className="text-muted">{stat.label}</small>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

// ── Hierarchy Tree Component ─────────────────────────────────────────
const HierarchyTree = ({ data, onSelect, selectedId }) => {
  const { categories, positions, subjects, books, chapters, mcqs } = data;
  
  const [expanded, setExpanded] = useState({});
  
  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const getPositionCounts = (posId) => {
    const posSubjects = subjects.filter(s => s.positionId === posId);
    const posBooks = books.filter(b => posSubjects.some(s => s.id === b.subjectId));
    const posChapters = chapters.filter(c => posBooks.some(b => b.id === c.bookId));
    const posMcqs = mcqs.filter(m => posChapters.some(c => c.id === m.chapterId));
    return { subjects: posSubjects.length, books: posBooks.length, chapters: posChapters.length, mcqs: posMcqs.length };
  };
  
  const getSubjectCounts = (subjId) => {
    const subjBooks = books.filter(b => b.subjectId === subjId);
    const subjChapters = chapters.filter(c => subjBooks.some(b => b.id === c.bookId));
    const subjMcqs = mcqs.filter(m => subjChapters.some(c => c.id === m.chapterId));
    return { books: subjBooks.length, chapters: subjChapters.length, mcqs: subjMcqs.length };
  };
  
  const getBookCounts = (bookId) => {
    const bookChapters = chapters.filter(c => c.bookId === bookId);
    const bookMcqs = mcqs.filter(m => bookChapters.some(c => c.id === m.chapterId));
    return { chapters: bookChapters.length, mcqs: bookMcqs.length };
  };
  
  const getChapterMcqs = (chapterId) => mcqs.filter(m => m.chapterId === chapterId).length;
  
  return (
    <div className="hierarchy-tree">
      {categories.map(category => (
        <div key={category.id} className="tree-level-1 mb-3">
          <div 
            className={`tree-node d-flex align-items-center p-2 rounded ${selectedId === category.id && selectedId === 'category' ? 'bg-primary text-white' : 'bg-light'}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect('category', category.id)}
          >
            <span className="me-2" style={{ fontSize: '1.5rem' }}>{category.icon || '🏛️'}</span>
            <span className="fw-bold flex-grow-1">{category.name}</span>
            <Badge bg="secondary" className="me-2">{positions.filter(p => p.testConductBody === category.id).length} Positions</Badge>
            <Button 
              variant="link" 
              size="sm" 
              className="text-decoration-none p-0"
              onClick={(e) => { e.stopPropagation(); toggleExpand(category.id); }}
            >
              {expanded[category.id] ? <FiChevronDown /> : <FiChevronRight />}
            </Button>
          </div>
          
          {expanded[category.id] && (
            <div className="tree-children ms-4 mt-2">
              {positions.filter(p => p.testConductBody === category.id).map(position => {
                const counts = getPositionCounts(position.id);
                return (
                  <div key={position.id} className="tree-level-2 mb-2">
                    <div 
                      className={`tree-node d-flex align-items-center p-2 rounded ${selectedId === position.id && selectedId === 'position' ? 'bg-primary text-white' : 'bg-light'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => onSelect('position', position.id)}
                    >
                      <span className="me-2"><FiBriefcase /></span>
                      <span className="flex-grow-1">{position.title}</span>
                      <Badge bg="info" className="me-1">{position.bpsLevel}</Badge>
                      <Badge bg="secondary" className="me-2">{counts.subjects} Subjects</Badge>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-decoration-none p-0"
                        onClick={(e) => { e.stopPropagation(); toggleExpand(position.id); }}
                      >
                        {expanded[position.id] ? <FiChevronDown /> : <FiChevronRight />}
                      </Button>
                    </div>
                    
                    {expanded[position.id] && (
                      <div className="tree-children ms-4 mt-2">
                        {subjects.filter(s => s.positionId === position.id).map(subject => {
                          const counts = getSubjectCounts(subject.id);
                          return (
                            <div key={subject.id} className="tree-level-3 mb-2">
                              <div 
                                className={`tree-node d-flex align-items-center p-2 rounded ${selectedId === subject.id && selectedId === 'subject' ? 'bg-primary text-white' : 'bg-light'}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => onSelect('subject', subject.id)}
                              >
                                <span className="me-2"><FiTag /></span>
                                <span className="flex-grow-1">{subject.name}</span>
                                <Badge bg="secondary" className="me-2">{counts.books} Books</Badge>
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="text-decoration-none p-0"
                                  onClick={(e) => { e.stopPropagation(); toggleExpand(subject.id); }}
                                >
                                  {expanded[subject.id] ? <FiChevronDown /> : <FiChevronRight />}
                                </Button>
                              </div>
                              
                              {expanded[subject.id] && (
                                <div className="tree-children ms-4 mt-2">
                                  {books.filter(b => b.subjectId === subject.id).map(book => {
                                    const counts = getBookCounts(book.id);
                                    return (
                                      <div key={book.id} className="tree-level-4 mb-2">
                                        <div 
                                          className={`tree-node d-flex align-items-center p-2 rounded ${selectedId === book.id && selectedId === 'book' ? 'bg-primary text-white' : 'bg-light'}`}
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => onSelect('book', book.id)}
                                        >
                                          <span className="me-2"><FiBook /></span>
                                          <span className="flex-grow-1">{book.title}</span>
                                          <Badge bg="secondary" className="me-2">{counts.chapters} Chapters</Badge>
                                          <Button 
                                            variant="link" 
                                            size="sm" 
                                            className="text-decoration-none p-0"
                                            onClick={(e) => { e.stopPropagation(); toggleExpand(book.id); }}
                                          >
                                            {expanded[book.id] ? <FiChevronDown /> : <FiChevronRight />}
                                          </Button>
                                        </div>
                                        
                                        {expanded[book.id] && (
                                          <div className="tree-children ms-4 mt-2">
                                            {chapters.filter(c => c.bookId === book.id).map(chapter => {
                                              const mcqCount = getChapterMcqs(chapter.id);
                                              return (
                                                <div key={chapter.id} className="tree-level-5 mb-1">
                                                  <div 
                                                    className={`tree-node d-flex align-items-center p-2 rounded ${selectedId === chapter.id && selectedId === 'chapter' ? 'bg-primary text-white' : 'bg-light'}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => onSelect('chapter', chapter.id)}
                                                  >
                                                    <span className="me-2"><FiLayers /></span>
                                                    <span className="flex-grow-1">{chapter.name}</span>
                                                    <Badge bg="success">{mcqCount} MCQs</Badge>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Detail View Component ────────────────────────────────────────────
const DetailView = ({ type, item, store, onBack, onEdit, onDelete, onNavigate }) => {
  const { categories, positions, subjects, books, chapters, mcqs } = store;
  
  if (!item) return <div className="text-center py-5">Select an item to view details</div>;
  
  const renderCategoryDetail = () => {
    const pos = positions.filter(p => p.testConductBody === item.id);
    const subj = subjects.filter(s => pos.some(p => p.id === s.positionId));
    const bk = books.filter(b => subj.some(s => s.id === b.subjectId));
    const ch = chapters.filter(c => bk.some(b => b.id === c.bookId));
    const m = mcqs.filter(mcq => ch.some(c => c.id === mcq.chapterId));
    
    return (
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold">
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>{item.icon || '🏛️'}</span>
              {item.name}
            </h4>
            <p className="text-muted">{item.fullName}</p>
            {item.description && <p>{item.description}</p>}
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-warning" size="sm" onClick={() => onEdit(item)}>
              <FiEdit /> Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
              <FiTrash2 />
            </Button>
          </div>
        </div>
        
        <Row className="g-3 mb-4">
          <Col md={3}><Card><Card.Body className="text-center"><h5>{pos.length}</h5><small>Positions</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{subj.length}</h5><small>Subjects</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{bk.length}</h5><small>Books</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{m.length}</h5><small>MCQs</small></Card.Body></Card></Col>
        </Row>
        
        <h6 className="fw-bold mb-3">Positions</h6>
        {pos.length === 0 ? (
          <p className="text-muted">No positions added yet.</p>
        ) : (
          <Row className="g-3">
            {pos.map(p => (
              <Col md={4} key={p.id}>
                <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate('position', p.id)}>
                  <Card.Body>
                    <h6 className="fw-bold">{p.title}</h6>
                    <Badge bg="primary">{p.bpsLevel}</Badge>
                    <p className="text-muted small mt-1">{p.department}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };
  
  const renderPositionDetail = () => {
    const subj = subjects.filter(s => s.positionId === item.id);
    const bk = books.filter(b => subj.some(s => s.id === b.subjectId));
    const ch = chapters.filter(c => bk.some(b => b.id === c.bookId));
    const m = mcqs.filter(mcq => ch.some(c => c.id === mcq.chapterId));
    const category = categories.find(c => c.id === item.testConductBody);
    
    return (
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold">{item.title}</h4>
            <div className="d-flex gap-2 mt-1">
              <Badge bg="primary">{item.bpsLevel}</Badge>
              {category && <Badge bg="success">{category.icon} {category.name}</Badge>}
            </div>
            <p className="text-muted mt-1">{item.department}</p>
            {item.description && <p>{item.description}</p>}
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-warning" size="sm" onClick={() => onEdit(item)}>
              <FiEdit /> Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
              <FiTrash2 />
            </Button>
          </div>
        </div>
        
        <Row className="g-3 mb-4">
          <Col md={3}><Card><Card.Body className="text-center"><h5>{subj.length}</h5><small>Subjects</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{bk.length}</h5><small>Books</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{ch.length}</h5><small>Chapters</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{m.length}</h5><small>MCQs</small></Card.Body></Card></Col>
        </Row>
        
        <h6 className="fw-bold mb-3">Subjects</h6>
        {subj.length === 0 ? (
          <p className="text-muted">No subjects added yet.</p>
        ) : (
          <Row className="g-3">
            {subj.map(s => (
              <Col md={4} key={s.id}>
                <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate('subject', s.id)}>
                  <Card.Body>
                    <h6 className="fw-bold">{s.name}</h6>
                    {s.code && <Badge bg="secondary">{s.code}</Badge>}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };
  
  const renderSubjectDetail = () => {
    const bk = books.filter(b => b.subjectId === item.id);
    const ch = chapters.filter(c => bk.some(b => b.id === c.bookId));
    const m = mcqs.filter(mcq => ch.some(c => c.id === mcq.chapterId));
    const position = positions.find(p => p.id === item.positionId);
    
    return (
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold">{item.name}</h4>
            <div className="d-flex gap-2 mt-1">
              {item.code && <Badge bg="secondary">{item.code}</Badge>}
              {position && <Badge bg="info">{position.title}</Badge>}
            </div>
            {item.description && <p className="mt-1">{item.description}</p>}
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-warning" size="sm" onClick={() => onEdit(item)}>
              <FiEdit /> Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
              <FiTrash2 />
            </Button>
          </div>
        </div>
        
        <Row className="g-3 mb-4">
          <Col md={3}><Card><Card.Body className="text-center"><h5>{bk.length}</h5><small>Books</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{ch.length}</h5><small>Chapters</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{m.length}</h5><small>MCQs</small></Card.Body></Card></Col>
        </Row>
        
        <h6 className="fw-bold mb-3">Books</h6>
        {bk.length === 0 ? (
          <p className="text-muted">No books added yet.</p>
        ) : (
          <Row className="g-3">
            {bk.map(b => (
              <Col md={4} key={b.id}>
                <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate('book', b.id)}>
                  <Card.Body>
                    <h6 className="fw-bold">{b.title}</h6>
                    {b.author && <p className="text-muted small">by {b.author}</p>}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };
  
  const renderBookDetail = () => {
    const ch = chapters.filter(c => c.bookId === item.id);
    const m = mcqs.filter(mcq => ch.some(c => c.id === mcq.chapterId));
    const subject = subjects.find(s => s.id === item.subjectId);
    
    return (
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold">{item.title}</h4>
            <div className="d-flex gap-2 mt-1">
              {item.author && <Badge bg="secondary">{item.author}</Badge>}
              {subject && <Badge bg="info">{subject.name}</Badge>}
              {item.pages && <Badge bg="secondary">{item.pages} pages</Badge>}
            </div>
            {item.description && <p className="mt-1">{item.description}</p>}
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-warning" size="sm" onClick={() => onEdit(item)}>
              <FiEdit /> Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
              <FiTrash2 />
            </Button>
          </div>
        </div>
        
        <Row className="g-3 mb-4">
          <Col md={3}><Card><Card.Body className="text-center"><h5>{ch.length}</h5><small>Chapters</small></Card.Body></Card></Col>
          <Col md={3}><Card><Card.Body className="text-center"><h5>{m.length}</h5><small>MCQs</small></Card.Body></Card></Col>
        </Row>
        
        <h6 className="fw-bold mb-3">Chapters</h6>
        {ch.length === 0 ? (
          <p className="text-muted">No chapters added yet.</p>
        ) : (
          <Row className="g-3">
            {ch.map(c => (
              <Col md={4} key={c.id}>
                <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => onNavigate('chapter', c.id)}>
                  <Card.Body>
                    <h6 className="fw-bold">{c.name}</h6>
                    {c.chapterNumber && <Badge bg="secondary">Chapter {c.chapterNumber}</Badge>}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };
  
  const renderChapterDetail = () => {
    const m = mcqs.filter(mcq => mcq.chapterId === item.id);
    const book = books.find(b => b.id === item.bookId);
    
    return (
      <div>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold">{item.name}</h4>
            <div className="d-flex gap-2 mt-1">
              {item.chapterNumber && <Badge bg="secondary">Chapter {item.chapterNumber}</Badge>}
              {book && <Badge bg="info">{book.title}</Badge>}
            </div>
            {item.description && <p className="mt-1">{item.description}</p>}
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-warning" size="sm" onClick={() => onEdit(item)}>
              <FiEdit /> Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
              <FiTrash2 />
            </Button>
          </div>
        </div>
        
        <h6 className="fw-bold mb-3">MCQs ({m.length})</h6>
        {m.length === 0 ? (
          <p className="text-muted">No MCQs added yet.</p>
        ) : (
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Options</th>
                <th>Correct</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {m.map((mcq, idx) => (
                <tr key={mcq.id}>
                  <td>{idx + 1}</td>
                  <td style={{ maxWidth: '300px' }}>{mcq.question}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div>A: {mcq.optionA}</div>
                    <div>B: {mcq.optionB}</div>
                    <div>C: {mcq.optionC}</div>
                    <div>D: {mcq.optionD}</div>
                  </td>
                  <td><Badge bg="success">{mcq.correctAnswer}</Badge></td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-warning" size="sm" onClick={() => onEdit(mcq)}>
                        <FiEdit size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => onDelete(mcq.id)}>
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    );
  };
  
  switch (type) {
    case 'category': return renderCategoryDetail();
    case 'position': return renderPositionDetail();
    case 'subject': return renderSubjectDetail();
    case 'book': return renderBookDetail();
    case 'chapter': return renderChapterDetail();
    default: return null;
  }
};

// ── Quick Add Modal ──────────────────────────────────────────────────
const QuickAddModal = ({ show, onHide, type, onSave, store, editingItem }) => {
  const { categories, positions, subjects, books, chapters } = store;
  const [form, setForm] = useState({});
  
  useEffect(() => {
    if (show) {
      if (editingItem) {
        setForm(editingItem);
      } else {
        setForm(getBlankForm(type));
      }
    }
  }, [show, editingItem, type]);
  
  const getBlankForm = (t) => {
    switch (t) {
      case 'category': return { name: '', fullName: '', description: '', icon: '🏛️' };
      case 'position': return { title: '', description: '', department: '', bpsLevel: '', testConductBody: '' };
      case 'subject': return { name: '', code: '', description: '', totalMarks: '', positionId: '' };
      case 'book': return { title: '', author: '', pages: '', description: '', subjectId: '' };
      case 'chapter': return { name: '', chapterNumber: '', totalMcqs: '', description: '', bookId: '' };
      case 'mcq': return { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '', explanation: '', chapterId: '' };
      default: return {};
    }
  };
  
  const renderForm = () => {
    switch (type) {
      case 'category':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Icon</Form.Label>
              <Form.Control
                value={form.icon || ''}
                onChange={e => setForm({ ...form, icon: e.target.value })}
                placeholder="🏛️"
                style={{ fontSize: '2rem', textAlign: 'center', height: '60px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Short Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., PPSC"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={form.fullName || ''}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g., Punjab Public Service Commission"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
              />
            </Form.Group>
          </>
        );
      
      case 'position':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Position Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.title || ''}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Assistant Director"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    value={form.department || ''}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    placeholder="e.g., Finance"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>BPS Level <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.bpsLevel || ''}
                    onChange={e => setForm({ ...form, bpsLevel: e.target.value })}
                  >
                    <option value="">Select BPS</option>
                    {BPS_LEVELS.map(bps => <option key={bps} value={bps}>{bps}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Test Conduct Body</Form.Label>
              <Form.Select
                value={form.testConductBody || ''}
                onChange={e => setForm({ ...form, testConductBody: e.target.value })}
              >
                <option value="">Select Body</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
              />
            </Form.Group>
          </>
        );
      
      case 'subject':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Subject Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., English Literature"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    value={form.code || ''}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g., ENG-101"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Marks</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.totalMarks || ''}
                    onChange={e => setForm({ ...form, totalMarks: e.target.value })}
                    placeholder="100"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Position <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.positionId || ''}
                onChange={e => setForm({ ...form, positionId: e.target.value })}
              >
                <option value="">Select Position</option>
                {positions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
              />
            </Form.Group>
          </>
        );
      
      case 'book':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Book Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.title || ''}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., English Grammar"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    value={form.author || ''}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    placeholder="Author name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pages</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.pages || ''}
                    onChange={e => setForm({ ...form, pages: e.target.value })}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.subjectId || ''}
                onChange={e => setForm({ ...form, subjectId: e.target.value })}
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
              />
            </Form.Group>
          </>
        );
      
      case 'chapter':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Chapter Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Introduction"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chapter Number</Form.Label>
                  <Form.Control
                    value={form.chapterNumber || ''}
                    onChange={e => setForm({ ...form, chapterNumber: e.target.value })}
                    placeholder="1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total MCQs</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.totalMcqs || ''}
                    onChange={e => setForm({ ...form, totalMcqs: e.target.value })}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Book <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.bookId || ''}
                onChange={e => setForm({ ...form, bookId: e.target.value })}
              >
                <option value="">Select Book</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description || ''}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
              />
            </Form.Group>
          </>
        );
      
      case 'mcq':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Question <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.question || ''}
                onChange={e => setForm({ ...form, question: e.target.value })}
                placeholder="Enter question..."
              />
            </Form.Group>
            <Row>
              {['A', 'B', 'C', 'D'].map(opt => (
                <Col md={6} key={opt}>
                  <Form.Group className="mb-3">
                    <Form.Label>Option {opt} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={form[`option${opt}`] || ''}
                      onChange={e => setForm({ ...form, [`option${opt}`]: e.target.value })}
                      placeholder={`Option ${opt}`}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Correct Answer <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.correctAnswer || ''}
                    onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
                  >
                    <option value="">Select</option>
                    {MCQ_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chapter <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.chapterId || ''}
                    onChange={e => setForm({ ...form, chapterId: e.target.value })}
                  >
                    <option value="">Select Chapter</option>
                    {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Explanation</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.explanation || ''}
                onChange={e => setForm({ ...form, explanation: e.target.value })}
                placeholder="Explain the answer..."
              />
            </Form.Group>
          </>
        );
      
      default: return null;
    }
  };
  
  const handleSubmit = () => {
    const data = { ...form };
    delete data.id;
    onSave(data);
    onHide();
  };
  
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {editingItem ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>{renderForm()}</Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

// ── Main Dashboard ──────────────────────────────────────────────────
const Dashboard = () => {
  const store = useStore();
  const { categories, positions, subjects, books, chapters, mcqs } = store;
  
  // State
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'
  const [selectedType, setSelectedType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('category');
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  
  // Stats
  const stats = [
    { label: 'Bodies', value: categories.length, icon: <FiHome size={20} color="#3b82f6" />, bg: '#eff6ff' },
    { label: 'Positions', value: positions.length, icon: <FiBriefcase size={20} color="#8b5cf6" />, bg: '#f5f3ff' },
    { label: 'Subjects', value: subjects.length, icon: <FiTag size={20} color="#22c55e" />, bg: '#f0fdf4' },
    { label: 'Books', value: books.length, icon: <FiBook size={20} color="#eab308" />, bg: '#fef3c7' },
    { label: 'Chapters', value: chapters.length, icon: <FiLayers size={20} color="#ec4899" />, bg: '#fce7f3' },
    { label: 'MCQs', value: mcqs.length, icon: <FiCheckCircle size={20} color="#3b82f6" />, bg: '#eff6ff' },
  ];
  
  // Get selected item
  const getSelectedItem = () => {
    if (!selectedId || !selectedType) return null;
    switch (selectedType) {
      case 'category': return categories.find(c => c.id === selectedId);
      case 'position': return positions.find(p => p.id === selectedId);
      case 'subject': return subjects.find(s => s.id === selectedId);
      case 'book': return books.find(b => b.id === selectedId);
      case 'chapter': return chapters.find(c => c.id === selectedId);
      default: return null;
    }
  };
  
  const selectedItem = getSelectedItem();
  
  // Handlers
  const handleSelect = (type, id) => {
    setSelectedType(type);
    setSelectedId(id);
  };
  
  const handleAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };
  
  const handleEdit = (item) => {
    setModalType(selectedType);
    setEditingItem(item);
    setShowModal(true);
  };
  
  const handleDelete = (id, type) => {
    setDeleteId(id);
    setDeleteType(type || selectedType);
  };
  
  const confirmDelete = () => {
    if (!deleteId || !deleteType) return;
    switch (deleteType) {
      case 'category': deleteCategory(deleteId); break;
      case 'position': deletePosition(deleteId); break;
      case 'subject': deleteSubject(deleteId); break;
      case 'book': deleteBook(deleteId); break;
      case 'chapter': deleteChapter(deleteId); break;
      case 'mcq': deleteMcq(deleteId); break;
      default: break;
    }
    setDeleteId(null);
    setDeleteType(null);
    if (selectedId === deleteId) {
      setSelectedId(null);
      setSelectedType(null);
    }
  };
  
  const handleSave = (data) => {
    if (editingItem) {
      switch (modalType) {
        case 'category': updateCategory(editingItem.id, data); break;
        case 'position': updatePosition(editingItem.id, data); break;
        case 'subject': updateSubject(editingItem.id, data); break;
        case 'book': updateBook(editingItem.id, data); break;
        case 'chapter': updateChapter(editingItem.id, data); break;
        case 'mcq': updateMcq(editingItem.id, data); break;
        default: break;
      }
    } else {
      switch (modalType) {
        case 'category': addCategory(data); break;
        case 'position': addPosition(data); break;
        case 'subject': addSubject(data); break;
        case 'book': addBook(data); break;
        case 'chapter': addChapter(data); break;
        case 'mcq': addMcq(data); break;
        default: break;
      }
    }
    setShowModal(false);
  };
  
  // Quick add buttons
  const quickAddButtons = [
    { type: 'category', label: 'Test Body', icon: <FiHome /> },
    { type: 'position', label: 'Position', icon: <FiBriefcase /> },
    { type: 'subject', label: 'Subject', icon: <FiTag /> },
    { type: 'book', label: 'Book', icon: <FiBook /> },
    { type: 'chapter', label: 'Chapter', icon: <FiLayers /> },
    { type: 'mcq', label: 'MCQ', icon: <FiCheckCircle /> },
  ];
  
  return (
    <div className="admin-dashboard" style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)', 
        padding: '24px 32px', 
        borderRadius: '16px', 
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 style={{ fontWeight: 800, color: 'white', margin: '0 0 4px' }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📚</span> 
              Test Conduct Management
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>
              Manage test bodies, positions, subjects, books, chapters, and MCQs
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {quickAddButtons.map(btn => (
              <Button 
                key={btn.type}
                variant="light" 
                size="sm"
                onClick={() => handleAdd(btn.type)}
                className="d-flex align-items-center gap-1"
              >
                {btn.icon} {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <StatCards stats={stats} />
      
      {/* View Toggle & Search */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex gap-2">
          <Button 
            variant={viewMode === 'tree' ? 'primary' : 'outline-secondary'}
            onClick={() => setViewMode('tree')}
          >
            <FiGrid className="me-1" /> Tree View
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
            onClick={() => setViewMode('list')}
          >
            <FiList className="me-1" /> List View
          </Button>
        </div>
        <div style={{ position: 'relative', maxWidth: '300px' }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0' }}
          />
        </div>
      </div>
      
      {/* Main Content - Two Column Layout */}
      <Row className="g-4">
        {/* Left Column - Tree/List */}
        <Col lg={selectedItem ? 6 : 12}>
          <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body>
              {viewMode === 'tree' ? (
                <HierarchyTree 
                  data={store} 
                  onSelect={handleSelect} 
                  selectedId={selectedId}
                />
              ) : (
                <div className="list-view">
                  <h6 className="fw-bold mb-3">All Items</h6>
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Details</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(c => (
                        <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => handleSelect('category', c.id)}>
                          <td><Badge bg="primary">Body</Badge></td>
                          <td>{c.icon} {c.name}</td>
                          <td>{positions.filter(p => p.testConductBody === c.id).length} positions</td>
                          <td>
                            <Button variant="outline-warning" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(c); }}>
                              <FiEdit size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {positions.map(p => (
                        <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => handleSelect('position', p.id)}>
                          <td><Badge bg="info">Position</Badge></td>
                          <td>{p.title}</td>
                          <td>{p.bpsLevel} · {p.department}</td>
                          <td>
                            <Button variant="outline-warning" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(p); }}>
                              <FiEdit size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {subjects.map(s => (
                        <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => handleSelect('subject', s.id)}>
                          <td><Badge bg="success">Subject</Badge></td>
                          <td>{s.name}</td>
                          <td>{s.code || 'No code'}</td>
                          <td>
                            <Button variant="outline-warning" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(s); }}>
                              <FiEdit size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {books.map(b => (
                        <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => handleSelect('book', b.id)}>
                          <td><Badge bg="warning">Book</Badge></td>
                          <td>{b.title}</td>
                          <td>{b.author || 'No author'}</td>
                          <td>
                            <Button variant="outline-warning" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(b); }}>
                              <FiEdit size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {chapters.map(c => (
                        <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => handleSelect('chapter', c.id)}>
                          <td><Badge bg="danger">Chapter</Badge></td>
                          <td>{c.name}</td>
                          <td>Chapter {c.chapterNumber || 'N/A'}</td>
                          <td>
                            <Button variant="outline-warning" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(c); }}>
                              <FiEdit size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Right Column - Detail View */}
        {selectedItem && (
          <Col lg={6}>
            <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <Card.Body>
                <DetailView 
                  type={selectedType}
                  item={selectedItem}
                  store={store}
                  onBack={() => { setSelectedId(null); setSelectedType(null); }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onNavigate={handleSelect}
                />
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      
      {/* Quick Add Modal */}
      <QuickAddModal
        show={showModal}
        onHide={() => setShowModal(false)}
        type={modalType}
        store={store}
        editingItem={editingItem}
        onSave={handleSave}
      />
      
      {/* Delete Confirmation */}
      <Modal show={!!deleteId} onHide={() => { setDeleteId(null); setDeleteType(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this item?</p>
          <p className="text-danger">This will also delete all associated items. This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setDeleteId(null); setDeleteType(null); }}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;