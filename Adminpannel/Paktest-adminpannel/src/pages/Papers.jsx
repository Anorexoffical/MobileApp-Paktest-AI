import React, { useState } from 'react';
import { Button, Modal, Form, Badge, Card, Table, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addPaper, updatePaper, deletePaper } from '../data/store';

const PAPER_TYPES = ['solved', 'unsolved'];
const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard', 'Expert'];

const Papers = () => {
  const { papers, positions, mcqs } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    positionId: '',
    year: '',
    difficulty: '',
    duration: '',
    totalMcqs: '',
    type: '',
    description: ''
  });
  const [deleteId, setDeleteId] = useState(null);

  const filtered = papers.filter(p => {
    const position = positions.find(pos => pos.id === p.positionId);
    return p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           position?.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getPositionTitle = (id) => {
    const pos = positions.find(p => p.id === id);
    return pos ? pos.title : 'Not linked';
  };

  const getMcqCount = (paperId) => {
    return mcqs.filter(m => m.paperId === paperId).length;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: '',
      positionId: '',
      year: '',
      difficulty: '',
      duration: '',
      totalMcqs: '',
      type: '',
      description: ''
    });
    setShowModal(true);
  };

  const openEdit = (paper) => {
    setEditing(paper);
    setForm(paper);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.positionId || !form.year || !form.type) return;
    const data = {
      ...form,
      duration: parseInt(form.duration) || 0,
      totalMcqs: parseInt(form.totalMcqs) || 0
    };
    editing ? updatePaper(editing.id, data) : addPaper(data);
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deletePaper(deleteId);
      setDeleteId(null);
    }
  };

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
            <h4 style={{ fontWeight: 800, color: 'white', margin: '0 0 4px' }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📄</span> 
              Papers
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>
              {papers.length} papers available
            </p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add Paper
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4" style={{ position: 'relative', maxWidth: '400px' }}>
        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <Form.Control
          type="text"
          placeholder="Search papers..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
        />
      </div>

      {/* Table */}
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>#</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Position</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Year</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>MCQs</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>📄</div>
                    <h5 style={{ color: '#475569' }}>No papers found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add Paper
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((paper, idx) => (
                  <tr key={paper.id}>
                    <td style={{ padding: '12px 20px', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>{paper.title}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg="info">{getPositionTitle(paper.positionId)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px' }}>{paper.year}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg={paper.type === 'solved' ? 'success' : 'warning'}>
                        {paper.type}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="secondary">{getMcqCount(paper.id)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button variant="outline-warning" size="sm" onClick={() => openEdit(paper)}>
                          <FiEdit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(paper.id)}>
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} Paper</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Paper Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., PPSC Lecturer CS 2023"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Position <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.positionId}
                    onChange={e => setForm({ ...form, positionId: e.target.value })}
                  >
                    <option value="">Select Position</option>
                    {positions.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Year <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                    placeholder="2023"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    {PAPER_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Difficulty</Form.Label>
                  <Form.Select
                    value={form.difficulty}
                    onChange={e => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option value="">Select Difficulty</option>
                    {DIFFICULTY_LEVELS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Duration (min)</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="90"
                  />
                </Form.Group>
              </Col>
            </Row>

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

      {/* Delete Modal */}
      <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Paper</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this paper?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Papers;