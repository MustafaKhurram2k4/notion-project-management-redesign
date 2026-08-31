import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { SearchInput } from '../common/Inputs';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import {
  Bell,
  Menu,
  Plus,
  ChevronRight,
} from 'lucide-react';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle }) => {
  const {
    currentView,
    setCurrentView,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    notifications,
    currentUser,
    setIsCreateTaskOpen,
    setIsCommandPaletteOpen,
    setIsNotificationDrawerOpen,
  } = useWorkspace();

  const activeProject = projects.find(p => p.id === selectedProjectId);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Overview';
      case 'projects':
        return 'Projects Directory';
      case 'project-detail':
        return activeProject ? activeProject.name : 'Project Workspace';
      case 'tasks':
        return 'My Tasks & Workflow';
      case 'timeline':
        return 'Timeline & Roadmap';
      case 'calendar':
        return 'Master Calendar';
      case 'team':
        return 'Team & Workload';
      case 'files':
        return 'Assets & Documents';
      case 'settings':
        return 'Workspace Settings';
      default:
        return 'Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#F6F6F4]/90 dark:bg-[#0D0D0F]/90 backdrop-blur-md border-b border-neutral-300/70 dark:border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-white/10 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 min-w-0 font-sans">
          <button
            onClick={() => {
              setSelectedProjectId(null);
              setCurrentView('dashboard');
            }}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shrink-0 font-serif uppercase tracking-widest text-[11px] cursor-pointer"
          >
            Waypoint
          </button>
          <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-600 shrink-0" />

          {selectedProjectId && activeProject ? (
            <>
              <button
                onClick={() => {
                  setSelectedProjectId(null);
                  setCurrentView('projects');
                }}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors truncate hidden sm:inline text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Projects
              </button>
              <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-600 shrink-0 hidden sm:inline" />
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase bg-neutral-200 dark:bg-white/10 border border-neutral-300/60 dark:border-white/10 px-1.5 py-0.2 rounded text-neutral-700 dark:text-neutral-300">
                  {activeProject.code}
                </span>
                <span className="truncate font-serif text-sm font-semibold">{activeProject.name}</span>
              </span>
            </>
          ) : (
            <span className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate tracking-wide">
              {getViewTitle()}
            </span>
          )}
        </nav>
      </div>

      {/* Right: Search, Quick Add, Notifications, Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Global Search trigger */}
        <div className="w-44 sm:w-60 cursor-pointer" onClick={() => setIsCommandPaletteOpen(true)}>
          <SearchInput
            placeholder="Search (⌘K)..."
            size="sm"
            showShortcut
            readOnly
            className="cursor-pointer"
          />
        </div>

        {/* Quick Add Task */}
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsCreateTaskOpen(true)}
          className="hidden sm:inline-flex"
        >
          New Task
        </Button>

        {/* Notifications Button */}
        <button
          type="button"
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neutral-900 dark:bg-white ring-2 ring-[#F6F6F4] dark:ring-[#0D0D0F]" />
          )}
        </button>

        {/* Current user avatar with profile badge */}
        <div
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setCurrentView('settings')}
          title={`${currentUser.name} (${currentUser.role})`}
        >
          <Avatar user={currentUser} size="sm" showStatus />
        </div>
      </div>
    </header>
  );
};

