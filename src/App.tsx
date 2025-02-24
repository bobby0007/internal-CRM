import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import MerchantStatus from '@/pages/MerchantStatus';
import InternationalTxns from '@/pages/InternationalTxns';
import TemplateForm from '@/pages/TemplateForm';
import RateLimit from '@/pages/RateLimit';
import Config from '@/pages/Config';
import { ToastProvider } from "@/components/ui/toast";
import Login from '@/components/Login';
import { isAuthenticated } from './utils/auth';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Add dashboard route for the main content */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-100">
                  <div className="flex h-screen">
                    <Sidebar className="hidden lg:block" />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <main className="flex-1 overflow-y-auto">
                        <MerchantStatus />
                      </main>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/international"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-100">
                  <div className="flex h-screen">
                    <Sidebar className="hidden lg:block" />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <main className="flex-1 overflow-y-auto">
                        <InternationalTxns />
                      </main>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/template"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-100">
                  <div className="flex h-screen">
                    <Sidebar className="hidden lg:block" />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <main className="flex-1 overflow-y-auto">
                        <TemplateForm />
                      </main>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/rate-limit"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-100">
                  <div className="flex h-screen">
                    <Sidebar className="hidden lg:block" />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <main className="flex-1 overflow-y-auto">
                        <RateLimit />
                      </main>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/config"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-100">
                  <div className="flex h-screen">
                    <Sidebar className="hidden lg:block" />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Navbar />
                      <main className="flex-1 overflow-y-auto">
                        <Config />
                      </main>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;