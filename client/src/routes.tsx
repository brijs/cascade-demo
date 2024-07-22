import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PractitionerPage from './components/PractitionerPage';
import PatientPage from './components/PatientPage';
import HomePage from './components/HomePage';
import PatientList from './components/PatientList';
import PractitionerList from './components/PractitionerList';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practitioner/:id" element={<PractitionerPage />} />
        <Route path="/patient/:id" element={<PatientPage />} />
        <Route path="/patient" element={<PatientList />} />
        <Route path="/practitioner" element={<PractitionerList />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
