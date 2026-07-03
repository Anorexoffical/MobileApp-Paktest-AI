import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Badge, Card, Table, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFileText, FiBook, FiArrowLeft, FiCheckCircle, FiPlusCircle } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addChapter, updateChapter, deleteChapter, addMcq } from '../data/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Chapters = () => {
  const { chapters, books, subjects, mcqs } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMcqModal, setShowMcqModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', chapterNumber: '', totalMcqs: '', description: '', bookId: '' });
  const [mcqForm, setMcqForm] = useState({ 
    question: '', optionA: '', optionB: '', optionC: '', optionD: '', 
    correctAnswer: '', explanation: '', chapterId: '' 
  });
  const [deleteId, setDeleteId] = useState(null);
  const [filterBook, setFilterBook] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookId = params.get('book');
    if (bookId) setFilterBook(bookId);
  }, [location]);

  const filtered = chapters.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBook = filterBook ? c.bookId === filterBook : true;
    return matchSearch && matchBook;
  });

  const getBookTitle = (id) => {
    const book = books.find(b => b.id === id);
    return book ? book.title : 'Not linked';
  };

  const getMcqCount = (chapterId) => mcqs.filter(m => m.chapterId === chapterId).length;

  const openAdd = () => { setEditing(null); setForm({ name: '', chapterNumber: '', totalMcqs: '', description: '', bookId: filterBook || '' }); setShowModal(true); };
  const openEdit = (chapter) => { setEditing(chapter); setForm(chapter); setShowModal(true); };
  const openAddMcq = (chapterId) => {
    setSelectedChapterId(chapterId);
    setMcqForm({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '', explanation: '', chapterId });
    setShowMcqModal(true);
  };
  const handleSave = () => {
    if (!form.name.trim() || !form.bookId) return;
    editing ? updateChapter(editing.id, form) : addChapter(form);
    setShowModal(false);
  };
  const handleSaveMcq = () => {
    if (!mcqForm.question.trim() || !mcqForm.correctAnswer) return;
    addMcq(mcqForm);
    setShowMcqModal(false);
  };
  const confirmDelete = () => {
    if (deleteId) { deleteChapter(deleteId); setDeleteId(null); }
  };

  const selectedBook = books.find(b => b.id === filterBook);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
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
            {selectedBook && (
              <Button 
                variant="light" 
                size="sm" 
                onClick={() => navigate('/admin/books')}
                className="mb-2"
              >
                <FiArrowLeft className="me-1" /> Back to Books
              </Button>
            )}
            <h4 style={{ fontWeight: 800, color: 'white', margin: '8px 0 4px' }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📄</span> 
              Chapters
              {selectedBook && <span style={{ fontSize: '1rem', marginLeft: '12px', color: '#93c5fd' }}>— {selectedBook.title}</span>}
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>{chapters.length} chapters configured</p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add Chapter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Row className="g-3 mb-4">
        <Col md={6}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <Form.Control
              type="text"
              placeholder="Search chapters..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
            />
          </div>
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterBook}
            onChange={e => setFilterBook(e.target.value)}
            style={{ borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
          >
            <option value="">All Books</option>
            {books.map(b => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Table */}
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>#</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Chapter #</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Book</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>MCQs</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>📄</div>
                    <h5 style={{ color: '#475569' }}>No chapters found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add Chapter
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((chapter, idx) => {
                  const mcqCount = getMcqCount(chapter.id);
                  return (
                    <tr key={chapter.id}>
                      <td style={{ padding: '12px 20px', color: '#94a3b8' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{chapter.name}</td>
                      <td style={{ padding: '12px 20px', color: '#64748b' }}>{chapter.chapterNumber || '—'}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <Badge bg="info">{getBookTitle(chapter.bookId)}</Badge>
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <Badge bg="success">{mcqCount}</Badge>
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            onClick={() => openAddMcq(chapter.id)}
                            title="Add MCQ"
                          >
                            <FiPlusCircle size={14} />
                          </Button>
                          <Link to={`/admin/mcqs?chapter=${chapter.id}`}>
                            <Button variant="outline-info" size="sm" title="View MCQs">
                              <FiCheckCircle size={14} />
                            </Button>
                          </Link>
                          <Button variant="outline-warning" size="sm" onClick={() => openEdit(chapter)}>
                            <FiEdit size={14} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(chapter.id)}>
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Chapter Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} Chapter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Chapter Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Introduction"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Chapter Number</Form.Label>
                  <Form.Control
                    value={form.chapterNumber}
                    onChange={e => setForm({ ...form, chapterNumber: e.target.value })}
                    placeholder="1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total MCQs</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.totalMcqs}
                    onChange={e => setForm({ ...form, totalMcqs: e.target.value })}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Book <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.bookId}
                onChange={e => setForm({ ...form, bookId: e.target.value })}
              >
                <option value="">Select Book</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Add MCQ Modal (Inline) */}
      <Modal show={showMcqModal} onHide={() => setShowMcqModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            <FiPlusCircle className="me-2" /> Add MCQ to "{chapters.find(c => c.id === selectedChapterId)?.name || 'Chapter'}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Question <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={mcqForm.question}
                onChange={e => setMcqForm({ ...mcqForm, question: e.target.value })}
                placeholder="Enter the MCQ question..."
              />
            </Form.Group>
            <Row>
              {['A', 'B', 'C', 'D'].map(opt => (
                <Col md={6} key={opt}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Option {opt} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={mcqForm[`option${opt}`]}
                      onChange={e => setMcqForm({ ...mcqForm, [`option${opt}`]: e.target.value })}
                      placeholder={`Option ${opt}`}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Correct Answer <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={mcqForm.correctAnswer}
                    onChange={e => setMcqForm({ ...mcqForm, correctAnswer: e.target.value })}
                  >
                    <option value="">Select</option>
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Explanation</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={mcqForm.explanation}
                    onChange={e => setMcqForm({ ...mcqForm, explanation: e.target.value })}
                    placeholder="Explain the answer..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setShowMcqModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveMcq}>Add MCQ</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Chapter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this chapter?</p>
          <p className="text-danger">All associated MCQs will also be deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Chapters;