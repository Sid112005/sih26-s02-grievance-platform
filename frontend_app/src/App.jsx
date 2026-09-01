import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import CitizenLogin from './pages/CitizenLogin';
import CitizenHome from './pages/CitizenHome';
import ReportComplaint from './pages/ReportComplaint';
import AIProcessing from './pages/AIProcessing';
import ComplaintResult from './pages/ComplaintResult';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetails from './pages/ComplaintDetails';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AuthorityLoginPlaceholder from './pages/AuthorityLoginPlaceholder';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Login Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/authority/login" element={<AuthorityLoginPlaceholder />} />

          {/* Protected Citizen Portal Routes */}
          <Route
            path="/citizen/home"
            element={
              <ProtectedRoute>
                <CitizenHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/report"
            element={
              <ProtectedRoute>
                <ReportComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/processing"
            element={
              <ProtectedRoute>
                <AIProcessing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/result/:id"
            element={
              <ProtectedRoute>
                <ComplaintResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints"
            element={
              <ProtectedRoute>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;