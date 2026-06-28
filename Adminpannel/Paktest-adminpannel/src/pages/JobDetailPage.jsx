// ============================================================
// pages/JobDetailPage.jsx
// ============================================================
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiFileText, FiBook, FiCheckCircle } from 'react-icons/fi';
import { jobs, papers, books, testPatterns, getPapersForJob, getBooksForJob, getPatternForJob } from '../data/store';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === jobId);
  const jobPapers = getPapersForJob(jobId);
  const jobBooks = getBooksForJob(jobId);
  const jobPattern = getPatternForJob(jobId);

  if (!job) {
    return <div className="text-center py-5">Job not found</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/jobs')}
            className="me-2"
          >
            <FiArrowLeft /> Back
          </Button>
          <h4 className="d-inline-block">{job.title}</h4>
          <p className="text-muted">{job.department} • {job.bpsLevel}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="primary" size="sm">
            <FiPlus /> Add Paper
          </Button>
          <Button variant="success" size="sm">
            <FiPlus /> Add Book
          </Button>
          <Button variant="info" size="sm">
            <FiPlus /> Add Pattern
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-number">{jobPapers.length}</div>
          <div className="stat-label">Papers</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{jobBooks.length}</div>
          <div className="stat-label">Books</div>
        </div>
        <div className="stat-card info">
          <div className="stat-number">{jobPattern ? '✅' : '❌'}</div>
          <div className="stat-label">Test Pattern</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-number">{job.openSeats}</div>
          <div className="stat-label">Open Seats</div>
        </div>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <span><FiFileText className="me-2" /> Papers ({jobPapers.length})</span>
                <Button variant="primary" size="sm">
                  <FiPlus /> Add
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {jobPapers.length === 0 ? (
                <p className="text-muted text-center py-3">No papers added yet</p>
              ) : (
                <ul className="list-unstyled">
                  {jobPapers.map(paper => (
                    <li key={paper.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <strong>{paper.title}</strong>
                        <div>
                          <Badge bg={paper.type === 'solved' ? 'success' : 'warning'} className="me-1">
                            {paper.type}
                          </Badge>
                          <small className="text-muted">{paper.year}</small>
                        </div>
                      </div>
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => navigate(`/admin/papers/${paper.id}`)}
                      >
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <span><FiBook className="me-2" /> Books ({jobBooks.length})</span>
                <Button variant="success" size="sm">
                  <FiPlus /> Add
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {jobBooks.length === 0 ? (
                <p className="text-muted text-center py-3">No books added yet</p>
              ) : (
                <ul className="list-unstyled">
                  {jobBooks.map(book => (
                    <li key={book.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <strong>{book.title}</strong>
                        <div>
                          <small className="text-muted">{book.author}</small>
                          <Badge bg="secondary" className="ms-2">{book.pages} pages</Badge>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {jobPattern && (
        <Card className="shadow-sm mt-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <span><FiCheckCircle className="me-2" /> Test Pattern</span>
              <Button variant="warning" size="sm">
                <FiEdit /> Edit
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <p><strong>Total MCQs:</strong> {jobPattern.totalMcqs}</p>
              </Col>
              <Col md={4}>
                <p><strong>Time Limit:</strong> {jobPattern.timeLimit} minutes</p>
              </Col>
              <Col md={4}>
                <p><strong>Passing Marks:</strong> {jobPattern.passingMarks}%</p>
              </Col>
            </Row>
            <Table size="sm">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>MCQs</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {jobPattern.sections.map((section, idx) => (
                  <tr key={idx}>
                    <td>{section.name}</td>
                    <td>{section.mcqs}</td>
                    <td>{section.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default JobDetailPage;