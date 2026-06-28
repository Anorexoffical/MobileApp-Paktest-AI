import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Table, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { 
  FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSearch, 
  FiCheckCircle, FiBook, FiFileText, FiClock
} from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addPaper, updatePaper, deletePaper } from '../data/store';

const blankPaper = { 
  title: '', 
  year: new Date().getFullYear(), 
  difficulty: 'Moderate', 
  duration: 90, 
  totalMcqs: 100, 
  description: '' 
};

const PositionSolvedPapersPage = () => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const { positions, papers } = useStore();
  const position = positions.find(p => p.id === positionId);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [formData, setFormData] = useState(blankPaper);

  if (!position) {
    return (
      <div className="text-center py-5">
        <h4>Position not found</h4>
        <Button variant="primary" onClick={() => navigate('/admin/positions')}>Back to Positions</Button>
      </div>
    );
  }

  const positionPapers = papers.filter(p => p.positionId === positionId && p.type === 'solved');
  const filteredPapers = positionPapers.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.year.toString().includes(searchTerm)
  );

  const openAdd = () => { 
    setEditingPaper(null); 
    setFormData({ ...blankPaper, positionId }); 
    setShowModal(true); 
  };
  
  const openEdit = (paper) => { 
    setEditingPaper(paper); 
    setFormData({ ...paper }); 
    setShowModal(true); 
  };
  
  const handleDelete = (id) => { 
    if (window.confirm('Delete this solved paper?')) deletePaper(id); 
  };
  
  const handleSave = () => {
    if (!formData.title.trim()) return;
    const data = { 
      ...formData, 
      positionId, 
      type: 'solved' 
    };
    editingPaper ? updatePaper(editingPaper.id, data) : addPaper(data);
    setShowModal(false);
  };

  const diffColor = { 
    Easy: 'success', 
    Moderate: 'primary', 
    Hard: 'warning', 
    Expert: 'danger' 
  };

  return (
    <div className="admin-page" style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', 
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
              <FiCheckCircle className="me-2" /> Solved Papers
            </h4>
            <p style={{ color: '#a7f3d0', margin: 0 }}>
              {position.title} · {position.department} · {positionPapers.length} papers
            </p>
          </div>
          <div className="d-flex gap-2">
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
            <Link to={`/admin/position/${positionId}/patterns`}>
              <Button variant="outline-light" style={{ color: '#e2e8f0', borderColor: '#e2e8f0' }}>
                <FiFileText className="me-1" /> Pattern
              </Button>
            </Link>
            <Button variant="success" onClick={openAdd} style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>
              <FiPlus /> Add Paper
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body className="text-center">
              <h2 className="text-success mb-0">{positionPapers.length}</h2>
              <small className="text-muted">Total Papers</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body className="text-center">
              <h2 className="text-primary mb-0">
                {positionPapers.reduce((sum, p) => sum + (p.totalMcqs || 0), 0)}
              </h2>
              <small className="text-muted">Total MCQs</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body className="text-center">
              <h2 className="text-warning mb-0">
                {positionPapers.filter(p => p.difficulty === 'Hard' || p.difficulty === 'Expert').length}
              </h2>
              <small className="text-muted">Hard/Expert</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body className="text-center">
              <h2 className="text-info mb-0">
                {Math.round(positionPapers.reduce((sum, p) => sum + (p.duration || 0), 0) / (positionPapers.length || 1))}m
              </h2>
              <small className="text-muted">Avg Duration</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Papers Table */}
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div style={{ position: 'relative', flex: '1', maxWidth: '350px' }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <Form.Control
                type="text"
                placeholder="Search papers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                Clear
              </Button>
              <Button variant="success" onClick={openAdd} style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>
                <FiPlus /> Add Paper
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ background: '#f0fdf4', borderRadius: '8px' }}>
                <tr>
                  <th style={{ padding: '12px 16px' }}>#</th>
                  <th style={{ padding: '12px 16px' }}>Title</th>
                  <th style={{ padding: '12px 16px' }}>Year</th>
                  <th style={{ padding: '12px 16px' }}>Difficulty</th>
                  <th style={{ padding: '12px 16px' }}>MCQs</th>
                  <th style={{ padding: '12px 16px' }}>Duration</th>
                  <th style={{ padding: '12px 16px' }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPapers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div style={{ color: '#94a3b8' }}>
                        <FiCheckCircle size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                        <p className="mb-0">No solved papers found</p>
                        <Button variant="success" size="sm" className="mt-2" onClick={openAdd} style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>
                          <FiPlus /> Add First Paper
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPapers.map((paper, index) => (
                    <tr key={paper.id}>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="text-muted">{index + 1}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <strong>{paper.title}</strong>
                        {paper.description && (
                          <div><small className="text-muted">{paper.description}</small></div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>{paper.year}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge bg={diffColor[paper.difficulty] || 'secondary'}>
                          {paper.difficulty}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge bg="info" style={{ fontSize: '0.85rem' }}>
                          {paper.totalMcqs}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>{paper.duration} min</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="d-flex gap-1 justify-content-center">
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            onClick={() => openEdit(paper)}
                            style={{ borderRadius: '8px' }}
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(paper.id)}
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
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {editingPaper ? '✏️ Edit' : '➕ Add'} Solved Paper
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Paper Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., PPSC Computer Science 2024"
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
            </Row>

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

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the paper..."
                className="py-2"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button 
            variant="success" 
            onClick={handleSave} 
            disabled={!formData.title.trim()}
            className="px-4"
            style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
          >
            {editingPaper ? 'Update' : 'Save'} Paper
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PositionSolvedPapersPage;