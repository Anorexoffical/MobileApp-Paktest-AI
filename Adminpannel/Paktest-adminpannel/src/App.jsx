import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/admin.css';
import './App.css';

import Topbar from './pages/Topbar';
import Dashboard from './pages/Dashboard';
import TestConductBodies from './pages/TestConductBodies';
import Positions from './pages/Positions';
import Subjects from './pages/Subjects';
import Books from './pages/Books';
import Chapters from './pages/Chapters';
import MCQs from './pages/MCQs';
import Patterns from './pages/Patterns';
import Papers from './pages/Papers';
import Jobs from './pages/Jobs';

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
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin" element={<Dashboard />} />
          
          {/* Test Conduct Bodies */}
          <Route path="/admin/test-conduct-bodies" element={<TestConductBodies />} />
          
          {/* Positions */}
          <Route path="/admin/positions" element={<Positions />} />
          
          {/* Subjects */}
          <Route path="/admin/subjects" element={<Subjects />} />
          
          {/* Books */}
          <Route path="/admin/books" element={<Books />} />
          
          {/* Chapters */}
          <Route path="/admin/chapters" element={<Chapters />} />
          
          {/* MCQs */}
          <Route path="/admin/mcqs" element={<MCQs />} />
          
          {/* Patterns */}
          <Route path="/admin/patterns" element={<Patterns />} />
          
          {/* Papers */}
          <Route path="/admin/papers" element={<Papers />} />
          
          {/* Jobs */}
          <Route path="/admin/jobs" element={<Jobs />} />

          {/* 404 Not Found - must be last */}
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;