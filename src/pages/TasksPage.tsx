import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Button } from '../components/common/Button';
import { SearchInput } from '../components/common/Inputs';
import { PriorityBadge, TaskStatusBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { formatDate, isOverdue, isDueToday } from '../utils/formatters';
import {
  Plus,
  LayoutGrid,
  List,
  Filter,
  CheckSquare,
  Clock,
  Paperclip,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { TaskStatus, TaskPriority } from '../types';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    projects,
    users,
    currentUser,
    setSelectedTaskId,
    setIsCreateTaskOpen,
    moveTaskStatus,
  } = useWorkspace();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    if (assigneeFilter !== 'all' && t.assigneeId !== assigneeFilter) {
      return false;
    }
    if (projectFilter !== 'all' && t.projectId !== projectFilter) {
      return false;
    }
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) {
      return false;
    }
    if (statusFilter !== 'all' && t.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Tasks & Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage granular deliverables across all active projects with full dependency visibility.
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsCreateTaskOpen(true)}
        >
          Add Task
        </Button>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="w-full sm:w-56">
            <SearchInput
              size="sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Filter tasks or #tag..."
            />
          </div>

          {/* Quick preset: My Tasks toggle */}
          <button
            type="button"
            onClick={() =>
              setAssigneeFilter(assigneeFilter === currentUser.id ? 'all' : currentUser.id)
            }
            className={`h-8 text-xs font-semibold px-3 rounded-lg border transition-colors cursor-pointer ${
              assigneeFilter === currentUser.id
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            Assigned to Me
          </button>

          {/* Project filter */}
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="h-8 text-xs font-medium px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>

          {/* Assignee filter */}
          <select
            value={assigneeFilter}
            onChange={e => setAssigneeFilter(e.target.value)}
            className="h-8 text-xs font-medium px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Assignees</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="h-8 text-xs font-medium px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* View Layout Toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('board')}
              title="Board View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && <KanbanBoard tasks={filteredTasks} />}

      {/* List / Table View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Task Title</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Checklist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredTasks.map(task => {
                  const proj = projects.find(p => p.id === task.projectId);
                  const assignee = users.find(u => u.id === task.assigneeId);
                  const completedChecklist = task.checklist.filter(c => c.completed).length;
                  const isLate = isOverdue(task.dueDate) && task.status !== 'done';
                  const isToday = isDueToday(task.dueDate) && task.status !== 'done';

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-500 uppercase">
                        {task.code}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {task.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {proj?.name}
                      </td>
                      <td className="px-4 py-3">
                        <TaskStatusBadge status={task.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Avatar user={assignee} size="xs" />
                          <span className="truncate">{assignee?.name}</span>
                        </div>
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          isLate
                            ? 'text-rose-600 dark:text-rose-400 font-bold'
                            : isToday
                            ? 'text-amber-600 dark:text-amber-400 font-bold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {task.checklist.length > 0
                          ? `${completedChecklist}/${task.checklist.length}`
                          : '—'}
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
      {filteredTasks.length === 0 && (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-8">
          <CheckSquare className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No tasks found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new task to get started.
          </p>
        </div>
      )}
    </div>
  );
};
