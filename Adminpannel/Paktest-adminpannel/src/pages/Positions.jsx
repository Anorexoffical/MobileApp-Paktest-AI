import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Badge, Card, Table, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiBook, FiFolder } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addPosition, updatePosition, deletePosition } from '../data/store';
import { Link, useLocation } from 'react-router-dom';

const BPS_LEVELS = ['BPS-14', 'BPS-15', 'BPS-16', 'BPS-17', 'BPS-18', 'BPS-19', 'BPS-20'];

const Positions = () => {
  const { positions, categories, subjects } = useStore();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', department: '', bpsLevel: '', testConductBody: '' });
  const [deleteId, setDeleteId] = useState(null);
  const [filterBody, setFilterBody] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bodyId = params.get('body');
    if (bodyId) setFilterBody(bodyId);
  }, [location]);

  const filtered = positions.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBody = filterBody ? p.testConductBody === filterBody : true;
    return matchSearch && matchBody;
  });

  const getBodyName = (id) => {
    const body = categories.find(c => c.id === id);
    return body ? `${body.icon} ${body.name}` : 'Not linked';
  };

  const getSubjectCount = (posId) => subjects.filter(s => s.positionId === posId).length;

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', department: '', bpsLevel: '', testConductBody: filterBody || '' }); setShowModal(true); };
  const openEdit = (pos) => { setEditing(pos); setForm(pos); setShowModal(true); };
  const handleSave = () => {
    if (!form.title.trim() || !form.bpsLevel) return;
    editing ? updatePosition(editing.id, form) : addPosition(form);
    setShowModal(false);
  };
  const confirmDelete = () => {
    if (deleteId) { deletePosition(deleteId); setDeleteId(null); }
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
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>💼</span> 
              Positions
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>{positions.length} positions configured</p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add Position
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
              placeholder="Search positions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
            />
          </div>
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterBody}
            onChange={e => setFilterBody(e.target.value)}
            style={{ borderRadius: '10px', border: '1px solid #e2e8f0', height: '46px' }}
          >
            <option value="">All Test Bodies</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Department</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>BPS</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Test Body</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Subjects</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>💼</div>
                    <h5 style={{ color: '#475569' }}>No positions found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add Position
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((pos, idx) => (
                  <tr key={pos.id}>
                    <td style={{ padding: '12px 20px', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>{pos.title}</td>
                    <td style={{ padding: '12px 20px', color: '#64748b' }}>{pos.department || '—'}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg="primary">{pos.bpsLevel}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg="secondary">{getBodyName(pos.testConductBody)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="success">{getSubjectCount(pos.id)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <div className="d-flex gap-2 justify-content-center">
                        <Link to={`/admin/subjects?position=${pos.id}`}>
                          <Button variant="outline-info" size="sm" title="Manage Subjects">
                            <FiBook size={14} />
                          </Button>
                        </Link>
                        <Button variant="outline-warning" size="sm" onClick={() => openEdit(pos)}>
                          <FiEdit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(pos.id)}>
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
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} Position</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Position Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Assistant Director"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Department</Form.Label>
                  <Form.Control
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    placeholder="e.g., Finance Department"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">BPS Level <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.bpsLevel}
                    onChange={e => setForm({ ...form, bpsLevel: e.target.value })}
                  >
                    <option value="">Select BPS Level</option>
                    {BPS_LEVELS.map(bps => (
                      <option key={bps} value={bps}>{bps}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Test Conduct Body</Form.Label>
              <Form.Select
                value={form.testConductBody}
                onChange={e => setForm({ ...form, testConductBody: e.target.value })}
              >
                <option value="">Select Test Body</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
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
          <Modal.Title className="fw-bold">Delete Position</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this position?</p>
          <p className="text-danger">All associated subjects, books, chapters, and MCQs will also be deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Positions;