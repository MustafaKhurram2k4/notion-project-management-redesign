import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { ViewMode } from '../../types';
import { Avatar } from '../common/Avatar';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  CalendarDays,
  GanttChartSquare,
  Users2,
  FolderArchive,
  Settings,
  Star,
  Plus,
  Moon,
  Sun,
  Laptop,
  ChevronDown,
  Compass,
  UserCheck,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const {
    currentView,
    setCurrentView,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    tasks,
    currentUser,
    users,
    setCurrentUserId,
    theme,
    setTheme,
    setIsCreateProjectOpen,
    setIsCreateTaskOpen,
    setIsProfileEditOpen,
  } = useWorkspace();

  const { logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const favoriteProjects = projects.filter(p => p.isFavorite);
  const myActiveTasksCount = tasks.filter(
    t => t.assigneeId === currentUser.id && t.status !== 'done'
  ).length;

  const handleNavClick = (view: ViewMode, projectId: string | null = null) => {
    setCurrentView(view);
    setSelectedProjectId(projectId);
    onMobileClose();
  };

  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Overview', icon: LayoutDashboard },
    {
      id: 'tasks' as ViewMode,
      label: 'My Tasks',
      icon: CheckSquare,
      badge: myActiveTasksCount > 0 ? myActiveTasksCount : undefined,
    },
    {
      id: 'projects' as ViewMode,
      label: 'Projects',
      icon: FolderKanban,
      badge: projects.length,
    },
    { id: 'timeline' as ViewMode, label: 'Timeline', icon: GanttChartSquare },
    { id: 'calendar' as ViewMode, label: 'Calendar', icon: CalendarDays },
    { id: 'team' as ViewMode, label: 'Team Workload', icon: Users2 },
    { id: 'files' as ViewMode, label: 'Files & Assets', icon: FolderArchive },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#F6F6F4] dark:bg-[#0D0D0F] border-r border-neutral-300/70 dark:border-white/10 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Brand Switcher */}
        <div className="p-4 border-b border-neutral-300/70 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Monolithic Waypoint Geometric Logo */}
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs font-serif font-bold text-neutral-900 dark:text-neutral-100 tracking-[0.2em] uppercase">
                    WAYPOINT
                  </h1>
                  <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-neutral-200 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/10">
                    EDITION
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate uppercase tracking-wider mt-0.5">
                  Studio Workspace
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCreateProjectOpen(true)}
              title="New Project"
              className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-left">
          {/* Main Views */}
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.25em] px-3 mb-2 block">
              Perspective // 01
            </span>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id && !selectedProjectId;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-white/5 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-white dark:text-black' : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    />
                    <span className="truncate tracking-[0.02em]">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md font-bold tabular-nums ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                          : 'bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Favorite Projects */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.25em] flex items-center gap-1.5">
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span>Favorites</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(true)}
                className="text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              >
                + New
              </button>
            </div>
            {favoriteProjects.map(proj => {
              const isProjActive =
                currentView === 'project-detail' && selectedProjectId === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => handleNavClick('project-detail', proj.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer group ${
                    isProjActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`font-mono text-[9px] uppercase ${
                        isProjActive ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-400'
                      }`}
                    >
                      {proj.code}
                    </span>
                    <span className="truncate text-xs">{proj.name}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono tabular-nums ${
                      isProjActive
                        ? 'text-neutral-300 dark:text-neutral-700'
                        : 'text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                    }`}
                  >
                    {proj.progress}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Add Actions */}
          <div className="p-3 rounded-xl bg-white/60 dark:bg-[#141416]/60 border border-neutral-300/70 dark:border-white/10 space-y-2">
            <span className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] block">
              Direct Actions
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setIsCreateTaskOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black text-[10px] font-mono uppercase tracking-[0.1em] font-semibold hover:bg-black dark:hover:bg-neutral-200 transition-colors shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Task</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-neutral-300/80 dark:border-white/15 text-neutral-800 dark:text-neutral-200 text-[10px] font-mono uppercase tracking-[0.1em] font-semibold hover:bg-neutral-100 dark:hover:bg-white/20 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: User Profile Switcher & Settings & Theme */}
        <div className="p-3 border-t border-neutral-300/70 dark:border-white/10 space-y-2">
          {/* Theme Selector */}
          <div className="flex items-center justify-between p-1 bg-neutral-200/70 dark:bg-white/5 rounded-lg border border-neutral-300/40 dark:border-white/5">
            <button
              onClick={() => setTheme('light')}
              title="Light mode"
              className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-colors ${
                theme === 'light'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark mode"
              className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-white dark:bg-[#1E1E22] text-neutral-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              title="System sync"
              className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-colors ${
                theme === 'system'
                  ? 'bg-white dark:bg-[#1E1E22] text-neutral-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Profile & Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#141416] border border-neutral-300/80 dark:border-white/10 hover:border-neutral-400 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar user={currentUser} size="sm" showStatus />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[9px] font-mono text-neutral-400 truncate uppercase tracking-wider">{currentUser.role}</p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </button>

            {/* Profile Dropdown Popover */}
            {isProfileDropdownOpen && (
              <div className="absolute bottom-12 left-0 right-0 z-50 p-2 rounded-xl bg-white dark:bg-[#141416] border border-neutral-300 dark:border-white/10 shadow-2xl space-y-2 animate-in zoom-in-95">
                <div className="px-2 py-1">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
                    Switch Persona
                  </span>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light mt-0.5">
                    Experience Waypoint through different roles:
                  </p>
                </div>
                <div className="space-y-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUserId(u.id);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                          : 'hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar user={u} size="xs" />
                        <div className="min-w-0">
                          <p className="truncate">{u.name}</p>
                          <p className={`text-[9px] font-mono truncate uppercase ${u.id === currentUser.id ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                            {u.role}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono ${u.id === currentUser.id ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'}`}>
                        {u.assignedHours}h
                      </span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-neutral-200 dark:border-white/10 pt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsProfileEditOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Edit Profile & Avatar</span>
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('settings');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Workspace Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

