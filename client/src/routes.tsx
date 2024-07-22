import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PractitionerPage from './components/PractitionerPage';
import HomePage from './components/HomePage';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practitioner/:id" element={<PractitionerPage />} />
        <Route path="/patient" element={<div>Patient View (Placeholder)</div>} />
        <Route path="/practitioner" element={<div>Practitioner View (Placeholder)</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
