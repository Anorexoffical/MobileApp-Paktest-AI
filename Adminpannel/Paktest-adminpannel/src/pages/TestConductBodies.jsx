import React, { useState } from 'react';
import { Button, Modal, Form, Badge, Card, Row, Col, Table } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFolder } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addCategory, updateCategory, deleteCategory } from '../data/store';
import { Link } from 'react-router-dom';

const TestConductBodies = () => {
  const { categories, positions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', fullName: '', description: '', icon: '🏛️' });
  const [deleteId, setDeleteId] = useState(null);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm({ name: '', fullName: '', description: '', icon: '🏛️' }); setShowModal(true); };
  const openEdit = (cat) => { setEditing(cat); setForm(cat); setShowModal(true); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    editing ? updateCategory(editing.id, form) : addCategory(form);
    setShowModal(false);
  };
  const confirmDelete = () => {
    if (deleteId) { deleteCategory(deleteId); setDeleteId(null); }
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
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>🏛️</span> 
              Test Conduct Bodies
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>{categories.length} bodies configured</p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add Test Body
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4" style={{ position: 'relative', maxWidth: '400px' }}>
        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <Form.Control
          type="text"
          placeholder="Search test bodies..."
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Icon</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Full Name</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Positions</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏛️</div>
                    <h5 style={{ color: '#475569' }}>No test bodies found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add Test Body
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((cat, idx) => {
                  const posCount = positions.filter(p => p.testConductBody === cat.id).length;
                  return (
                    <tr key={cat.id}>
                      <td style={{ padding: '12px 20px', color: '#94a3b8' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 20px', fontSize: '1.5rem' }}>{cat.icon || '🏛️'}</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600 }}>{cat.name}</td>
                      <td style={{ padding: '12px 20px', color: '#64748b' }}>{cat.fullName || '—'}</td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <Badge bg="primary">{posCount}</Badge>
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <Link to={`/admin/positions?body=${cat.id}`}>
                            <Button variant="outline-info" size="sm" title="View Positions">
                              <FiFolder size={14} />
                            </Button>
                          </Link>
                          <Button variant="outline-warning" size="sm" onClick={() => openEdit(cat)}>
                            <FiEdit size={14} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(cat.id)}>
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} Test Body</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Icon</Form.Label>
                  <Form.Control
                    value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })}
                    placeholder="🏛️"
                    style={{ fontSize: '2rem', textAlign: 'center', height: '60px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={10}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Short Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., PPSC"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Full Name</Form.Label>
              <Form.Control
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g., Punjab Public Service Commission"
              />
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
          <Modal.Title className="fw-bold">Delete Test Body</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this test body?</p>
          <p className="text-danger">All associated positions, subjects, books, chapters, and MCQs will also be deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestConductBodies;