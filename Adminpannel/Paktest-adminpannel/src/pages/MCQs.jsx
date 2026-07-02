import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Badge, Card, Table, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addMcq, updateMcq, deleteMcq } from '../data/store';
import { useLocation, useNavigate } from 'react-router-dom';

const MCQ_OPTIONS = ['A', 'B', 'C', 'D'];

const MCQs = () => {
  const { mcqs, chapters, books, subjects } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    question: '', optionA: '', optionB: '', optionC: '', optionD: '', 
    correctAnswer: '', explanation: '', chapterId: '' 
  });
  const [deleteId, setDeleteId] = useState(null);
  const [filterChapter, setFilterChapter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chapterId = params.get('chapter');
    if (chapterId) setFilterChapter(chapterId);
  }, [location]);

  const filtered = mcqs.filter(m => {
    const matchSearch = m.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChapter = filterChapter ? m.chapterId === filterChapter : true;
    return matchSearch && matchChapter;
  });

  const getChapterName = (id) => {
    const ch = chapters.find(c => c.id === id);
    return ch ? ch.name : 'Not linked';
  };

  const openAdd = () => { setEditing(null); setForm({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '', explanation: '', chapterId: filterChapter || '' }); setShowModal(true); };
  const openEdit = (mcq) => { setEditing(mcq); setForm(mcq); setShowModal(true); };
  const handleSave = () => {
    if (!form.question.trim() || !form.correctAnswer || !form.chapterId) return;
    editing ? updateMcq(editing.id, form) : addMcq(form);
    setShowModal(false);
  };
  const confirmDelete = () => {
    if (deleteId) { deleteMcq(deleteId); setDeleteId(null); }
  };

  const selectedChapter = chapters.find(c => c.id === filterChapter);

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
            {selectedChapter && (
              <Button 
                variant="light" 
                size="sm" 
                onClick={() => navigate('/admin/chapters')}
                className="mb-2"
              >
                <FiArrowLeft className="me-1" /> Back to Chapters
              </Button>
            )}
            <h4 style={{ fontWeight: 800, color: 'white', margin: '8px 0 4px' }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>✅</span> 
              MCQs
              {selectedChapter && <span style={{ fontSize: '1rem', marginLeft: '12px', color: '#93c5fd' }}>— {selectedChapter.name}</span>}
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>{mcqs.length} MCQs configured</p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add MCQ
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
              placeholder="Search MCQs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
            />
          </div>
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterChapter}
            onChange={e => setFilterChapter(e.target.value)}
            style={{ borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
          >
            <option value="">All Chapters</option>
            {chapters.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Question</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Options</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Correct</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Chapter</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                    <h5 style={{ color: '#475569' }}>No MCQs found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add MCQ
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((mcq, idx) => (
                  <tr key={mcq.id}>
                    <td style={{ padding: '12px 20px', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '12px 20px', maxWidth: '300px' }}>
                      <div style={{ fontWeight: 500 }}>{mcq.question}</div>
                      {mcq.explanation && (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>
                          💡 {mcq.explanation}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: '0.85rem' }}>
                      <div>A: {mcq.optionA}</div>
                      <div>B: {mcq.optionB}</div>
                      <div>C: {mcq.optionC}</div>
                      <div>D: {mcq.optionD}</div>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="success" style={{ fontSize: '1rem', padding: '6px 14px' }}>
                        {mcq.correctAnswer}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg="info">{getChapterName(mcq.chapterId)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button variant="outline-warning" size="sm" onClick={() => openEdit(mcq)}>
                          <FiEdit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(mcq.id)}>
                          <FiTrash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit MCQ Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} MCQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Question <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
                placeholder="Enter the MCQ question..."
              />
            </Form.Group>
            <Row>
              {['A', 'B', 'C', 'D'].map(opt => (
                <Col md={6} key={opt}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Option {opt} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      value={form[`option${opt}`]}
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
                  <Form.Label className="fw-bold">Correct Answer <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.correctAnswer}
                    onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
                  >
                    <option value="">Select</option>
                    {MCQ_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Chapter <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.chapterId}
                    onChange={e => setForm({ ...form, chapterId: e.target.value })}
                  >
                    <option value="">Select Chapter</option>
                    {chapters.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Explanation</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.explanation}
                onChange={e => setForm({ ...form, explanation: e.target.value })}
                placeholder="Explain the answer..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete MCQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this MCQ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MCQs;