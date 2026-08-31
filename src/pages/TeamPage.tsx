import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Avatar } from '../components/common/Avatar';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { PriorityBadge, TaskStatusBadge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import { Users2, Plus, Mail, CheckSquare, Clock, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { User } from '../types';

export const TeamPage: React.FC = () => {
  const { users, tasks, projects, setSelectedTaskId, setCurrentUserId, currentUser } =
    useWorkspace();

  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const userTasks = tasks.filter(t => t.assigneeId === selectedUser.id);
  const activeUserTasks = userTasks.filter(t => t.status !== 'done');
  const completedUserTasks = userTasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Team & Workload Distribution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor capacity, rebalance project allocations, and avoid team burnout.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsInviteOpen(true)}
        >
          Invite Member
        </Button>
      </div>

      {/* Grid: Left Team List & Capacity / Right Selected Member's Task Workstream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Team Roster & Capacity Bars */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
              Workspace Team ({users.length})
            </span>

            <div className="space-y-2">
              {users.map(u => {
                const isSelected = u.id === selectedUser.id;
                const capacityPct = Math.round((u.assignedHours / u.capacityHours) * 100);
                const isOver = capacityPct > 100;
                const isHeavy = capacityPct >= 85 && capacityPct <= 100;

                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 shadow-2xs'
                        : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/70 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar user={u} size="sm" showStatus />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {u.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate">{u.role}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isOver
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : isHeavy
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {capacityPct}% Load
                      </span>
                    </div>

                    {/* Capacity bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Workload</span>
                        <span className="font-mono tabular-nums">
                          {u.assignedHours}h / {u.capacityHours}h
                        </span>
                      </div>
                      <ProgressBar
                        value={Math.min(capacityPct, 100)}
                        size="xs"
                        variant={isOver ? 'danger' : isHeavy ? 'warning' : 'indigo'}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Member Profile & Active Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Member Card Summary */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Avatar user={selectedUser} size="lg" showStatus />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {selectedUser.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {selectedUser.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedUser.role} · {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selectedUser.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedUser.timeZone}
                    </span>
                  </div>
                </div>
              </div>

              {selectedUser.id !== currentUser.id && (
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => setCurrentUserId(selectedUser.id)}
                >
                  Switch to this Persona
                </Button>
              )}
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Active Tasks
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {activeUserTasks.length}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Completed Tasks
                </span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {completedUserTasks.length}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Weekly Allocated
                </span>
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedUser.assignedHours}h
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Tasks Stream */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-500" />
              <span>Assigned Deliverables ({userTasks.length})</span>
            </h3>

            <div className="space-y-2">
              {userTasks.map(task => {
                const proj = projects.find(p => p.id === task.projectId);

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {task.code} · {proj?.name} · Due {formatDate(task.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <TaskStatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                );
              })}

              {userTasks.length === 0 && (
                <p className="text-xs text-slate-400 italic py-6 text-center">
                  No tasks currently assigned to {selectedUser.name}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Simple Popover/Dialog */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Invite Team Member
            </h3>
            <p className="text-xs text-slate-500">
              Enter their corporate email to add them to the Acme Waypoint workspace.
            </p>
            <input
              type="email"
              placeholder="name@company.com"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setIsInviteOpen(false);
                  setInviteEmail('');
                }}
              >
                Send Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
