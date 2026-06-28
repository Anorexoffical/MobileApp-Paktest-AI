// ============================================================
// pages/McqsPage.jsx
// ============================================================
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiFilter } from 'react-icons/fi';
import { mcqs, papers, books, addMcq, updateMcq, deleteMcq } from '../data/store';

const McqsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    paperId: '',
    bookId: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'Easy',
    topic: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      question: '',
      paperId: '',
      bookId: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'Easy',
      topic: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ 
      ...item,
      options: item.options || ['', '', '', '']
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this MCQ?')) {
      deleteMcq(id);
      window.location.reload();
    }
  };

  const handleSave = () => {
    if (editingItem) {
      updateMcq(editingItem.id, formData);
    } else {
      addMcq(formData);
    }
    setShowModal(false);
    window.location.reload();
  };

  const filteredMcqs = mcqs.filter(m => {
    const matchesSearch = m.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || m.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h4>MCQs</h4>
          <p className="text-muted">Manage all multiple choice questions</p>
        </div>
        <Button variant="primary" onClick={handleAdd}>
          <FiPlus className="me-1" /> Add MCQ
        </Button>
      </div>

      <div className="filter-bar">
        <Form.Control
          type="text"
          placeholder="Search MCQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '250px' }}
        />
        <Form.Select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          style={{ maxWidth: '150px' }}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </Form.Select>
      </div>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Paper</th>
              <th>Book</th>
              <th>Difficulty</th>
              <th>Topic</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMcqs.map((mcq, index) => (
              <tr key={mcq.id}>
                <td>{index + 1}</td>
                <td style={{ maxWidth: '300px' }}>{mcq.question}</td>
                <td>{papers.find(p => p.id === mcq.paperId)?.title || 'N/A'}</td>
                <td>{books.find(b => b.id === mcq.bookId)?.title || 'N/A'}</td>
                <td>
                  <span className={`badge-custom ${mcq.difficulty.toLowerCase()}`}>
                    {mcq.difficulty}
                  </span>
                </td>
                <td>
                  <Badge bg="info">{mcq.topic}</Badge>
                </td>
                <td>
                  <div className="action-buttons">
                    <Button variant="outline-warning" size="sm" onClick={() => handleEdit(mcq)}>
                      <FiEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(mcq.id)}>
                      <FiTrash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="admin-modal" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Edit' : 'Add'} MCQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter question"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paper (Optional)</Form.Label>
                  <Form.Select
                    value={formData.paperId}
                    onChange={(e) => setFormData({ ...formData, paperId: e.target.value })}
                  >
                    <option value="">Select Paper</option>
                    {papers.map(paper => (
                      <option key={paper.id} value={paper.id}>{paper.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Book (Optional)</Form.Label>
                  <Form.Select
                    value={formData.bookId}
                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  >
                    <option value="">Select Book</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Options</Form.Label>
              {['A', 'B', 'C', 'D'].map((letter, idx) => (
                <Form.Control
                  key={idx}
                  className="mb-2"
                  placeholder={`Option ${letter}`}
                  value={formData.options[idx] || ''}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[idx] = e.target.value;
                    setFormData({ ...formData, options: newOptions });
                  }}
                />
              ))}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correct Answer</Form.Label>
              <Form.Select
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })}
              >
                <option value="0">A</option>
                <option value="1">B</option>
                <option value="2">C</option>
                <option value="3">D</option>
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Topic</Form.Label>
                  <Form.Control
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Enter topic"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Explanation</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Enter explanation"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editingItem ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default McqsPage;