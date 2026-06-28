import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Table, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { 
  FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSearch, 
  FiClock, FiBook, FiFileText, FiUsers, FiCheckCircle
} from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addMockTest, updateMockTest, deleteMockTest } from '../data/store';

const blankMock = { 
  title: '', 
  year: new Date().getFullYear(), 
  difficulty: 'Moderate', 
  duration: 90, 
  totalMcqs: 100, 
  attempts: 0, 
  active: true,
  description: '' 
};

const UnsolvedPapersPage = () => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const { positions, mockTests } = useStore();
  const position = positions.find(p => p.id === positionId);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMock, setEditingMock] = useState(null);
  const [formData, setFormData] = useState(blankMock);

  if (!position) {
    return (
      <div className="text-center py-5">
        <h4>Position not found</h4>
        <Button variant="primary" onClick={() => navigate('/admin/positions')}>Back to Positions</Button>
      </div>
    );
  }

  const positionMocks = mockTests.filter(m => m.positionId === positionId);
  const filteredMocks = positionMocks.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.year.toString().includes(searchTerm)
  );

  const openAdd = () => { 
    setEditingMock(null); 
    setFormData({ ...blankMock, positionId }); 
    setShowModal(true); 
  };
  
  const openEdit = (mock) => { 
    setEditingMock(mock); 
    setFormData({ ...mock }); 
    setShowModal(true); 
  };
  
  const handleDelete = (id) => { 
    if (window.confirm('Delete this mock test? All attempts data will be lost.')) deleteMockTest(id); 
  };
  
  const handleSave = () => {
    if (!formData.title.trim()) return;
    const data = { 
      ...formData, 
      positionId,
      attempts: +formData.attempts || 0
    };
    editingMock ? updateMockTest(editingMock.id, data) : addMockTest(data);
    setShowModal(false);
  };

  const diffColor = { 
    Easy: 'success', 
    Moderate: 'primary', 
    Hard: 'warning', 
    Expert: 'danger' 
  };

  const totalAttempts = positionMocks.reduce((sum, m) => sum + (m.attempts || 0), 0);

  return (
    <div className="admin-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
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
              <FiClock className="me-2" /> Mock Tests
            </h4>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              {position.title} · {position.department} · {positionMocks.length} tests
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to={`/admin/position/${positionId}/solved-papers`}>
              <Button variant="outline-success" style={{ color: '#86efac', borderColor: '#86efac' }}>
                <FiCheckCircle className="me-1" /> Solved Papers
              </Button>
            </Link>
            <Link to={`/admin/position/${positionId}/books`}>
              <Button variant="outline-info" style={{ color: '#67e8f9', borderColor: '#67e8f9' }}>
                <FiBook className="me-1" /> Books
              </Button>
            </Link>
            <Link to={`/admin/position/${positionId}/patterns`}>
              <Button variant="outline-purple" style={{ color: '#a78bfa', borderColor: '#a78bfa' }}>
                <FiFileText className="me-1" /> Pattern
              </Button>
            </Link>
            <Button variant="warning" onClick={openAdd} style={{ color: '#1e293b', fontWeight: 600 }}>
              <FiPlus /> Add Mock Test
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body className="text-center">
              <h2 className="text-warning mb-0">{positionMocks.length}</h2>
              <small className="text-muted">Total Tests</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body className="text-center">
              <h2 className="text-info mb-0">
                {positionMocks.reduce((sum, m) => sum + (m.totalMcqs || 0), 0)}
              </h2>
              <small className="text-muted">Total MCQs</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body className="text-center">
              <h2 className="text-success mb-0">
                {positionMocks.filter(m => m.active).length}
              </h2>
              <small className="text-muted">Active Tests</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body className="text-center">
              <h2 className="text-primary mb-0">
                {totalAttempts.toLocaleString()}
              </h2>
              <small className="text-muted">Total Attempts</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tests Table */}
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div style={{ position: 'relative', flex: '1', maxWidth: '350px' }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <Form.Control
                type="text"
                placeholder="Search mock tests..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                Clear
              </Button>
              <Button variant="warning" onClick={openAdd} style={{ color: '#1e293b', fontWeight: 600 }}>
                <FiPlus /> Add Mock Test
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ background: '#f8fafc', borderRadius: '8px' }}>
                <tr>
                  <th style={{ padding: '12px 16px' }}>#</th>
                  <th style={{ padding: '12px 16px' }}>Title</th>
                  <th style={{ padding: '12px 16px' }}>Year</th>
                  <th style={{ padding: '12px 16px' }}>Difficulty</th>
                  <th style={{ padding: '12px 16px' }}>MCQs</th>
                  <th style={{ padding: '12px 16px' }}>Duration</th>
                  <th style={{ padding: '12px 16px' }}>Attempts</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMocks.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <div style={{ color: '#94a3b8' }}>
                        <FiClock size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                        <p className="mb-0">No mock tests found</p>
                        <Button variant="warning" size="sm" className="mt-2" onClick={openAdd}>
                          <FiPlus /> Add First Mock Test
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMocks.map((mock, index) => (
                    <tr key={mock.id}>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="text-muted">{index + 1}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <strong>{mock.title}</strong>
                        {mock.description && (
                          <div><small className="text-muted">{mock.description}</small></div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>{mock.year}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge bg={diffColor[mock.difficulty] || 'secondary'}>
                          {mock.difficulty}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge bg="info" style={{ fontSize: '0.85rem' }}>
                          {mock.totalMcqs}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>{mock.duration} min</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge bg="secondary">
                          <FiUsers className="me-1" /> {mock.attempts || 0}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge bg={mock.active ? 'success' : 'secondary'}>
                          {mock.active ? '🟢 Live' : '⚪ Draft'}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="d-flex gap-1 justify-content-center">
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            onClick={() => openEdit(mock)}
                            style={{ borderRadius: '8px' }}
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(mock.id)}
                            style={{ borderRadius: '8px' }}
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ borderBottom: '2px solid #e2e8f0' }}>
          <Modal.Title className="fw-bold">
            {editingMock ? '✏️ Edit' : '➕ Add'} Mock Test
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Mock Test Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., PPSC Computer Science Mock 2024"
                className="py-2"
              />
            </Form.Group>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                    className="py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Difficulty</Form.Label>
                  <Form.Select
                    value={formData.difficulty}
                    onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                    className="py-2"
                  >
                    <option>Easy</option>
                    <option>Moderate</option>
                    <option>Hard</option>
                    <option>Expert</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Status</Form.Label>
                  <Form.Select
                    value={formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.value === 'true' })}
                    className="py-2"
                  >
                    <option value="true">🟢 Live</option>
                    <option value="false">⚪ Draft</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total MCQs</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.totalMcqs}
                    onChange={e => setFormData({ ...formData, totalMcqs: +e.target.value })}
                    placeholder="100"
                    className="py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Duration (min)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: +e.target.value })}
                    placeholder="90"
                    className="py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Total Attempts</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.attempts}
                    onChange={e => setFormData({ ...formData, attempts: +e.target.value })}
                    placeholder="0"
                    className="py-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the mock test..."
                className="py-2"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '2px solid #e2e8f0' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button 
            variant="warning" 
            onClick={handleSave} 
            disabled={!formData.title.trim()}
            className="px-4"
            style={{ color: '#1e293b', fontWeight: 600 }}
          >
            {editingMock ? 'Update' : 'Save'} Mock Test
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UnsolvedPapersPage;