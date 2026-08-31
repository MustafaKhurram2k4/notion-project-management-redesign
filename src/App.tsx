/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthContainer } from './pages/auth/AuthContainer';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TasksPage } from './pages/TasksPage';
import { TimelinePage } from './pages/TimelinePage';
import { CalendarPage } from './pages/CalendarPage';
import { TeamPage } from './pages/TeamPage';
import { FilesPage } from './pages/FilesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TaskDetailDrawer } from './components/tasks/TaskDetailDrawer';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { CreateProjectModal } from './components/projects/CreateProjectModal';
import { CommandPalette } from './components/search/CommandPalette';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ProfileEditModal } from './components/profile/ProfileEditModal';
import { ToastContainer } from './components/common/Feedback';

const MainLayout: React.FC = () => {
  const { currentView, selectedProjectId, isProfileEditOpen, setIsProfileEditOpen } = useWorkspace();
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F6F6F4] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            Loading Workspace Engine...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  const renderActiveView = () => {
    if (selectedProjectId && currentView === 'project-detail') {
      return <ProjectDetailPage />;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'project-detail':
        return <ProjectDetailPage />;
      case 'tasks':
        return <TasksPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'calendar':
        return <CalendarPage />;
      case 'team':
        return <TeamPage />;
      case 'files':
        return <FilesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] dark:bg-[#0A0A0A] text-[#141416] dark:text-[#E2E2E2] flex flex-col antialiased selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans transition-colors duration-150 relative">
      {/* Subtle Architectural Background Grid Columns */}
      <div className="fixed inset-0 grid grid-cols-12 pointer-events-none opacity-[0.025] dark:opacity-[0.035] z-0 max-w-full">
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="border-r border-black dark:border-white h-full" />
        <div className="h-full" />
      </div>

      {/* Navigation Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 relative z-10">
        {/* Sticky Header Topbar */}
        <Topbar onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* View Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Interactive Overlays & Modals */}
      <TaskDetailDrawer />
      <CreateTaskModal />
      <CreateProjectModal />
      <CommandPalette />
      <NotificationDrawer />
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <MainLayout />
      </WorkspaceProvider>
    </AuthProvider>
  );
}
