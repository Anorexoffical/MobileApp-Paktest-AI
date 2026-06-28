import React, { useState } from 'react';
import { Row, Col, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiLink, FiBriefcase, FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi';
import { addCategory, updateCategory, deleteCategory, addPosition, updatePosition, deletePosition, setCategoryPositions } from '../data/store';
import { useStore } from '../hooks/useStore';
import { Link } from 'react-router-dom';

// ── Position Card (Compact) ────────────────────────────────────────────
const PositionCardCompact = ({ pos, onUnlink, onEdit, onDelete }) => (
  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <h6 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{pos.title}</h6>
      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
        <span style={{ background: '#eef2ff', color: '#4f46e5', borderRadius: 999, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700 }}>{pos.bpsLevel}</span>
        <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 999, padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700 }}>{pos.department}</span>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 4 }}>
      <Button variant="outline-warning" size="sm" onClick={() => onEdit(pos)}><FiEdit size={14} /></Button>
      <Button variant="outline-danger" size="sm" onClick={() => onDelete(pos.id)}><FiTrash2 size={14} /></Button>
      <Button variant="outline-secondary" size="sm" onClick={() => onUnlink(pos.id)}><FiX size={14} /></Button>
    </div>
  </div>
);

// ── Link Positions Modal ──────────────────────────────────────────────
const LinkPositionsModal = ({ show, onHide, categoryId, positions, linkedPositionIds, onLink, onUnlink }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPositions, setSelectedPositions] = useState([]);

  const availablePositions = positions.filter(p => !linkedPositionIds.includes(p.id));
  const filteredPositions = availablePositions.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePosition = (posId) => {
    setSelectedPositions(prev =>
      prev.includes(posId)
        ? prev.filter(id => id !== posId)
        : [...prev, posId]
    );
  };

  const handleLinkAll = () => {
    selectedPositions.forEach(id => onLink(categoryId, id));
    setSelectedPositions([]);
  };

  const handleUnlinkPosition = (posId) => {
    onUnlink(categoryId, posId);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FiLink className="me-2" /> Link Positions to Category
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Currently Linked Positions */}
        {linkedPositionIds.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold mb-2">Linked Positions ({linkedPositionIds.length})</h6>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {linkedPositionIds.map(id => {
                const pos = positions.find(p => p.id === id);
                return pos ? (
                  <div key={id} style={{ background: '#f1f5f9', borderRadius: 8, padding: '8px 12px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="fw-bold">{pos.title}</span>
                      <span className="text-muted ms-2" style={{ fontSize: '0.85rem' }}>{pos.department}</span>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => handleUnlinkPosition(id)}>
                      <FiX size={14} />
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        <hr />

        {/* Search and Link New Positions */}
        <div>
          <h6 className="fw-bold mb-3">Available Positions</h6>
          <div className="d-flex gap-2 mb-3">
            <div style={{ position: 'relative', flex: 1 }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <Form.Control
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
            <Button 
              variant="primary" 
              onClick={handleLinkAll}
              disabled={selectedPositions.length === 0}
            >
              Link Selected ({selectedPositions.length})
            </Button>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredPositions.length === 0 ? (
              <p className="text-muted text-center py-4">No positions available to link</p>
            ) : (
              filteredPositions.map(pos => (
                <div 
                  key={pos.id} 
                  onClick={() => togglePosition(pos.id)}
                  style={{
                    padding: '10px 14px',
                    marginBottom: 6,
                    background: selectedPositions.includes(pos.id) ? '#eef2ff' : '#f8fafc',
                    border: `2px solid ${selectedPositions.includes(pos.id) ? '#6366f1' : '#e2e8f0'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div className="fw-bold">{pos.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {pos.department} · {pos.bpsLevel}
                    </div>
                  </div>
                  {selectedPositions.includes(pos.id) && (
                    <Badge bg="primary">Selected</Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

// ── Category Modal ─────────────────────────────────────────────────────
const blankCat = { name: '', fullName: '', description: '', icon: '🏛️' };

const CategoryModal = ({ show, onHide, editingCat, onSave }) => {
  const [form, setForm] = useState(blankCat);

  React.useEffect(() => {
    if (show) {
      setForm(editingCat || blankCat);
    }
  }, [show, editingCat]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingCat ? 'Edit' : 'Add'} Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs={3}>
              <Form.Group className="mb-3">
                <Form.Label>Icon</Form.Label>
                <Form.Control 
                  value={form.icon} 
                  onChange={e => setForm({ ...form, icon: e.target.value })} 
                  placeholder="🏛️" 
                  style={{ fontSize: '1.3rem', textAlign: 'center' }} 
                />
              </Form.Group>
            </Col>
            <Col xs={9}>
              <Form.Group className="mb-3">
                <Form.Label>Short Name <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g., PPSC" 
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control 
              value={form.fullName} 
              onChange={e => setForm({ ...form, fullName: e.target.value })} 
              placeholder="e.g., Punjab Public Service Commission" 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
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
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={() => {
          if (form.name.trim()) {
            onSave(form);
            onHide();
          }
        }}>{editingCat ? 'Update' : 'Save'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

// ── Main Categories Page ──────────────────────────────────────────────
const CategoriesPage = () => {
  const { categories, positions, categoryPositions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState({});

  // Category modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  // Link positions modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  // ── Category handlers ──
  const openAddCat = () => { setEditingCat(null); setShowCatModal(true); };
  const openEditCat = (cat) => { setEditingCat(cat); setShowCatModal(true); };
  const handleDeleteCat = (id) => { 
    if (window.confirm('Delete this category and all its links?')) {
      deleteCategory(id);
      const newCategoryPositions = { ...categoryPositions };
      delete newCategoryPositions[id];
      setCategoryPositions(newCategoryPositions);
    }
  };
  const handleSaveCat = (data) => {
    editingCat ? updateCategory(editingCat.id, data) : addCategory(data);
    setShowCatModal(false);
  };

  // ── Link handlers ──
  const openLinkModal = (catId) => {
    setSelectedCategoryId(catId);
    setShowLinkModal(true);
  };

  const handleLinkPosition = (categoryId, positionId) => {
    const current = categoryPositions[categoryId] || [];
    if (!current.includes(positionId)) {
      setCategoryPositions({
        ...categoryPositions,
        [categoryId]: [...current, positionId]
      });
    }
  };

  const handleUnlinkPosition = (categoryId, positionId) => {
    const current = categoryPositions[categoryId] || [];
    setCategoryPositions({
      ...categoryPositions,
      [categoryId]: current.filter(id => id !== positionId)
    });
  };

  // ── Position handlers ──
  const handleDeletePos = (id) => { 
    if (window.confirm('Delete this position?')) {
      deletePosition(id);
      const newCategoryPositions = { ...categoryPositions };
      Object.keys(newCategoryPositions).forEach(catId => {
        newCategoryPositions[catId] = newCategoryPositions[catId].filter(posId => posId !== id);
      });
      setCategoryPositions(newCategoryPositions);
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h4>Test Categories</h4>
          <p className="text-muted">{categories.length} categories · {positions.length} positions</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/positions">
            <Button variant="outline-primary">
              <FiBriefcase className="me-1" /> Manage Positions
            </Button>
          </Link>
          <Button variant="primary" onClick={openAddCat}>
            <FiPlus /> Add Category
          </Button>
        </div>
      </div>

      <div className="filter-bar mb-4">
        <Form.Control 
          type="text" 
          placeholder="Search categories..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          style={{ maxWidth: 320 }} 
        />
      </div>

      {filtered.map(cat => {
        const catPositions = (categoryPositions[cat.id] || []).map(id => positions.find(p => p.id === id)).filter(Boolean);
        const isOpen = expanded[cat.id] !== false;

        return (
          <div key={cat.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {/* Category Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'linear-gradient(135deg,#f8fafc,#f0f4ff)', borderBottom: isOpen ? '1px solid #e2e8f0' : 'none', cursor: 'pointer' }} onClick={() => toggleExpand(cat.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                  {cat.icon || '🏛️'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{cat.name}</h5>
                    <Badge bg="primary" style={{ fontSize: '0.72rem' }}>{catPositions.length} Positions</Badge>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{cat.fullName}</p>
                  {cat.description && <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{cat.description}</p>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                <Button variant="outline-primary" size="sm" onClick={() => openLinkModal(cat.id)}>
                  <FiLink /> Link Positions
                </Button>
                <Button variant="outline-warning" size="sm" onClick={() => openEditCat(cat)}>
                  <FiEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCat(cat.id)}>
                  <FiTrash2 />
                </Button>
                <span style={{ color: '#94a3b8', marginLeft: 4 }}>
                  {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </span>
              </div>
            </div>

            {/* Positions Grid */}
            {isOpen && (
              <div style={{ padding: '20px 24px' }}>
                {catPositions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                    <FiBriefcase size={36} style={{ marginBottom: 10, opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>No positions linked yet.</p>
                    <Button variant="primary" size="sm" style={{ marginTop: 12 }} onClick={() => openLinkModal(cat.id)}>
                      <FiLink /> Link Positions
                    </Button>
                  </div>
                ) : (
                  <div>
                    {catPositions.map(pos => (
                      <PositionCardCompact
                        key={pos.id}
                        pos={pos}
                        onUnlink={(posId) => handleUnlinkPosition(cat.id, posId)}
                        onEdit={(pos) => window.location.href = `/admin/positions?edit=${pos.id}`}
                        onDelete={handleDeletePos}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <p style={{ fontSize: '1rem' }}>No categories found.</p>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal 
        show={showCatModal}
        onHide={() => setShowCatModal(false)}
        editingCat={editingCat}
        onSave={handleSaveCat}
      />

      {/* Link Positions Modal */}
      <LinkPositionsModal
        show={showLinkModal}
        onHide={() => setShowLinkModal(false)}
        categoryId={selectedCategoryId}
        positions={positions}
        linkedPositionIds={selectedCategoryId ? (categoryPositions[selectedCategoryId] || []) : []}
        onLink={handleLinkPosition}
        onUnlink={handleUnlinkPosition}
      />
    </div>
  );
};

export default CategoriesPage;