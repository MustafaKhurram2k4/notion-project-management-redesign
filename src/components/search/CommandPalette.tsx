import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Search, FolderKanban, CheckSquare, Users, FileText, ArrowRight, X, Sparkles } from 'lucide-react';
import { ViewMode } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    projects,
    tasks,
    users,
    attachments,
    setSelectedProjectId,
    setSelectedTaskId,
    setCurrentView,
    setIsCreateTaskOpen,
    setIsCreateProjectOpen,
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search Results
  const matchedProjects = cleanQuery
    ? projects.filter(
        p =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.code.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery)
      )
    : projects.slice(0, 3);

  const matchedTasks = cleanQuery
    ? tasks.filter(
        t =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.code.toLowerCase().includes(cleanQuery) ||
          t.tags.some(tag => tag.toLowerCase().includes(cleanQuery))
      )
    : tasks.slice(0, 4);

  const matchedUsers = cleanQuery
    ? users.filter(
        u =>
          u.name.toLowerCase().includes(cleanQuery) ||
          u.role.toLowerCase().includes(cleanQuery) ||
          u.department.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedFiles = cleanQuery
    ? attachments.filter(a => a.name.toLowerCase().includes(cleanQuery))
    : [];

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
    setIsCommandPaletteOpen(false);
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsCommandPaletteOpen(false);
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    setSelectedProjectId(null);
    setIsCommandPaletteOpen(false);
  };

  const hasResults =
    matchedProjects.length > 0 ||
    matchedTasks.length > 0 ||
    matchedUsers.length > 0 ||
    matchedFiles.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects, tasks, team members, files..."
            className="w-full text-sm font-medium bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3 text-left">
          {/* Quick Actions (when query is short or empty) */}
          {!cleanQuery && (
            <div className="p-1.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setIsCreateTaskOpen(true);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Create New Task</span>
                  </span>
                  <span className="text-[10px] text-slate-400">N</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setIsCreateProjectOpen(true);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <FolderKanban className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Create New Project</span>
                  </span>
                  <span className="text-[10px] text-slate-400">P</span>
                </button>
              </div>
            </div>
          )}

          {/* Projects Category */}
          {matchedProjects.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Projects
              </span>
              {matchedProjects.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProject(p.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FolderKanban className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">
                      {p.code}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Tasks Category */}
          {matchedTasks.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Tasks
              </span>
              {matchedTasks.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTask(t.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                        {t.title}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {t.code}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                    {t.status.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Users Category */}
          {matchedUsers.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Team Members
              </span>
              {matchedUsers.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleNavigate('team')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {u.role} · {u.department}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{u.location}</span>
                </button>
              ))}
            </div>
          )}

          {/* Files Category */}
          {matchedFiles.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Files
              </span>
              {matchedFiles.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleNavigate('files')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                      {f.name}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase">{f.type}</span>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {cleanQuery && !hasResults && (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No results found for "{query}". Try searching for project codes (e.g., "WEB"), task titles, or teammate names.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with arrows, press Enter to select</span>
          <span>WAYPOINT Global Search</span>
        </div>
      </div>
    </div>
  );
};
