import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Badge, Card, Table, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFileText, FiBook, FiArrowLeft, FiLayers, FiPlusCircle } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addBook, updateBook, deleteBook, addChapter } from '../data/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Books = () => {
  const { books, subjects, positions, chapters, mcqs } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', pages: '', description: '', subjectId: '' });
  const [chapterForm, setChapterForm] = useState({ name: '', chapterNumber: '', totalMcqs: '', description: '', bookId: '' });
  const [deleteId, setDeleteId] = useState(null);
  const [filterSubject, setFilterSubject] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subjId = params.get('subject');
    if (subjId) setFilterSubject(subjId);
  }, [location]);

  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSubj = filterSubject ? b.subjectId === filterSubject : true;
    return matchSearch && matchSubj;
  });

  const getSubjectName = (id) => {
    const subj = subjects.find(s => s.id === id);
    return subj ? subj.name : 'Not linked';
  };

  const getChapterCount = (bookId) => chapters.filter(c => c.bookId === bookId).length;
  const getMcqCount = (bookId) => {
    const bookChapters = chapters.filter(c => c.bookId === bookId);
    return mcqs.filter(m => bookChapters.some(c => c.id === m.chapterId)).length;
  };

  const openAdd = () => { setEditing(null); setForm({ title: '', author: '', pages: '', description: '', subjectId: filterSubject || '' }); setShowModal(true); };
  const openEdit = (book) => { setEditing(book); setForm(book); setShowModal(true); };
  const openAddChapter = (bookId) => {
    setSelectedBookId(bookId);
    setChapterForm({ name: '', chapterNumber: '', totalMcqs: '', description: '', bookId });
    setShowChapterModal(true);
  };
  const handleSave = () => {
    if (!form.title.trim() || !form.subjectId) return;
    editing ? updateBook(editing.id, form) : addBook(form);
    setShowModal(false);
  };
  const handleSaveChapter = () => {
    if (!chapterForm.name.trim()) return;
    addChapter(chapterForm);
    setShowChapterModal(false);
  };
  const confirmDelete = () => {
    if (deleteId) { deleteBook(deleteId); setDeleteId(null); }
  };

  const selectedSubject = subjects.find(s => s.id === filterSubject);

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
            {selectedSubject && (
              <Button 
                variant="light" 
                size="sm" 
                onClick={() => navigate('/admin/subjects')}
                className="mb-2"
              >
                <FiArrowLeft className="me-1" /> Back to Subjects
              </Button>
            )}
            <h4 style={{ fontWeight: 800, color: 'white', margin: '8px 0 4px' }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📖</span> 
              Books
              {selectedSubject && <span style={{ fontSize: '1rem', marginLeft: '12px', color: '#93c5fd' }}>— {selectedSubject.name}</span>}
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>{books.length} books configured</p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add Book
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
              placeholder="Search books..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
            />
          </div>
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            style={{ borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Author</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Subject</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Chapters</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>MCQs</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>📖</div>
                    <h5 style={{ color: '#475569' }}>No books found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add Book
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((book, idx) => {
                  const chapterCount = getChapterCount(book.id);
                  const mcqCount = getMcqCount(book.id);
                  return (
                    <tr key={book.id}>
                      <td style={{ padding: '12px 20px', color: '#94a3b8' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{book.title}</td>
                      <td style={{ padding: '12px 20px', color: '#64748b' }}>{book.author || '—'}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <Badge bg="info">{getSubjectName(book.subjectId)}</Badge>
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <Badge bg="warning">{chapterCount}</Badge>
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <Badge bg="success">{mcqCount}</Badge>
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            onClick={() => openAddChapter(book.id)}
                            title="Add Chapter"
                          >
                            <FiPlusCircle size={14} />
                          </Button>
                          <Link to={`/admin/chapters?book=${book.id}`}>
                            <Button variant="outline-info" size="sm" title="View Chapters">
                              <FiLayers size={14} />
                            </Button>
                          </Link>
                          <Button variant="outline-warning" size="sm" onClick={() => openEdit(book)}>
                            <FiEdit size={14} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(book.id)}>
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

      {/* Add/Edit Book Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Book Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., English Grammar"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Author</Form.Label>
                  <Form.Control
                    value={form.author}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    placeholder="Author name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Pages</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.pages}
                    onChange={e => setForm({ ...form, pages: e.target.value })}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Subject <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.subjectId}
                onChange={e => setForm({ ...form, subjectId: e.target.value })}
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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

      {/* Add Chapter Modal (Inline) */}
      <Modal show={showChapterModal} onHide={() => setShowChapterModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            <FiPlusCircle className="me-2" /> Add Chapter to "{books.find(b => b.id === selectedBookId)?.title || 'Book'}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Chapter Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={chapterForm.name}
                onChange={e => setChapterForm({ ...chapterForm, name: e.target.value })}
                placeholder="e.g., Introduction"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Chapter Number</Form.Label>
                  <Form.Control
                    value={chapterForm.chapterNumber}
                    onChange={e => setChapterForm({ ...chapterForm, chapterNumber: e.target.value })}
                    placeholder="1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total MCQs</Form.Label>
                  <Form.Control
                    type="number"
                    value={chapterForm.totalMcqs}
                    onChange={e => setChapterForm({ ...chapterForm, totalMcqs: e.target.value })}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={chapterForm.description}
                onChange={e => setChapterForm({ ...chapterForm, description: e.target.value })}
                placeholder="Brief description..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setShowChapterModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveChapter}>Add Chapter</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this book?</p>
          <p className="text-danger">All associated chapters and MCQs will also be deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Books;