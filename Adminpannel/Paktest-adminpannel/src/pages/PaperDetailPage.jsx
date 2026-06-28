// ============================================================
// pages/PaperDetailPage.jsx
// ============================================================
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Form } from 'react-bootstrap';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { papers, mcqs, getMcqsForPaper, addMcq, deleteMcq } from '../data/store';

const PaperDetailPage = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const paper = papers.find(p => p.id === paperId);
  const paperMcqs = getMcqsForPaper(paperId);
  const [searchTerm, setSearchTerm] = useState('');

  if (!paper) {
    return <div className="text-center py-5">Paper not found</div>;
  }

  const filteredMcqs = paperMcqs.filter(m => 
    m.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/papers')}
            className="me-2"
          >
            <FiArrowLeft /> Back
          </Button>
          <h4 className="d-inline-block">{paper.title}</h4>
          <p className="text-muted">
            <span className={`badge-custom ${paper.type}`}>{paper.type}</span>
            <span className={`badge-custom ${paper.difficulty.toLowerCase()} ms-2`}>
              {paper.difficulty}
            </span>
            <span className="ms-2">{paper.year}</span>
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/mcqs')}>
          <FiPlus /> Add MCQ
        </Button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-number">{paper.totalMcqs}</div>
          <div className="stat-label">Total MCQs</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{paper.duration} min</div>
          <div className="stat-label">Duration</div>
        </div>
        <div className="stat-card info">
          <div className="stat-number">{paperMcqs.length}</div>
          <div className="stat-label">Added MCQs</div>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span>MCQs ({paperMcqs.length})</span>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Search MCQs..."
                style={{ maxWidth: '250px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" size="sm" onClick={() => navigate('/admin/mcqs')}>
                <FiPlus /> Add MCQ
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {filteredMcqs.length === 0 ? (
            <p className="text-muted text-center py-3">No MCQs found</p>
          ) : (
            filteredMcqs.map((mcq, index) => (
              <div key={mcq.id} className="mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{index + 1}. {mcq.question}</strong>
                    <div className="mt-2">
                      {mcq.options.map((opt, idx) => (
                        <div 
                          key={idx} 
                          className={idx === mcq.correctAnswer ? 'text-success fw-bold' : ''}
                        >
                          {String.fromCharCode(65 + idx)}. {opt} 
                          {idx === mcq.correctAnswer && <FiCheck className="text-success ms-1" />}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1">
                      <Badge bg="secondary">{mcq.difficulty}</Badge>
                      <Badge bg="info" className="ms-1">{mcq.topic}</Badge>
                    </div>
                    {mcq.explanation && (
                      <small className="text-muted d-block mt-1">
                        💡 {mcq.explanation}
                      </small>
                    )}
                  </div>
                  <div className="action-buttons">
                    <Button variant="outline-warning" size="sm">
                      <FiEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => deleteMcq(mcq.id)}>
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaperDetailPage;