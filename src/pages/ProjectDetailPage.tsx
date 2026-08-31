import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { StatusBadge, MilestoneStatusBadge } from '../components/common/Badge';
import { Avatar, AvatarGroup } from '../components/common/Avatar';
import { ProgressBar, ProgressRing } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { Tabs } from '../components/common/Feedback';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { ModularBlockEditor } from '../components/editor/ModularBlockEditor';
import {
  formatDate,
  formatCurrency,
  formatBytes,
  formatRelativeTime,
  getDaysRemaining,
} from '../utils/formatters';
import {
  Plus,
  Star,
  Calendar,
  Layers,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  GanttChartSquare,
  Paperclip,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { MilestoneStatus } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const {
    selectedProjectId,
    projects,
    tasks,
    milestones,
    users,
    attachments,
    activities,
    currentUser,
    updateProject,
    toggleProjectFavorite,
    updateProjectBlocks,
    updateMilestone,
    createMilestone,
    uploadAttachment,
    deleteAttachment,
    setIsCreateTaskOpen,
    setSelectedTaskId,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'files' | 'activity'>('overview');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];

  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const projectAttachments = attachments.filter(a => a.projectId === project.id);
  const projectActivities = activities.filter(a => a.projectId === project.id);
  const owner = users.find(u => u.id === project.ownerId);
  const projectMembers = users.filter(u => project.memberIds.includes(u.id));

  const doneTasks = projectTasks.filter(t => t.status === 'done');
  const activeTasks = projectTasks.filter(t => t.status !== 'done');
  const blockedTasks = projectTasks.filter(
    t => t.blockedByTaskIds.length > 0 && t.status !== 'done'
  );
  const daysLeft = getDaysRemaining(project.targetDate);

  const handleCreateMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    createMilestone({
      projectId: project.id,
      title: newMilestoneTitle.trim(),
      description: 'Scheduled milestone target deliverable.',
      dueDate: newMilestoneDate || project.targetDate,
      status: 'not_started',
      targetDeliverables: ['Deliverable 1', 'Deliverable 2'],
    });
    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
  };

  const handleUploadFile = () => {
    uploadAttachment({
      name: `${project.code}-Design-Spec-v2.pdf`,
      type: 'pdf',
      sizeBytes: 4500000,
      uploadedById: currentUser.id,
      projectId: project.id,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-16">
      {/* Project Header Banner */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                {project.code}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {project.category}
              </span>
              <StatusBadge status={project.status} />
              <button
                type="button"
                onClick={() => toggleProjectFavorite(project.id)}
                className={`p-1 rounded transition-colors ${
                  project.isFavorite
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-300 hover:text-slate-500 dark:text-slate-600'
                }`}
                title="Favorite project"
              >
                <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-amber-500' : ''}`} />
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Metrics Quick Gauge */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <ProgressRing value={project.progress} size={44} strokeWidth={4} variant="auto" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {project.progress}% Complete
                </span>
                <p className="text-[11px] text-slate-400">
                  {doneTasks.length} of {projectTasks.length} tasks done
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Target Deadline
              </span>
              <span
                className={`text-xs font-bold ${
                  daysLeft !== null && daysLeft < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : daysLeft !== null && daysLeft <= 7
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {formatDate(project.targetDate)}
                {daysLeft !== null && ` (${daysLeft >= 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d late`})`}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Avatar user={owner} size="xs" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {owner?.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Team ({projectMembers.length}):</span>
              <AvatarGroup users={projectMembers} size="xs" max={4} />
            </div>
            <span>·</span>
            <span>
              Budget: {formatCurrency(project.budgetSpent)} / {formatCurrency(project.budgetTotal)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="secondary"
              onClick={handleUploadFile}
              leftIcon={<Paperclip className="w-3 h-3" />}
            >
              Upload Asset
            </Button>
            <Button
              size="xs"
              variant="primary"
              onClick={() => setIsCreateTaskOpen(true)}
              leftIcon={<Plus className="w-3 h-3" />}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview & Notes' },
            { id: 'tasks', label: 'Tasks & Board', count: projectTasks.length },
            { id: 'timeline', label: 'Phases & Milestones', count: projectMilestones.length },
            { id: 'files', label: 'Files', count: projectAttachments.length },
            { id: 'activity', label: 'Activity Log', count: projectActivities.length },
          ]}
          activeTab={activeTab}
          onChange={tab => setActiveTab(tab as any)}
        />
      </div>

      {/* Tab 1: Overview & Modular Notes */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Notion-style Modular Documentation & Milestones */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notion Modular Content Section */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>Project Brief & Living Documentation</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Flexible modular workspace blocks for strategic notes, specifications, and objectives.
                  </p>
                </div>
              </div>

              <ModularBlockEditor
                blocks={project.overviewBlocks || []}
                onChange={newBlocks => updateProjectBlocks(project.id, newBlocks)}
              />
            </div>

            {/* Milestones Horizon */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Key Milestones & Delivery Schedule</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-level progress gates and deliverable checklists.
                  </p>
                </div>
                {!isAddingMilestone && (
                  <button
                    type="button"
                    onClick={() => setIsAddingMilestone(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                )}
              </div>

              {isAddingMilestone && (
                <form
                  onSubmit={handleCreateMilestoneSubmit}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-indigo-200 dark:border-indigo-900 space-y-3"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Milestone title (e.g., Staging Performance Gate passed)..."
                    value={newMilestoneTitle}
                    onChange={e => setNewMilestoneTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="date"
                      value={newMilestoneDate}
                      onChange={e => setNewMilestoneDate(e.target.value)}
                      className="text-xs p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        type="button"
                        onClick={() => setIsAddingMilestone(false)}
                      >
                        Cancel
                      </Button>
                      <Button size="xs" variant="primary" type="submit">
                        Save Milestone
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {projectMilestones.map(ms => {
                  return (
                    <div
                      key={ms.id}
                      className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {ms.title}
                            </h4>
                            <MilestoneStatusBadge status={ms.status} />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {ms.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                          <span className="text-[11px] font-medium text-slate-400">
                            Due {formatDate(ms.dueDate)}
                          </span>
                          <select
                            value={ms.status}
                            onChange={e =>
                              updateMilestone(ms.id, {
                                status: e.target.value as MilestoneStatus,
                                progress: e.target.value === 'completed' ? 100 : ms.progress,
                              })
                            }
                            className="text-[10px] font-medium p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>
                            {ms.completedDeliverables.length} / {ms.targetDeliverables.length} deliverables
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {ms.progress}%
                          </span>
                        </div>
                        <ProgressBar value={ms.progress} size="xs" variant="auto" />
                      </div>
                    </div>
                  );
                })}

                {projectMilestones.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    No milestones defined yet. Add your first milestone above.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Risks, Active Blockers, Team Allocation */}
          <div className="space-y-6">
            {/* Blocker & Risk Radar */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Risks & Active Blockers</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    blockedTasks.length > 0
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {blockedTasks.length} active
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {blockedTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 hover:border-rose-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                        {task.code}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(task.dueDate)}</span>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {task.title}
                    </p>
                  </div>
                ))}

                {blockedTasks.length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2">
                    No active task bottlenecks detected. Velocity is unobstructed.
                  </p>
                )}
              </div>
            </div>

            {/* Team Allocation in this Project */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Assigned Team Members
              </span>
              <div className="space-y-2.5">
                {projectMembers.map(member => {
                  const memberTasks = projectTasks.filter(t => t.assigneeId === member.id);
                  const memberDone = memberTasks.filter(t => t.status === 'done').length;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar user={member} size="sm" showStatus />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {member.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-medium shrink-0">
                        {memberDone}/{memberTasks.length} tasks
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tasks Kanban & List */}
      {activeTab === 'tasks' && <KanbanBoard tasks={projectTasks} />}

      {/* Tab 3: Timeline & Phases */}
      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <GanttChartSquare className="w-4 h-4 text-indigo-500" />
                <span>Project Phase Schedule</span>
              </h3>
              <p className="text-xs text-slate-400">
                Phase dependencies and critical path sequence.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {projectMilestones.map((ms, idx) => (
              <div
                key={ms.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-xs"
              >
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                  0{idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {ms.title}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400">
                      Due {formatDate(ms.dueDate)}
                    </span>
                  </div>
                  <ProgressBar value={ms.progress} size="xs" variant="auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Centralized Project Files */}
      {activeTab === 'files' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Project Assets & Vault ({projectAttachments.length})
            </h3>
            <Button
              size="xs"
              variant="primary"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={handleUploadFile}
            >
              Upload New File
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {projectAttachments.map(att => {
              const uploader = users.find(u => u.id === att.uploadedById);
              return (
                <div
                  key={att.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate" title={att.name}>
                        {att.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-500 p-0.5 rounded"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                    <span>{formatBytes(att.sizeBytes)}</span>
                    <span>Uploaded by {uploader?.name.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}

            {projectAttachments.length === 0 && (
              <p className="text-xs text-slate-400 italic py-8 text-center col-span-3">
                No files uploaded to this project yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Activity Log */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Project Event Stream
          </h3>
          <div className="space-y-3 text-xs">
            {projectActivities.map(act => {
              const actor = users.find(u => u.id === act.actorId);
              return (
                <div key={act.id} className="flex items-start gap-3 p-2 rounded-lg">
                  <Avatar user={actor} size="xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {actor?.name}
                      </span>{' '}
                      {act.action}{' '}
                      <span className="font-semibold text-slate-900 dark:text-slate-200">
                        "{act.targetTitle}"
                      </span>
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
