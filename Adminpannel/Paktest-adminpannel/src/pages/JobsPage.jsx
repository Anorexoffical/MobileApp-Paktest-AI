import React, { useState } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { addJob, updateJob, deleteJob } from '../data/store';
import { useStore } from '../hooks/useStore';

const JobsPage = () => {
  const navigate = useNavigate();
  const { jobs, categories } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const blank = { title: '', categoryId: '', department: '', bpsLevel: '', openSeats: '', category: '', description: '', requirements: '' };
  const [formData, setFormData] = useState(blank);

  const openAdd = () => { setEditingItem(null); setFormData(blank); setShowModal(true); };
  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item, requirements: Array.isArray(item.requirements) ? item.requirements.join(', ') : item.requirements || '' });
    setShowModal(true);
  };
  const handleDelete = (id) => { if (window.confirm('Delete this job?')) deleteJob(id); };
  const handleSave = () => {
    if (!formData.title.trim()) return;
    const data = { ...formData, requirements: formData.requirements ? String(formData.requirements).split(',').map(r => r.trim()).filter(Boolean) : [] };
    editingItem ? updateJob(editingItem.id, data) : addJob(data);
    setShowModal(false);
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !filterCategory || j.categoryId === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h4>Job Positions</h4>
          <p className="text-muted">Manage all job positions ({jobs.length} total)</p>
        </div>
        <Button variant="primary" onClick={openAdd}><FiPlus /> Add Job</Button>
      </div>

      <div className="filter-bar">
        <Form.Control type="text" placeholder="Search jobs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ maxWidth: 260 }} />
        <Form.Select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Form.Select>
      </div>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr><th>Title</th><th>Category</th><th>Department</th><th>BPS</th><th>Seats</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-muted">No jobs found</td></tr>}
            {filtered.map(job => (
              <tr key={job.id}>
                <td><strong>{job.title}</strong></td>
                <td><Badge bg="info">{categories.find(c => c.id === job.categoryId)?.name || 'N/A'}</Badge></td>
                <td>{job.department}</td>
                <td>{job.bpsLevel}</td>
                <td><Badge bg="success">{job.openSeats}</Badge></td>
                <td>
                  <div className="action-buttons">
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/admin/jobs/${job.id}`)}><FiEye /></Button>
                    <Button variant="outline-warning" size="sm" onClick={() => openEdit(job)}><FiEdit /></Button>
                    <Button variant="outline-danger"  size="sm" onClick={() => handleDelete(job.id)}><FiTrash2 /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>{editingItem ? 'Edit' : 'Add'} Job Position</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Lecturer Computer Science" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                    <option value="">Select</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="e.g., Higher Education Department" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>BPS Level</Form.Label>
                  <Form.Control value={formData.bpsLevel} onChange={e => setFormData({ ...formData, bpsLevel: e.target.value })} placeholder="e.g., BPS-17" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Open Seats</Form.Label>
                  <Form.Control type="number" value={formData.openSeats} onChange={e => setFormData({ ...formData, openSeats: e.target.value })} placeholder="0" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief job description..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Requirements <small className="text-muted">(comma separated)</small></Form.Label>
              <Form.Control as="textarea" rows={2} value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} placeholder="e.g., MS degree, 3+ years experience, Age: 21-35" />
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

export default JobsPage;
