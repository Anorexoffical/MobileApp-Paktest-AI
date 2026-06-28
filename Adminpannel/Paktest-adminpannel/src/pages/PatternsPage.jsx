import React, { useState } from 'react';
import { Row, Col, Button, Modal, Form, Badge, Card } from 'react-bootstrap';
import { 
  FiPlus, FiEdit, FiTrash2, FiSearch, FiChevronDown, FiChevronUp, 
  FiBriefcase, FiBook, FiFileText, FiClock, FiGrid, FiLink,
  FiCheckCircle, FiCircle
} from 'react-icons/fi';
import { addPosition, updatePosition, deletePosition } from '../data/store';
import { useStore } from '../hooks/useStore';
import { Link } from 'react-router-dom';

// ── Position Form Modal ──────────────────────────────────────────────
const blankPos = { 
  title: '', 
  department: '', 
  bpsLevel: 'BPS-17', 
  description: '', 
  requirements: []
};

const PositionModal = ({ show, onHide, editingPos, onSave }) => {
  const [form, setForm] = useState(blankPos);

  React.useEffect(() => {
    if (show) {
      setForm(editingPos 
        ? { 
            ...editingPos, 
            requirements: Array.isArray(editingPos.requirements) 
              ? editingPos.requirements.join('\n') 
              : editingPos.requirements || '' 
          } 
        : { ...blankPos }
      );
    }
  }, [show, editingPos]);

  const handleSave = () => {
    if (!form.title.trim()) return;
    const data = {
      ...form,
      requirements: form.requirements 
        ? form.requirements.split('\n').map(r => r.trim()).filter(Boolean) 
        : [],
    };
    onSave(data);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {editingPos ? '✏️ Edit' : '➕ Add'} Position
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Position Title <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })} 
              placeholder="e.g., Accountant" 
              className="py-2"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Department</Form.Label>
            <Form.Control 
              value={form.department} 
              onChange={e => setForm({ ...form, department: e.target.value })} 
              placeholder="e.g., Finance Department" 
              className="py-2"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">BPS Level</Form.Label>
            <Form.Select 
              value={form.bpsLevel} 
              onChange={e => setForm({ ...form, bpsLevel: e.target.value })}
              className="py-2"
            >
              {['BPS-01','BPS-05','BPS-07','BPS-09','BPS-11','BPS-14','BPS-16','BPS-17','BPS-18','BPS-19','BPS-20'].map(b => 
                <option key={b}>{b}</option>
              )}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2} 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
              placeholder="Brief job description..." 
              className="py-2"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Requirements <small className="text-muted">(one per line)</small></Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              value={form.requirements} 
              onChange={e => setForm({ ...form, requirements: e.target.value })} 
              placeholder={"M.Com or MBA (Finance)\nAge: 21–28 (+5 Years Relaxation)\nComputer proficiency required"} 
              className="py-2"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={!form.title.trim()} className="px-4">
          {editingPos ? 'Update' : 'Save'} Position
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// ── Main Positions Page ──────────────────────────────────────────────
const PositionsPage = () => {
  const { positions, categories, categoryPositions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBPS, setFilterBPS] = useState('all');
  const [expanded, setExpanded] = useState({});

  const [showPosModal, setShowPosModal] = useState(false);
  const [editingPos, setEditingPos] = useState(null);

  const openAddPos = () => { setEditingPos(null); setShowPosModal(true); };
  const openEditPos = (pos) => { setEditingPos(pos); setShowPosModal(true); };
  const handleDeletePos = (id) => { 
    if (window.confirm('Delete this position?')) {
      deletePosition(id);
    }
  };
  const handleSavePos = (data) => {
    if (editingPos) {
      updatePosition(editingPos.id, data);
    } else {
      addPosition(data);
    }
    setShowPosModal(false);
  };

  const filteredPositions = positions.filter(pos => {
    const matchesSearch = pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pos.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBPS = filterBPS === 'all' || pos.bpsLevel === filterBPS;
    return matchesSearch && matchesBPS;
  });

  const bpsLevels = [...new Set(positions.map(p => p.bpsLevel))].sort();

  const getPositionCategories = (posId) => {
    const catIds = [];
    Object.keys(categoryPositions).forEach(catId => {
      if (categoryPositions[catId].includes(posId)) {
        catIds.push(catId);
      }
    });
    return catIds.map(id => categories.find(c => c.id === id)).filter(Boolean);
  };

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return (
    <div className="admin-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '24px 32px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>📋 Positions</h4>
            <p className="text-muted" style={{ margin: '4px 0 0' }}>{positions.length} total positions</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/categories">
              <Button variant="outline-primary" className="px-3">
                <FiGrid className="me-1" /> Categories
              </Button>
            </Link>
            <Button variant="primary" onClick={openAddPos} className="px-3">
              <FiPlus className="me-1" /> Add Position
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="d-flex gap-3 flex-wrap">
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <Form.Control
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, borderRadius: '8px' }}
            />
          </div>

          <Form.Select 
            value={filterBPS} 
            onChange={e => setFilterBPS(e.target.value)}
            style={{ maxWidth: '150px', borderRadius: '8px' }}
          >
            <option value="all">All BPS</option>
            {bpsLevels.map(bps => (
              <option key={bps} value={bps}>{bps}</option>
            ))}
          </Form.Select>

          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setSearchTerm('');
              setFilterBPS('all');
            }}
            style={{ borderRadius: '8px' }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Positions Grid */}
      <div>
        {filteredPositions.length === 0 ? (
          <Card className="text-center p-5" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Card.Body>
              <FiBriefcase size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
              <Card.Title style={{ fontWeight: 700 }}>No Positions Found</Card.Title>
              <Card.Text className="text-muted">
                {positions.length === 0 ? "Start by adding your first position!" : "Try adjusting your search criteria."}
              </Card.Text>
              {positions.length === 0 && (
                <Button variant="primary" onClick={openAddPos}>
                  <FiPlus /> Add Position
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {filteredPositions.map(pos => {
              const posCategories = getPositionCategories(pos.id);
              const isExpanded = expanded[pos.id];

              return (
                <Col xl={4} lg={6} key={pos.id}>
                  <Card style={{ 
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  }}
                  >
                    <Card.Body style={{ padding: '20px' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div style={{ flex: 1 }}>
                          <h6 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{pos.title}</h6>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{pos.department || 'No department'}</p>
                        </div>
                        <div className="d-flex gap-1" style={{ flexShrink: 0 }}>
                          <Button variant="outline-warning" size="sm" onClick={() => openEditPos(pos)} style={{ borderRadius: '8px' }}>
                            <FiEdit size={14} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeletePos(pos.id)} style={{ borderRadius: '8px' }}>
                            <FiTrash2 size={14} />
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => toggleExpand(pos.id)}
                            style={{ borderRadius: '8px' }}
                          >
                            {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                          </Button>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="d-flex gap-2 flex-wrap mb-3">
                        <Badge bg="primary" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>{pos.bpsLevel}</Badge>
                        {posCategories.length > 0 && (
                          <Badge bg="secondary" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                            {posCategories.length} Categories
                          </Badge>
                        )}
                      </div>

                      {/* Quick Links */}
                      <div className="d-flex gap-2 flex-wrap mb-3">
                        <Link to={`/admin/position/${pos.id}/solved-papers`}>
                          <Button variant="outline-success" size="sm" style={{ borderRadius: '8px', fontSize: '0.75rem' }}>
                            <FiCheckCircle className="me-1" size={12} /> Solved
                          </Button>
                        </Link>
                        <Link to={`/admin/position/${pos.id}/unsolved-papers`}>
                          <Button variant="outline-warning" size="sm" style={{ borderRadius: '8px', fontSize: '0.75rem' }}>
                            <FiClock className="me-1" size={12} /> Mock Tests
                          </Button>
                        </Link>
                        <Link to={`/admin/position/${pos.id}/books`}>
                          <Button variant="outline-info" size="sm" style={{ borderRadius: '8px', fontSize: '0.75rem' }}>
                            <FiBook className="me-1" size={12} /> Books
                          </Button>
                        </Link>
                        <Link to={`/admin/position/${pos.id}/patterns`}>
                          <Button variant="outline-purple" size="sm" style={{ borderRadius: '8px', fontSize: '0.75rem' }}>
                            <FiFileText className="me-1" size={12} /> Patterns
                          </Button>
                        </Link>
                      </div>

                      {/* Categories */}
                      {posCategories.length > 0 && (
                        <div className="mb-2">
                          <small className="text-muted">Categories:</small>
                          <div className="d-flex gap-1 flex-wrap mt-1">
                            {posCategories.map(cat => (
                              <Badge key={cat.id} bg="light" text="dark" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                                {cat.icon} {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                          {pos.description && (
                            <div>
                              <small className="text-muted fw-bold">Description:</small>
                              <p style={{ fontSize: '0.85rem', margin: '4px 0 8px', color: '#475569' }}>{pos.description}</p>
                            </div>
                          )}
                          {pos.requirements?.length > 0 && (
                            <div>
                              <small className="text-muted fw-bold">Requirements:</small>
                              <ul style={{ fontSize: '0.85rem', margin: '4px 0 0', paddingLeft: 16, color: '#475569' }}>
                                {pos.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      {/* Position Modal */}
      <PositionModal
        show={showPosModal}
        onHide={() => setShowPosModal(false)}
        editingPos={editingPos}
        onSave={handleSavePos}
      />
    </div>
  );
};

export default PositionsPage;