import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Project, ProjectStatus } from '../types';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { Avatar, AvatarGroup } from '../components/common/Avatar';
import { ProgressBar, ProgressRing } from '../components/common/ProgressBar';
import { SearchInput } from '../components/common/Inputs';
import { formatDate, formatCurrency, getDaysRemaining } from '../utils/formatters';
import {
  Plus,
  LayoutGrid,
  List,
  Star,
  Layers,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  FolderPlus,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const {
    projects,
    tasks,
    users,
    setSelectedProjectId,
    setCurrentView,
    setIsCreateProjectOpen,
    toggleProjectFavorite,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'progress' | 'health' | 'name'>('deadline');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  const filteredProjects = projects
    .filter(p => {
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      }
      if (sortBy === 'progress') {
        return b.progress - a.progress;
      }
      if (sortBy === 'health') {
        return b.healthScore - a.healthScore;
      }
      return a.name.localeCompare(b.name);
    });

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
  };

  const categories = ['all', 'Product', 'Design', 'Engineering', 'Marketing', 'Security'];
  const statuses = ['all', 'planning', 'on_track', 'at_risk', 'on_hold', 'completed'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Projects Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track every initiative from kickoff to delivery with clear accountability and health tracking.
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsCreateProjectOpen(true)}
        >
          New Project
        </Button>
      </div>

      {/* Filter and View Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="w-full sm:w-64">
            <SearchInput
              size="sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search projects..."
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="h-8 text-xs font-medium px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-8 text-xs font-medium px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {statuses.map(st => (
              <option key={st} value={st}>
                {st === 'all' ? 'All Statuses' : st.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Right Sort & Layout Toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="h-8 text-xs font-semibold px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="deadline">Target Deadline</option>
              <option value="progress">Progress %</option>
              <option value="health">Health Score</option>
              <option value="name">Project Name</option>
            </select>
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewLayout('grid')}
              title="Grid View"
              className={`p-1.5 rounded-md transition-colors ${
                viewLayout === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewLayout('table')}
              title="Table View"
              className={`p-1.5 rounded-md transition-colors ${
                viewLayout === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      {viewLayout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => {
            const owner = users.find(u => u.id === project.ownerId);
            const projectMembers = users.filter(u => project.memberIds.includes(u.id));
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const doneTasks = projectTasks.filter(t => t.status === 'done');
            const daysLeft = getDaysRemaining(project.targetDate);

            return (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project.id)}
                className="group relative bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all p-5 flex flex-col justify-between cursor-pointer text-left"
              >
                <div>
                  {/* Top Bar: Code, Category, Favorite button */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                        {project.code}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {project.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={project.status} />
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          toggleProjectFavorite(project.id);
                        }}
                        className={`p-1 rounded transition-colors ${
                          project.isFavorite
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Star className={`w-3.5 h-3.5 ${project.isFavorite ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Name and Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5 line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Bottom Section: Progress, Deadlines, Team */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {/* Progress Indicator */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        {doneTasks.length} / {projectTasks.length} tasks
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {project.progress}%
                      </span>
                    </div>
                    <ProgressBar value={project.progress} size="sm" variant="auto" />
                  </div>

                  {/* Meta stats row */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Avatar user={owner} size="xs" />
                      <span className="truncate max-w-[100px]">{owner?.name.split(' ')[0]}</span>
                    </div>

                    <span
                      className={`font-semibold ${
                        daysLeft !== null && daysLeft < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : daysLeft !== null && daysLeft <= 7
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {daysLeft !== null && daysLeft < 0
                        ? `${Math.abs(daysLeft)}d overdue`
                        : daysLeft !== null
                        ? `${daysLeft}d left`
                        : formatDate(project.targetDate)}
                    </span>

                    <AvatarGroup users={projectMembers} size="xs" max={3} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Layout */}
      {viewLayout === 'table' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Project Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Target Date</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredProjects.map(project => {
                  const owner = users.find(u => u.id === project.ownerId);
                  const projectMembers = users.filter(u => project.memberIds.includes(u.id));

                  return (
                    <tr
                      key={project.id}
                      onClick={() => handleOpenProject(project.id)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-500 uppercase">
                        {project.code}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                        {project.name}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                        {project.category}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-4 py-3.5 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={project.progress} size="xs" variant="auto" />
                          <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-600 dark:text-slate-300">
                        {formatDate(project.targetDate)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Avatar user={owner} size="xs" />
                          <span className="truncate">{owner?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <AvatarGroup users={projectMembers} size="xs" max={3} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-8">
          <FolderPlus className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No projects match your filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting your category/status filters.
          </p>
        </div>
      )}
    </div>
  );
};
