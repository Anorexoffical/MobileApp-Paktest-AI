import React, { useState } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { addPaper, updatePaper, deletePaper } from '../data/store';
import { useStore } from '../hooks/useStore';

const blank = { title: '', jobId: '', year: '', difficulty: 'Moderate', duration: 90, totalMcqs: 100, type: 'solved', description: '' };

const PapersPage = () => {
  const navigate = useNavigate();
  const { papers, jobs } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(blank);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('');

  const openAdd  = () => { setEditingItem(null); setFormData(blank); setShowModal(true); };
  const openEdit = (item) => { setEditingItem(item); setFormData({ ...item }); setShowModal(true); };
  const handleDelete = (id) => { if (window.confirm('Delete this paper?')) deletePaper(id); };
  const handleSave = () => {
    if (!formData.title.trim()) return;
    editingItem ? updatePaper(editingItem.id, formData) : addPaper(formData);
    setShowModal(false);
  };

  const filtered = papers.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJob    = !filterJob || p.jobId === filterJob;
    return matchSearch && matchJob;
  });

  const diffColor = { Easy: 'success', Moderate: 'primary', Hard: 'warning', Expert: 'danger' };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h4>Papers</h4>
          <p className="text-muted">Manage solved and unsolved past papers ({papers.length} total)</p>
        </div>
        <Button variant="primary" onClick={openAdd}><FiPlus /> Add Paper</Button>
      </div>

      <div className="filter-bar">
        <Form.Control type="text" placeholder="Search papers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ maxWidth: 260 }} />
        <Form.Select value={filterJob} onChange={e => setFilterJob(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="">All Jobs</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </Form.Select>
      </div>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr><th>Title</th><th>Job</th><th>Year</th><th>Type</th><th>Difficulty</th><th>Duration</th><th>MCQs</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-4 text-muted">No papers found</td></tr>}
            {filtered.map(paper => (
              <tr key={paper.id}>
                <td><strong>{paper.title}</strong></td>
                <td><small>{jobs.find(j => j.id === paper.jobId)?.title || 'N/A'}</small></td>
                <td>{paper.year}</td>
                <td><span className={`badge-custom ${paper.type}`}>{paper.type}</span></td>
                <td><Badge bg={diffColor[paper.difficulty] || 'secondary'}>{paper.difficulty}</Badge></td>
                <td>{paper.duration} min</td>
                <td>{paper.totalMcqs}</td>
                <td>
                  <div className="action-buttons">
                    <Button variant="outline-info"    size="sm" onClick={() => navigate(`/admin/papers/${paper.id}`)}><FiEye /></Button>
                    <Button variant="outline-warning" size="sm" onClick={() => openEdit(paper)}><FiEdit /></Button>
                    <Button variant="outline-danger"  size="sm" onClick={() => handleDelete(paper.id)}><FiTrash2 /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>{editingItem ? 'Edit' : 'Add'} Paper</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Paper Title <span className="text-danger">*</span></Form.Label>
              <Form.Control value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., PPSC Lecturer CS 2024" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Position</Form.Label>
                  <Form.Select value={formData.jobId} onChange={e => setFormData({ ...formData, jobId: e.target.value })}>
                    <option value="">Select Job</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} placeholder="2024" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="solved">Solved</option>
                    <option value="unsolved">Unsolved</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                    <option>Easy</option><option>Moderate</option><option>Hard</option><option>Expert</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (min)</Form.Label>
                  <Form.Control type="number" value={formData.duration} onChange={e => setFormData({ ...formData, duration: +e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Total MCQs</Form.Label>
                  <Form.Control type="number" value={formData.totalMcqs} onChange={e => setFormData({ ...formData, totalMcqs: +e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editingItem ? 'Update' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PapersPage;
