import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Drawer } from '../common/Overlay';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { ProgressBar } from '../common/ProgressBar';
import { ConfirmDialog } from '../common/Feedback';
import { TaskStatus, TaskPriority } from '../../types';
import {
  formatDate,
  formatRelativeTime,
  formatBytes,
  isOverdue,
  isDueToday,
  TASK_STATUS_CONFIG,
  PRIORITY_CONFIG,
} from '../../utils/formatters';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Paperclip,
  Send,
  Calendar,
  User as UserIcon,
  Tag,
  Link2,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  MessageSquare,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const TaskDetailDrawer: React.FC = () => {
  const {
    selectedTaskId,
    setSelectedTaskId,
    tasks,
    projects,
    users,
    currentUser,
    updateTask,
    deleteTask,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    comments,
    addComment,
    attachments,
    uploadAttachment,
    deleteAttachment,
    showToast,
  } = useWorkspace();

  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const task = tasks.find(t => t.id === selectedTaskId);

  if (!task) return null;

  const project = projects.find(p => p.id === task.projectId);
  const assignee = users.find(u => u.id === task.assigneeId);
  const reporter = users.find(u => u.id === task.reporterId);
  const taskComments = comments.filter(c => c.taskId === task.id);
  const taskAttachments = attachments.filter(a => a.taskId === task.id);

  // Dependent tasks
  const blockedByTasks = tasks.filter(t => task.blockedByTaskIds.includes(t.id));
  const blocksTasks = tasks.filter(t => task.blocksTaskIds.includes(t.id));

  const completedChecklistCount = task.checklist.filter(c => c.completed).length;
  const checklistProgress =
    task.checklist.length > 0
      ? Math.round((completedChecklistCount / task.checklist.length) * 100)
      : 0;

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;
    addChecklistItem(task.id, newChecklistTitle.trim());
    setNewChecklistTitle('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(task.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().replace(/^#/, '');
    if (!task.tags.includes(cleanTag)) {
      updateTask(task.id, { tags: [...task.tags, cleanTag] });
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateTask(task.id, { tags: task.tags.filter(t => t !== tagToRemove) });
  };

  const handleSimulateFileUpload = () => {
    const sampleFiles = [
      { name: 'PRD-Specification-v1.2.pdf', type: 'pdf' as const, sizeBytes: 3200000 },
      { name: 'Figma-Component-Library-2026.fig', type: 'figma' as const, sizeBytes: 15400000 },
      { name: 'Architecture-Sequence-Diagram.png', type: 'image' as const, sizeBytes: 1800000 },
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    uploadAttachment({
      name: picked.name,
      type: picked.type,
      sizeBytes: picked.sizeBytes,
      uploadedById: currentUser.id,
      projectId: task.projectId,
      taskId: task.id,
    });
  };

  return (
    <>
      <Drawer
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        width="xl"
        title={
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {task.code}
            </span>
            {project && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.name}</span>
              </div>
            )}
          </div>
        }
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Task</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                Last updated {formatRelativeTime(task.updatedAt)}
              </span>
              <Button size="sm" variant="secondary" onClick={() => setSelectedTaskId(null)}>
                Done
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6 text-left">
          {/* Editable Title */}
          <div>
            <input
              type="text"
              value={task.title}
              onChange={e => updateTask(task.id, { title: e.target.value })}
              className="w-full text-lg font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none py-1 transition-colors"
              placeholder="Task title..."
            />
          </div>

          {/* Quick Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs">
            {/* Status */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Status</span>
              </span>
              <select
                value={task.status}
                onChange={e => updateTask(task.id, { status: e.target.value as TaskStatus })}
                className="font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {(Object.keys(TASK_STATUS_CONFIG) as TaskStatus[]).map(statusKey => (
                  <option key={statusKey} value={statusKey}>
                    {TASK_STATUS_CONFIG[statusKey].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Priority</span>
              </span>
              <select
                value={task.priority}
                onChange={e => updateTask(task.id, { priority: e.target.value as TaskPriority })}
                className="font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(priKey => (
                  <option key={priKey} value={priKey}>
                    {PRIORITY_CONFIG[priKey].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                <span>Assignee</span>
              </span>
              <select
                value={task.assigneeId}
                onChange={e => updateTask(task.id, { assigneeId: e.target.value })}
                className="font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[150px] truncate"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Date</span>
              </span>
              <input
                type="date"
                value={task.dueDate}
                onChange={e => updateTask(task.id, { dueDate: e.target.value })}
                className="font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Description & Context
            </label>
            <textarea
              rows={3}
              value={task.description}
              onChange={e => updateTask(task.id, { description: e.target.value })}
              className="w-full text-xs text-slate-800 dark:text-slate-200 leading-relaxed rounded-lg p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              placeholder="Add details, technical considerations, or acceptance criteria..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Tags</span>
              </label>
              {!isAddingTag && (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add tag</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              {isAddingTag && (
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddTag();
                      if (e.key === 'Escape') setIsAddingTag(false);
                    }}
                    placeholder="Tag name..."
                    className="h-7 text-xs px-2 rounded-md bg-white dark:bg-slate-800 border border-indigo-400 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <Button size="xs" variant="primary" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Checklist
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {completedChecklistCount}/{task.checklist.length} ({checklistProgress}%)
                </span>
              </div>
            </div>

            {task.checklist.length > 0 && (
              <ProgressBar value={checklistProgress} size="xs" variant="auto" />
            )}

            <div className="space-y-1.5">
              {task.checklist.map(item => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-2 py-1 px-2 rounded-lg hover:bg-white dark:hover:bg-slate-800/80 transition-colors"
                >
                  <label className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(task.id, item.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                    />
                    <span
                      className={`text-xs ${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200 font-medium'
                      }`}
                    >
                      {item.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteChecklistItem(task.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddChecklist} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newChecklistTitle}
                onChange={e => setNewChecklistTitle(e.target.value)}
                placeholder="Add sub-task or deliverable..."
                className="flex-1 h-8 text-xs px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button type="submit" size="xs" variant="secondary" leftIcon={<Plus className="w-3 h-3" />}>
                Add
              </Button>
            </form>
          </div>

          {/* Dependencies / Relationships */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              <span>Dependencies & Blocking Work</span>
            </label>

            <div className="space-y-2 text-xs">
              {/* Blocked by */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                  Blocked by:
                </span>
                {blockedByTasks.length > 0 ? (
                  <div className="space-y-1">
                    {blockedByTasks.map(bt => (
                      <button
                        key={bt.id}
                        type="button"
                        onClick={() => setSelectedTaskId(bt.id)}
                        className="w-full flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-left hover:border-indigo-400 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-mono text-[10px] text-slate-500 uppercase">
                            {bt.code}
                          </span>
                          <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {bt.title}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-medium px-1.5 rounded ${
                            bt.status === 'done'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {bt.status}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No active blockers.</p>
                )}
              </div>

              {/* Blocks */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">
                  Blocks downstream:
                </span>
                {blocksTasks.length > 0 ? (
                  <div className="space-y-1">
                    {blocksTasks.map(blt => (
                      <button
                        key={blt.id}
                        type="button"
                        onClick={() => setSelectedTaskId(blt.id)}
                        className="w-full flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-left hover:border-indigo-400 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-mono text-[10px] text-slate-500 uppercase">
                            {blt.code}
                          </span>
                          <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {blt.title}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No downstream dependencies.</p>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                <span>Attachments ({taskAttachments.length})</span>
              </label>
              <button
                type="button"
                onClick={handleSimulateFileUpload}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Upload file</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {taskAttachments.map(att => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate" title={att.name}>
                        {att.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{formatBytes(att.sizeBytes)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAttachment(att.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded"
                    title="Remove attachment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {taskAttachments.length === 0 && (
                <p className="text-xs text-slate-400 italic col-span-2 py-2">
                  No files attached yet.
                </p>
              )}
            </div>
          </div>

          {/* Comments / Activity Conversation */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion & Updates ({taskComments.length})</span>
            </label>

            <div className="space-y-3">
              {taskComments.map(c => {
                const author = users.find(u => u.id === c.authorId);
                return (
                  <div
                    key={c.id}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs"
                  >
                    <Avatar user={author} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {author?.name || 'Teammate'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatRelativeTime(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-start gap-2 pt-1">
              <Avatar user={currentUser} size="sm" />
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  placeholder={`Reply as ${currentUser.name}...`}
                  className="w-full text-xs p-2.5 pr-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="absolute right-2.5 bottom-2.5 p-1 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Delete Task"
        description={`Are you sure you want to permanently delete "${task.title}" (${task.code})? This action cannot be undone.`}
        confirmLabel="Delete Task"
        variant="danger"
      />
    </>
  );
};
