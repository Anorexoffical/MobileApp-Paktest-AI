import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Table, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiSearch, FiBook, FiClock, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { useStore } from '../hooks/useStore';
import { addBook, updateBook, deleteBook } from '../data/store';

const blankBook = { 
  title: '', 
  author: '', 
  pages: '', 
  totalMcqs: '', 
  description: '' 
};

const PositionBooksPage = () => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const { positions, books } = useStore();
  const position = positions.find(p => p.id === positionId);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState(blankBook);

  if (!position) {
    return (
      <div className="text-center py-5">
        <h4>Position not found</h4>
        <Button variant="primary" onClick={() => navigate('/admin/positions')}>Back to Positions</Button>
      </div>
    );
  }

  const positionBooks = books.filter(b => b.positionId === positionId);
  const filteredBooks = positionBooks.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => { 
    setEditingBook(null); 
    setFormData({ ...blankBook, positionId }); 
    setShowModal(true); 
  };
  
  const openEdit = (book) => { 
    setEditingBook(book); 
    setFormData({ ...book }); 
    setShowModal(true); 
  };
  
  const handleDelete = (id) => { 
    if (window.confirm('Delete this book?')) deleteBook(id); 
  };
  
  const handleSave = () => {
    if (!formData.title.trim()) return;
    const data = { ...formData, positionId };
    editingBook ? updateBook(editingBook.id, data) : addBook(data);
    setShowModal(false);
  };

  return (
    <div className="admin-page" style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)', 
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
              <FiBook className="me-2" /> Books
            </h4>
            <p style={{ color: '#93c5fd', margin: 0 }}>
              {position.title} · {position.department} · {positionBooks.length} books
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
            <Link to={`/admin/position/${positionId}/patterns`}>
              <Button variant="outline-light" style={{ color: '#e2e8f0', borderColor: '#e2e8f0' }}>
                <FiFileText className="me-1" /> Pattern
              </Button>
            </Link>
            <Button variant="primary" onClick={openAdd}>
              <FiPlus /> Add Book
            </Button>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div style={{ position: 'relative', flex: '1', maxWidth: '350px' }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <Form.Control
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36, borderRadius: '10px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                Clear
              </Button>
              <Button variant="primary" onClick={openAdd}>
                <FiPlus /> Add Book
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ background: '#eff6ff', borderRadius: '8px' }}>
                <tr>
                  <th style={{ padding: '12px 16px' }}>#</th>
                  <th style={{ padding: '12px 16px' }}>Title</th>
                  <th style={{ padding: '12px 16px' }}>Author</th>
                  <th style={{ padding: '12px 16px' }}>Pages</th>
                  <th style={{ padding: '12px 16px' }}>MCQs</th>
                  <th style={{ padding: '12px 16px' }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div style={{ color: '#94a3b8' }}>
                        <FiBook size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                        <p className="mb-0">No books found</p>
                        <Button variant="primary" size="sm" className="mt-2" onClick={openAdd}>
                          <FiPlus /> Add First Book
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book, index) => (
                    <tr key={book.id}>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="text-muted">{index + 1}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <strong>{book.title}</strong>
                        {book.description && (
                          <div><small className="text-muted">{book.description}</small></div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>{book.author}</td>
                      <td style={{ padding: '12px 16px' }}>{book.pages}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge bg="info">{book.totalMcqs}</Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="d-flex gap-1 justify-content-center">
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            onClick={() => openEdit(book)}
                            style={{ borderRadius: '8px' }}
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(book.id)}
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
            {editingBook ? '✏️ Edit' : '➕ Add'} Book
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Book Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Computer Science for CSS"
                className="py-2"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Author</Form.Label>
                  <Form.Control
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                    className="py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Pages</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.pages}
                    onChange={e => setFormData({ ...formData, pages: +e.target.value })}
                    placeholder="0"
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
                placeholder="0"
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
                placeholder="Brief description of the book..."
                className="py-2"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            disabled={!formData.title.trim()}
            className="px-4"
          >
            {editingBook ? 'Update' : 'Save'} Book
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PositionBooksPage;