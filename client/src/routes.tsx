import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PractitionerPage from './components/PractitionerPage';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/practitioner/:id" element={<PractitionerPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
