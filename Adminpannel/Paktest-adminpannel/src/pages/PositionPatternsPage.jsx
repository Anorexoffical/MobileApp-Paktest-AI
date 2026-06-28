import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Table, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiFileText, FiClock, FiCheckCircle, FiBook } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addPattern, updatePattern, deletePattern } from '../data/store';

const blankPattern = {
  totalMcqs: 100,
  timeLimit: 90,
  passingMarks: 40,
  sections: [{ name: '', percentage: 0, mcqs: 0 }]
};

const PositionPatternsPage = () => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const { positions, testPatterns } = useStore();
  const position = positions.find(p => p.id === positionId);

  const [showModal, setShowModal] = useState(false);
  const [editingPattern, setEditingPattern] = useState(null);
  const [formData, setFormData] = useState(blankPattern);

  if (!position) {
    return (
      <div className="text-center py-5">
        <h4>Position not found</h4>
        <Button variant="primary" onClick={() => navigate('/admin/positions')}>Back to Positions</Button>
      </div>
    );
  }

  const positionPatterns = testPatterns.filter(p => p.positionId === positionId);

  const openAdd = () => { 
    setEditingPattern(null); 
    setFormData({ ...blankPattern, positionId }); 
    setShowModal(true); 
  };
  
  const openEdit = (pattern) => { 
    setEditingPattern(pattern); 
    setFormData({ ...pattern }); 
    setShowModal(true); 
  };
  
  const handleDelete = (id) => { 
    if (window.confirm('Delete this pattern?')) deletePattern(id); 
  };
  
  const handleSave = () => {
    const data = { ...formData, positionId };
    editingPattern ? updatePattern(editingPattern.id, data) : addPattern(data);
    setShowModal(false);
  };

  const addSection = () => setFormData({ ...formData, sections: [...formData.sections, { name: '', percentage: 0, mcqs: 0 }] });
  const removeSection = (i) => setFormData({ ...formData, sections: formData.sections.filter((_, idx) => idx !== i) });
  const updateSection = (i, field, val) => {
    const secs = formData.sections.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    setFormData({ ...formData, sections: secs });
  };

  return (
    <div className="admin-page" style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)', 
        padding: '28px 32px', 
        borderRadius: '16px', 
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <Button 
              variant="light" 
              size="sm" 
              onClick={() => navigate('/admin/positions')}
              className="mb-2"
            >
              <FiArrowLeft className="me-1" /> Back to Positions
            </Button>
            <h4 style={{ fontWeight: 800, color: 'white', margin: '8px 0 4px' }}>
              <FiFileText className="me-2" /> Test Pattern
            </h4>
            <p style={{ color: '#c4b5fd', margin: 0 }}>
              {position.title} · {position.department} · {positionPatterns.length} patterns
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to={`/admin/position/${positionId}/solved-papers`}>
              <Button variant="outline-success" style={{ color: '#86efac', borderColor: '#86efac' }}>
                <FiCheckCircle className="me-1" /> Solved Papers
              </Button>
            </Link>
            <Link to={`/admin/position/${positionId}/unsolved-papers`}>
              <Button variant="outline-warning" style={{ color: '#fcd34d', borderColor: '#fcd34d' }}>
                <FiClock className="me-1" /> Mock Tests
              </Button>
            </Link>
            <Link to={`/admin/position/${positionId}/books`}>
              <Button variant="outline-info" style={{ color: '#67e8f9', borderColor: '#67e8f9' }}>
                <FiBook className="me-1" /> Books
              </Button>
            </Link>
            <Button variant="primary" onClick={openAdd}>
              <FiPlus /> Add Pattern
            </Button>
          </div>
        </div>
      </div>

      {/* Patterns */}
      {positionPatterns.length === 0 ? (
        <Card className="text-center p-5" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <Card.Body>
            <FiFileText size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
            <Card.Title style={{ fontWeight: 700 }}>No Pattern Configured</Card.Title>
            <Card.Text className="text-muted">Add a test pattern for this position</Card.Text>
            <Button variant="primary" onClick={openAdd}>
              <FiPlus /> Add Pattern
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {positionPatterns.map(pattern => (
            <Col xl={6} key={pattern.id}>
              <Card style={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}>
                <Card.Header style={{ 
                  background: '#f5f3ff', 
                  borderBottom: '1px solid #e2e8f0', 
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h6 style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Test Pattern</h6>
                    <small className="text-muted">{position.title}</small>
                  </div>
                  <div className="d-flex gap-1">
                    <Button variant="outline-warning" size="sm" onClick={() => openEdit(pattern)}>
                      <FiEdit size={14} />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(pattern.id)}>
                      <FiTrash2 size={14} />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={4}>
                      <small className="text-muted d-block">Total MCQs</small>
                      <span className="fw-bold fs-5">{pattern.totalMcqs}</span>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Time Limit</small>
                      <span className="fw-bold fs-5">{pattern.timeLimit} min</span>
                    </Col>
                    <Col md={4}>
                      <small className="text-muted d-block">Passing Marks</small>
                      <span className="fw-bold fs-5">{pattern.passingMarks}%</span>
                    </Col>
                  </Row>
                  
                  <div className="table-responsive">
                    <Table size="sm" className="mb-0">
                      <thead style={{ background: '#f1f5f9' }}>
                        <tr>
                          <th style={{ padding: '8px 12px' }}>Section</th>
                          <th style={{ padding: '8px 12px', textAlign: 'center' }}>MCQs</th>
                          <th style={{ padding: '8px 12px', textAlign: 'center' }}>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pattern.sections.map((sec, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '8px 12px' }}>{sec.name || `Section ${idx + 1}`}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>{sec.mcqs}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <Badge bg="primary">{sec.percentage}%</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {editingPattern ? '✏️ Edit' : '➕ Add'} Test Pattern
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">Total MCQs</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.totalMcqs}
                    onChange={e => setFormData({ ...formData, totalMcqs: +e.target.value })}
                    className="py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">Time Limit (min)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.timeLimit}
                    onChange={e => setFormData({ ...formData, timeLimit: +e.target.value })}
                    className="py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">Passing Marks (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.passingMarks}
                    onChange={e => setFormData({ ...formData, passingMarks: +e.target.value })}
                    className="py-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="fw-bold mb-0">Sections</Form.Label>
              <Button variant="outline-primary" size="sm" onClick={addSection}>
                <FiPlus /> Add Section
              </Button>
            </div>
            {formData.sections.map((sec, i) => (
              <div key={i} style={{ 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: 10, 
                padding: 14, 
                marginBottom: 10 
              }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>
                    Section {i + 1}
                  </span>
                  {formData.sections.length > 1 && (
                    <Button variant="outline-danger" size="sm" onClick={() => removeSection(i)}>
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      placeholder="Section name"
                      value={sec.name}
                      onChange={e => updateSection(i, 'name', e.target.value)}
                      className="mb-2"
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="number"
                      placeholder="MCQs"
                      value={sec.mcqs}
                      onChange={e => updateSection(i, 'mcqs', +e.target.value || 0)}
                      className="mb-2"
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      type="number"
                      placeholder="%"
                      value={sec.percentage}
                      onChange={e => updateSection(i, 'percentage', +e.target.value || 0)}
                      className="mb-2"
                    />
                  </Col>
                </Row>
              </div>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} className="px-4">
            {editingPattern ? 'Update' : 'Save'} Pattern
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PositionPatternsPage;