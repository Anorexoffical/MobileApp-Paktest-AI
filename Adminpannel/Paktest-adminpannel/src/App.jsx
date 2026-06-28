import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/admin.css';
import './App.css';

import Topbar from './pages/Topbar';
import Dashboard from './pages/Dashboard';
import CategoriesPage from './pages/CategoriesPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import PapersPage from './pages/PapersPage';
import PaperDetailPage from './pages/PaperDetailPage';
// import BooksPage from './pages/BooksPage';
import McqsPage from './pages/McqsPage';
import PatternsPage from './pages/PatternsPage';
import PositionsPage from './pages/PositionsPage';
// import NotFoundPage from './pages/NotFoundPage';

// Position specific pages
import PositionSolvedPapersPage from './pages/PositionSolvedPapersPage';
import PositionUnsolvedPapersPage from './pages/PositionUnsolvedPapersPage';
import PositionBooksPage from './pages/PositionBooksPage';
import PositionPatternsPage from './pages/PositionPatternsPage';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Topbar />
      <div className="admin-main-content">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/jobs" element={<JobsPage />} />
          <Route path="/admin/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/admin/papers" element={<PapersPage />} />
          <Route path="/admin/papers/:paperId" element={<PaperDetailPage />} />
          {/* <Route path="/admin/books" element={<BooksPage />} /> */}
          <Route path="/admin/mcqs" element={<McqsPage />} />
          <Route path="/admin/patterns" element={<PatternsPage />} />
          <Route path="/admin/positions" element={<PositionsPage />} />

          {/* Position-specific routes - must come after /admin/positions */}
          <Route path="/admin/position/:positionId/solved-papers" element={<PositionSolvedPapersPage />} />
          <Route path="/admin/position/:positionId/unsolved-papers" element={<PositionUnsolvedPapersPage />} />
          <Route path="/admin/position/:positionId/books" element={<PositionBooksPage />} />
          <Route path="/admin/position/:positionId/patterns" element={<PositionPatternsPage />} />

          {/* 404 Not Found - must be last */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;