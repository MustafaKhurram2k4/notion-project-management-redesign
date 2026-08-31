import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Button } from '../components/common/Button';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Avatar, AvatarGroup } from '../components/common/Avatar';
import { ProgressBar, ProgressRing } from '../components/common/ProgressBar';
import { formatDate, formatRelativeTime, isOverdue, isDueToday } from '../utils/formatters';
import {
  Plus,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Flame,
  CheckSquare,
  Users,
  Activity,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    projects,
    tasks,
    milestones,
    users,
    activities,
    setSelectedProjectId,
    setSelectedTaskId,
    setCurrentView,
    setIsCreateProjectOpen,
    setIsCreateTaskOpen,
    moveTaskStatus,
  } = useWorkspace();

  // Metrics
  const activeProjects = projects.filter(p => p.status !== 'completed');
  const tasksDueSoon = tasks.filter(t => t.status !== 'done');
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done');
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== 'done');
  const dueTodayTasks = tasks.filter(t => isDueToday(t.dueDate) && t.status !== 'done');
  const blockedTasks = tasks.filter(t => t.blockedByTaskIds.length > 0 && t.status !== 'done');

  // Overall workload calculation
  const totalAssignedHours = users.reduce((acc, u) => acc + u.assignedHours, 0);
  const totalCapacityHours = users.reduce((acc, u) => acc + u.capacityHours, 0);
  const teamWorkloadPct = Math.round((totalAssignedHours / totalCapacityHours) * 100);

  // Next Milestone
  const upcomingMilestone = milestones
    .filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-12">
      {/* Header Greeting & Core Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Good morning, {currentUser.name.split(' ')[0]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's what needs your attention across your active projects and team workflows.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsCreateProjectOpen(true)}
          >
            New Project
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsCreateTaskOpen(true)}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Compact High-Hierarchy Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Active Projects */}
        <div
          onClick={() => setCurrentView('projects')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <Layers className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {activeProjects.length}
            </span>
            <span className="text-[11px] text-slate-400">of {projects.length} total</span>
          </div>
        </div>

        {/* Tasks Due Soon */}
        <div
          onClick={() => setCurrentView('tasks')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks in Flight</span>
            <CheckSquare className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {tasksDueSoon.length}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {myTasks.length} assigned to you
            </span>
          </div>
        </div>

        {/* Overdue Alert */}
        <div
          onClick={() => setCurrentView('tasks')}
          className={`p-4 rounded-xl border shadow-2xs transition-all cursor-pointer group ${
            overdueTasks.length > 0
              ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/60'
              : 'bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                overdueTasks.length > 0 ? 'text-rose-700 dark:text-rose-400' : ''
              }`}
            >
              Overdue
            </span>
            <AlertCircle
              className={`w-4 h-4 ${
                overdueTasks.length > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-400'
              }`}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold tabular-nums ${
                overdueTasks.length > 0
                  ? 'text-rose-700 dark:text-rose-300'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {overdueTasks.length}
            </span>
            <span className="text-[11px] text-slate-400">
              {overdueTasks.length > 0 ? 'requires immediate resolution' : 'all on schedule'}
            </span>
          </div>
        </div>

        {/* Team Workload */}
        <div
          onClick={() => setCurrentView('team')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Team Workload</span>
            <Users className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {teamWorkloadPct}%
            </span>
            <span className="text-[11px] text-slate-400">
              {totalAssignedHours}h / {totalCapacityHours}h
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Project Health (Left 2/3) + Pulse & Priority (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Project Health & Prioritized Next Up */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Project Health Matrix */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Project Health & Velocity</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time status, progress velocity, and delivery horizon.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('projects')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 4).map(project => {
                const owner = users.find(u => u.id === project.ownerId);
                const projectMembers = users.filter(u => project.memberIds.includes(u.id));
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const doneTasks = projectTasks.filter(t => t.status === 'done');
                const projectBlockers = projectTasks.filter(
                  t => t.blockedByTaskIds.length > 0 && t.status !== 'done'
                );

                return (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project.id)}
                    className="group p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-slate-800/90 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/80 dark:border-slate-700 uppercase">
                          {project.code}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                            {project.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            Lead: {owner?.name || 'Unassigned'} · Due {formatDate(project.targetDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        {projectBlockers.length > 0 && (
                          <span
                            title={`${projectBlockers.length} active blocker(s)`}
                            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" />
                            <span>{projectBlockers.length} Blocked</span>
                          </span>
                        )}
                        <StatusBadge status={project.status} />
                      </div>
                    </div>

                    {/* Progress bar + Metadata */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-3 text-[11px]">
                          <span>
                            {doneTasks.length} / {projectTasks.length} tasks completed
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                          {project.progress}%
                        </span>
                      </div>
                      <ProgressBar value={project.progress} size="sm" variant="auto" />
                    </div>

                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <AvatarGroup users={projectMembers} size="xs" max={4} />
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Prioritized Next Up (Workbench for Alex) */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Your Action Items ({myTasks.length})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tasks currently assigned to you, prioritized by urgency and deadline.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('tasks')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Go to Tasks
              </button>
            </div>

            <div className="space-y-2">
              {myTasks.slice(0, 4).map(task => {
                const proj = projects.find(p => p.id === task.projectId);
                const isLate = isOverdue(task.dueDate);
                const isToday = isDueToday(task.dueDate);

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          moveTaskStatus(task.id, 'done');
                        }}
                        title="Mark done"
                        className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {task.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-mono uppercase">{task.code}</span>
                          {proj && <span>· {proj.name}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className={`text-[11px] font-medium ${
                          isLate
                            ? 'text-rose-600 dark:text-rose-400 font-bold'
                            : isToday
                            ? 'text-amber-600 dark:text-amber-400 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                );
              })}

              {myTasks.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  <span>You're all caught up! No active tasks assigned to you right now.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Attention / Project Pulse & Live Activity Stream */}
        <div className="space-y-6">
          {/* Section: Needs Immediate Attention */}
          {(overdueTasks.length > 0 || blockedTasks.length > 0) && (
            <div className="bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Needs Attention</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-200/70 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                  {overdueTasks.length + blockedTasks.length} items
                </span>
              </div>

              <div className="space-y-2">
                {overdueTasks.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/60 hover:border-rose-400 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold uppercase">
                        {task.code} · OVERDUE
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(task.dueDate)}</span>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {task.title}
                    </p>
                  </div>
                ))}

                {blockedTasks.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold uppercase">
                        {task.code} · BLOCKED
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {task.blockedByTaskIds.length} blocker(s)
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Next Major Milestone */}
          {upcomingMilestone && (
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Next Milestone</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Target: {formatDate(upcomingMilestone.dueDate)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/50 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                      {upcomingMilestone.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {upcomingMilestone.description}
                    </p>
                  </div>
                  <ProgressRing value={upcomingMilestone.progress} size={34} variant="auto" />
                </div>

                <div className="pt-2 border-t border-indigo-200/40 dark:border-indigo-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{upcomingMilestone.targetDeliverables.length} Deliverables</span>
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                    {upcomingMilestone.completedDeliverables.length} Completed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section: Recent Activity Stream */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                <span>Recent Team Activity</span>
              </span>
              <span className="text-[10px] text-slate-400">Live stream</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {activities.slice(0, 5).map(act => {
                const actor = users.find(u => u.id === act.actorId);
                return (
                  <div key={act.id} className="flex items-start gap-2.5">
                    <Avatar user={actor} size="xs" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {actor?.name || 'Teammate'}
                        </span>{' '}
                        {act.action}{' '}
                        <span className="font-medium text-slate-900 dark:text-slate-200">
                          "{act.targetTitle}"
                        </span>
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
