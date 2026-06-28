import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FiGrid, FiLayers, FiFileText, FiBook, FiList, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

const statDefs = [
  { label: 'Categories',    icon: FiGrid,        color: '#6366f1', bg: '#eef2ff', path: '/admin/categories' },
  { label: 'Jobs',          icon: FiLayers,      color: '#10b981', bg: '#d1fae5', path: '/admin/jobs' },
  { label: 'Papers',        icon: FiFileText,    color: '#f59e0b', bg: '#fef3c7', path: '/admin/papers' },
  { label: 'Books',         icon: FiBook,        color: '#3b82f6', bg: '#dbeafe', path: '/admin/books' },
  { label: 'MCQs',          icon: FiList,        color: '#ef4444', bg: '#fee2e2', path: '/admin/mcqs' },
  { label: 'Test Patterns', icon: FiCheckCircle, color: '#8b5cf6', bg: '#ede9fe', path: '/admin/patterns' },
];

const activity = [
  { icon: '📚', text: 'Added new book "Computer Science for CSS"',        time: '2m ago' },
  { icon: '📝', text: 'Created 10 new MCQs for PPSC IT Instructor',        time: '1h ago' },
  { icon: '🔗', text: 'Linked 5 MCQs to "FPSC Computer Instructor 2022"',  time: '3h ago' },
  { icon: '📋', text: 'Updated test pattern for CSS Officer',               time: '1d ago' },
  { icon: '✅', text: 'Completed 3 job postings',                           time: '2d ago' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { categories, jobs, papers, books, mcqs, testPatterns } = useStore();

  const stats = statDefs.map(s => ({
    ...s,
    count: { Categories: categories.length, Jobs: jobs.length, Papers: papers.length, Books: books.length, MCQs: mcqs.length, 'Test Patterns': testPatterns.length }[s.label]
  }));

  return (
    <div className="admin-page">

      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h4>Dashboard</h4>
          <p className="text-muted">Welcome back! Here's an overview of your exam content.</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card" onClick={() => navigate(s.path)}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color={s.color} />
              </div>
              <div className="stat-number" style={{ color: s.color }}>{s.count}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions + Activity ── */}
      <Row className="g-4">
        <Col lg={6}>
          <Card>
            <Card.Header>⚡ Quick Actions</Card.Header>
            <div style={{ padding: 0 }}>
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="quick-action-row" onClick={() => navigate(s.path)}>
                    <div className="quick-action-left">
                      <div className="quick-action-icon" style={{ background: s.bg }}>
                        <Icon size={18} color={s.color} />
                      </div>
                      <span className="quick-action-label">Manage {s.label}</span>
                    </div>
                    <FiArrowRight size={16} color="#94a3b8" />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Header>📋 Recent Activity</Card.Header>
            <div style={{ padding: 0 }}>
              {activity.map((item, i) => (
                <div key={i} className="activity-list-item">
                  <span className="activity-emoji">{item.icon}</span>
                  <div>
                    <p className="activity-text">{item.text}</p>
                    <p className="activity-time">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;
