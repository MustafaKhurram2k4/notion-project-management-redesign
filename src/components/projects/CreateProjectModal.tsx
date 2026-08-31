import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Modal } from '../common/Overlay';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Inputs';
import { ProjectStatus } from '../../types';

export const CreateProjectModal: React.FC = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, createProject, users, currentUser } =
    useWorkspace();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<
    'Product' | 'Design' | 'Engineering' | 'Marketing' | 'Operations' | 'Security'
  >('Product');
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const [ownerId, setOwnerId] = useState(currentUser.id);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  });
  const [budgetTotal, setBudgetTotal] = useState('65000');
  const [tagsInput, setTagsInput] = useState('Strategic, Q4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const project = createProject({
      name: name.trim(),
      description: description.trim(),
      category,
      status,
      startDate: new Date().toISOString().split('T')[0],
      targetDate,
      ownerId,
      memberIds: [ownerId, 'user-2', 'user-3'],
      budgetTotal: parseFloat(budgetTotal) || 50000,
      budgetSpent: 0,
      isFavorite: false,
      tags,
    });

    setName('');
    setDescription('');
    setIsCreateProjectOpen(false);
  };

  return (
    <Modal
      isOpen={isCreateProjectOpen}
      onClose={() => setIsCreateProjectOpen(false)}
      title="Create New Project"
      description="Initialize a dedicated project workspace with milestones, health metrics, and team ownership."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <Input
          label="Project Name *"
          placeholder="e.g., Enterprise Analytics Dashboard"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={e => setCategory(e.target.value as any)}
          >
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Security">Security</option>
            <option value="Operations">Operations</option>
          </Select>

          <Select
            label="Project Lead / Owner"
            value={ownerId}
            onChange={e => setOwnerId(e.target.value)}
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
            label="Initial Status"
            value={status}
            onChange={e => setStatus(e.target.value as ProjectStatus)}
          >
            <option value="planning">Planning</option>
            <option value="on_track">On Track</option>
            <option value="at_risk">At Risk</option>
            <option value="on_hold">On Hold</option>
          </Select>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Deadline
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <Input
            label="Budget (USD)"
            type="number"
            value={budgetTotal}
            onChange={e => setBudgetTotal(e.target.value)}
            placeholder="50000"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Project Overview & Mission
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="High level goals, impact, or key deliverables for the team..."
            className="w-full text-xs p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <Input
          label="Tags (comma separated)"
          placeholder="Strategic, Core, Web"
          value={tagsInput}
          onChange={e => setTagsInput(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsCreateProjectOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={!name.trim()}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
