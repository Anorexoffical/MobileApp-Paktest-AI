import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Badge, Card, Table, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiBriefcase, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addJob, updateJob, deleteJob, toggleJobStatus } from '../data/store';
import { useNavigate } from 'react-router-dom';

const BPS_LEVELS = ['BPS-14', 'BPS-15', 'BPS-16', 'BPS-17', 'BPS-18', 'BPS-19', 'BPS-20'];

const Jobs = () => {
  const { jobs, positions, categories } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    jobPostId: '',
    title: '',
    positionId: '',
    testConductBodyId: '',
    department: '',
    bpsLevel: '',
    openSeats: '',
    description: '',
    requirements: '',
    lastDate: '',
    isActive: true
  });
  const [deleteId, setDeleteId] = useState(null);
  const [filterBody, setFilterBody] = useState('');

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.jobPostId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBody = filterBody ? j.testConductBodyId === filterBody : true;
    return matchSearch && matchBody;
  });

  const getPositionTitle = (id) => {
    const pos = positions.find(p => p.id === id);
    return pos ? pos.title : 'Not linked';
  };

  const getBodyName = (id) => {
    const body = categories.find(c => c.id === id);
    return body ? `${body.icon} ${body.name}` : 'Not linked';
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      jobPostId: `JP-${Date.now()}`,
      title: '',
      positionId: '',
      testConductBodyId: filterBody || '',
      department: '',
      bpsLevel: '',
      openSeats: '',
      description: '',
      requirements: '',
      lastDate: '',
      isActive: true
    });
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditing(job);
    setForm(job);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.positionId || !form.testConductBodyId) return;
    const data = {
      ...form,
      openSeats: parseInt(form.openSeats) || 0
    };
    editing ? updateJob(editing.id, data) : addJob(data);
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteJob(deleteId);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = (id) => {
    toggleJobStatus(id);
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
              Job Posts
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>
              {jobs.length} job posts available
            </p>
          </div>
          <Button variant="light" onClick={openAdd}>
            <FiPlus className="me-2" /> Add Job Post
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
              placeholder="Search jobs..."
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
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Job ID</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Position</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Test Body</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Seats</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>💼</div>
                    <h5 style={{ color: '#475569' }}>No job posts found</h5>
                    <Button variant="primary" onClick={openAdd} className="mt-2">
                      <FiPlus /> Add Job Post
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((job, idx) => (
                  <tr key={job.id}>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg="primary">{job.jobPostId}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>{job.title}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg="info">{getPositionTitle(job.positionId)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge bg="secondary">{getBodyName(job.testConductBodyId)}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <Badge bg="warning">{job.openSeats || 0}</Badge>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      {job.isActive ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="danger">Closed</Badge>
                      )}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button 
                          variant={job.isActive ? "outline-danger" : "outline-success"} 
                          size="sm" 
                          onClick={() => handleToggleStatus(job.id)}
                          title={job.isActive ? "Close" : "Activate"}
                        >
                          {job.isActive ? <FiXCircle size={14} /> : <FiCheckCircle size={14} />}
                        </Button>
                        <Button variant="outline-warning" size="sm" onClick={() => openEdit(job)}>
                          <FiEdit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => setDeleteId(job.id)}>
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

      {/* Add/Edit Job Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{editing ? 'Edit' : 'Add'} Job Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Job Post ID</Form.Label>
                  <Form.Control
                    value={form.jobPostId}
                    onChange={e => setForm({ ...form, jobPostId: e.target.value })}
                    placeholder="e.g., JP-2024-001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Assistant Director Finance"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Test Body <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={form.testConductBodyId}
                    onChange={e => setForm({ ...form, testConductBodyId: e.target.value })}
                  >
                    <option value="">Select Test Body</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Department</Form.Label>
                  <Form.Control
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    placeholder="e.g., Finance"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">BPS Level</Form.Label>
                  <Form.Select
                    value={form.bpsLevel}
                    onChange={e => setForm({ ...form, bpsLevel: e.target.value })}
                  >
                    <option value="">Select BPS</option>
                    {BPS_LEVELS.map(bps => (
                      <option key={bps} value={bps}>{bps}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Open Seats</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.openSeats}
                    onChange={e => setForm({ ...form, openSeats: e.target.value })}
                    placeholder="10"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Last Date</Form.Label>
              <Form.Control
                type="date"
                value={form.lastDate}
                onChange={e => setForm({ ...form, lastDate: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Job description..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.requirements}
                onChange={e => setForm({ ...form, requirements: e.target.value })}
                placeholder="• Bachelor's degree\n• 2-3 years experience"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Active"
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
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
          <Modal.Title className="fw-bold">Delete Job Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this job post?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Jobs;