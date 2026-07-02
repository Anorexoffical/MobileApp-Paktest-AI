import React, { useState } from 'react';
import { Button, Modal, Form, Badge, Card, Table, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addPattern, updatePattern, deletePattern } from '../data/store';

const Patterns = () => {
  const { testPatterns, positions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    positionId: '',
    sections: [{ name: '', percentage: '', mcqs: '' }],
    totalMcqs: '',
    timeLimit: '',
    passingMarks: ''
  });
  const [deleteId, setDeleteId] = useState(null);

  const filtered = testPatterns.filter(p => {
    const position = positions.find(pos => pos.id === p.positionId);
    return position?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           p.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getPositionTitle = (id) => {
    const pos = positions.find(p => p.id === id);
    return pos ? pos.title : 'Not linked';
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      positionId: '',
      sections: [{ name: '', percentage: '', mcqs: '' }],
      totalMcqs: '',
      timeLimit: '',
      passingMarks: ''
    });
    setShowModal(true);
  };

  const openEdit = (pattern) => {
    setEditing(pattern);
    setForm(pattern);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.positionId || !form.totalMcqs || !form.timeLimit || !form.passingMarks) return;
    const data = {
      ...form,
      totalMcqs: parseInt(form.totalMcqs),
      timeLimit: parseInt(form.timeLimit),
      passingMarks: parseInt(form.passingMarks),
      sections: form.sections.map(s => ({
        ...s,
        percentage: parseInt(s.percentage) || 0,
        mcqs: parseInt(s.mcqs) || 0
      }))
    };
    editing ? updatePattern(editing.id, data) : addPattern(data);
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deletePattern(deleteId);
      setDeleteId(null);
    }
  };

  const addSection = () => {
    setForm({
      ...form,
      sections: [...form.sections, { name: '', percentage: '', mcqs: '' }]
    });
  };

  const removeSection = (index) => {
    const newSections = form.sections.filter((_, i) => i !== index);
    setForm({ ...form, sections: newSections });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...form.sections];
    newSections[index][field] = value;
    setForm({ ...form, sections: newSections });
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
              <span style={{ fontSize: '2rem', marginRight: '12px' }}>📋</span> 
              Test Patterns
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>
              {testPatterns.length} patterns configured
            </p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add Pattern
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4" style={{ position: 'relative', maxWidth: '400px' }}>
        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <Form.Control
          type="text"
          placeholder="Search patterns..."
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Position</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Total MCQs</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Time Limit</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Passing Marks</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Sections</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
                    <h5 style={{ color: '#475569' }}>No patterns found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add Pattern
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((pattern, idx) => (
                  <tr key={pattern.id}>
                    <td style={{ padding: '12px 20px', color: '#94a3b8' }}>{idx + 1}</td>
                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>
                      {getPositionTitle(pattern.positionId)}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="info">{pattern.totalMcqs}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="warning">{pattern.timeLimit} min</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="success">{pattern.passingMarks}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="secondary">{pattern.sections?.length || 0}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button variant="outline-warning" size="sm" onClick={() => openEdit(pattern)}>
                          <FiEdit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(pattern.id)}>
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
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} Test Pattern</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total MCQs <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    value={form.totalMcqs}
                    onChange={e => setForm({ ...form, totalMcqs: e.target.value })}
                    placeholder="100"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Time Limit (min) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    value={form.timeLimit}
                    onChange={e => setForm({ ...form, timeLimit: e.target.value })}
                    placeholder="90"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Passing Marks <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    value={form.passingMarks}
                    onChange={e => setForm({ ...form, passingMarks: e.target.value })}
                    placeholder="40"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Label className="fw-bold">Sections</Form.Label>
            {form.sections.map((section, index) => (
              <Card key={index} className="mb-2 p-3" style={{ background: '#f8fafc' }}>
                <Row className="align-items-center">
                  <Col md={4}>
                    <Form.Control
                      placeholder="Section Name"
                      value={section.name}
                      onChange={e => updateSection(index, 'name', e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="number"
                      placeholder="Percentage"
                      value={section.percentage}
                      onChange={e => updateSection(index, 'percentage', e.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="number"
                      placeholder="MCQs"
                      value={section.mcqs}
                      onChange={e => updateSection(index, 'mcqs', e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Button variant="danger" size="sm" onClick={() => removeSection(index)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addSection} className="mb-3">
              <FiPlus /> Add Section
            </Button>
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
          <Modal.Title className="fw-bold">Delete Pattern</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this test pattern?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Patterns;