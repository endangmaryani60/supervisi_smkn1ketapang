/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { SchoolSettings } from './components/settings/SchoolSettings';
import { TeacherManagement } from './components/teachers/TeacherManagement';
import { AccountManagement } from './components/teachers/AccountManagement';
import { DocumentManagement } from './components/documents/DocumentManagement';
import { SupervisionProgram } from './components/program/SupervisionProgram';
import { SupervisionInstruments } from './components/instruments/SupervisionInstruments';
import { SupervisionReport } from './components/reports/SupervisionReport';
import { FollowUpEvaluation } from './components/followup/FollowUpEvaluation';
import { TeacherProfile } from './components/profile/TeacherProfile';
import { ForcePasswordChangeModal } from './components/auth/ForcePasswordChangeModal';

const AppContent: React.FC = () => {
  const { user, activeTab, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Memuat SI SUPAK...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return user.role === 'Kepala Sekolah' ? <ExecutiveDashboard /> : <TeacherDashboard />;
      case 'school-settings':
        return <SchoolSettings />;
      case 'teacher-data':
        return <TeacherManagement />;
      case 'teacher-accounts':
        return <AccountManagement />;
      case 'documents':
        return <DocumentManagement />;
      case 'program':
        return <SupervisionProgram />;
      case 'instruments':
        return <SupervisionInstruments />;
      case 'report':
        return <SupervisionReport />;
      case 'followup':
        return <FollowUpEvaluation />;
      case 'profile':
        return <TeacherProfile />;
      default:
        return user.role === 'Kepala Sekolah' ? <ExecutiveDashboard /> : <TeacherDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFB] font-sans text-[#1A1A1A] antialiased">
      <ForcePasswordChangeModal />
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
