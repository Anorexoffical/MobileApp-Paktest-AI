import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Badge, Card, Table, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiBook, FiArrowLeft } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addSubject, updateSubject, deleteSubject } from '../data/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Subjects = () => {
  const { subjects, positions, books } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', description: '', totalMarks: '', positionId: '' });
  const [deleteId, setDeleteId] = useState(null);
  const [filterPosition, setFilterPosition] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const posId = params.get('position');
    if (posId) setFilterPosition(posId);
  }, [location]);

  const filtered = subjects.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchPos = filterPosition ? s.positionId === filterPosition : true;
    return matchSearch && matchPos;
  });

  const getPositionTitle = (id) => {
    const pos = positions.find(p => p.id === id);
    return pos ? pos.title : 'Not linked';
  };

  const getBookCount = (subjId) => books.filter(b => b.subjectId === subjId).length;

  const openAdd = () => { setEditing(null); setForm({ name: '', code: '', description: '', totalMarks: '', positionId: filterPosition || '' }); setShowModal(true); };
  const openEdit = (subj) => { setEditing(subj); setForm(subj); setShowModal(true); };
  const handleSave = () => {
    if (!form.name.trim() || !form.positionId) return;
    editing ? updateSubject(editing.id, form) : addSubject(form);
    setShowModal(false);
  };
  const confirmDelete = () => {
    if (deleteId) { deleteSubject(deleteId); setDeleteId(null); }
  };

  const selectedPosition = positions.find(p => p.id === filterPosition);

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
            {selectedPosition && (
              <Button 
                variant="light" 
                size="sm" 
                onClick={() => navigate('/admin/positions')}
                className="mb-2"
              >
                <FiArrowLeft className="me-1" /> Back to Positions
              </Button>
            )}
            <h4 style={{ fontWeight: 800, color: 'white', margin: '8px 0 4px' }}>
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📚</span> 
              Subjects
              {selectedPosition && <span style={{ fontSize: '1rem', marginLeft: '12px', color: '#93c5fd' }}>— {selectedPosition.title}</span>}
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>{subjects.length} subjects configured</p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add Subject
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
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
            />
          </div>
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterPosition}
            onChange={e => setFilterPosition(e.target.value)}
            style={{ borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
          >
            <option value="">All Positions</option>
            {positions.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Code</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Position</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Books</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>📚</div>
                    <h5 style={{ color: '#475569' }}>No subjects found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add Subject
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((subj, idx) => (
                  <tr key={subj.id}>
                    <td style={{ padding: '12px 20px', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>{subj.name}</td>
                    <td style={{ padding: '12px 20px', color: '#64748b' }}>{subj.code || '—'}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg="info">{getPositionTitle(subj.positionId)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="warning">{getBookCount(subj.id)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <div className="d-flex gap-2 justify-content-center">
                        <Link to={`/admin/books?subject=${subj.id}`}>
                          <Button variant="outline-info" size="sm" title="Manage Books">
                            <FiBook size={14} />
                          </Button>
                        </Link>
                        <Button variant="outline-warning" size="sm" onClick={() => openEdit(subj)}>
                          <FiEdit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(subj.id)}>
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
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Subject Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., English Literature"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Code</Form.Label>
                  <Form.Control
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g., ENG-101"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total Marks</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.totalMarks}
                    onChange={e => setForm({ ...form, totalMarks: e.target.value })}
                    placeholder="100"
                  />
                </Form.Group>
              </Col>
            </Row>
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
          <Modal.Title className="fw-bold">Delete Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this subject?</p>
          <p className="text-danger">All associated books, chapters, and MCQs will also be deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Subjects;