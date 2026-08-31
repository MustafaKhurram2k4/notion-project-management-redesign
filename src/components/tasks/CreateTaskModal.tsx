import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Modal } from '../common/Overlay';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Inputs';
import { TaskPriority, TaskStatus } from '../../types';

export const CreateTaskModal: React.FC = () => {
  const {
    isCreateTaskOpen,
    setIsCreateTaskOpen,
    createTask,
    projects,
    users,
    currentUser,
    selectedProjectId,
  } = useWorkspace();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || (projects[0]?.id ?? ''));
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [tagsInput, setTagsInput] = useState('Frontend, Feature');
  const [firstChecklist, setFirstChecklist] = useState('Initial draft & review');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const checklist = firstChecklist.trim()
      ? [{ id: `chk-${Date.now()}`, title: firstChecklist.trim(), completed: false }]
      : [];

    createTask({
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      reporterId: currentUser.id,
      dueDate,
      tags,
      checklist,
      blockedByTaskIds: [],
      blocksTaskIds: [],
      estimatedHours: 8,
      spentHours: 0,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setTagsInput('Frontend, Feature');
    setFirstChecklist('Initial draft & review');
    setIsCreateTaskOpen(false);
  };

  return (
    <Modal
      isOpen={isCreateTaskOpen}
      onClose={() => setIsCreateTaskOpen(false)}
      title="Create New Task"
      description="Add a task with clear ownership, deadline, and project context."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Input
          label="Task Title *"
          placeholder="e.g., Build currency toggle for checkout modal"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Project *"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            required
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </Select>

          <Select
            label="Assignee *"
            value={assigneeId}
            onChange={e => setAssigneeId(e.target.value)}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value as TaskStatus)}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </Select>

          <Select
            label="Priority"
            value={priority}
            onChange={e => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Description & Context
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief scope, technical constraints, or acceptance criteria..."
            className="w-full text-xs p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Tags (comma separated)"
            placeholder="Design, Sprint-3, Web"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
          />

          <Input
            label="First Checklist Item"
            placeholder="e.g., Wireframe review complete"
            value={firstChecklist}
            onChange={e => setFirstChecklist(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsCreateTaskOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={!title.trim()}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
