import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from '../tasks/TaskCard';
import { TASK_STATUS_CONFIG } from '../../utils/formatters';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  filterAssigneeId?: string;
  filterProjectId?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  filterAssigneeId,
  filterProjectId,
}) => {
  const {
    projects,
    users,
    comments,
    attachments,
    moveTaskStatus,
    setSelectedTaskId,
    setIsCreateTaskOpen,
  } = useWorkspace();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const columns: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

  const filteredTasks = tasks.filter(t => {
    if (filterAssigneeId && filterAssigneeId !== 'all' && t.assigneeId !== filterAssigneeId) {
      return false;
    }
    if (filterProjectId && filterProjectId !== 'all' && t.projectId !== filterProjectId) {
      return false;
    }
    return true;
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, status);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[calc(100vh-260px)]">
      {columns.map(statusKey => {
        const config = TASK_STATUS_CONFIG[statusKey];
        const columnTasks = filteredTasks.filter(t => t.status === statusKey);
        const isOver = dragOverColumn === statusKey;

        return (
          <div
            key={statusKey}
            onDragOver={e => handleDragOver(e, statusKey)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, statusKey)}
            className={`flex flex-col flex-1 min-w-[280px] max-w-[340px] rounded-2xl border transition-all ${
              isOver
                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20'
                : 'bg-slate-100/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase font-mono">
                  {config.columnTitle}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 shadow-2xs tabular-nums">
                  {columnTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateTaskOpen(true)}
                title={`Add task to ${config.label}`}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto max-h-[calc(100vh-320px)]">
              {columnTasks.map(task => {
                const proj = projects.find(p => p.id === task.projectId);
                const assignee = users.find(u => u.id === task.assigneeId);
                const taskComments = comments.filter(c => c.taskId === task.id);
                const taskAttachments = attachments.filter(a => a.taskId === task.id);

                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={proj}
                    assignee={assignee}
                    commentCount={taskComments.length}
                    attachmentCount={taskAttachments.length}
                    onClick={() => setSelectedTaskId(task.id)}
                    onDragStart={e => handleDragStart(e, task.id)}
                  />
                );
              })}

              {columnTasks.length === 0 && (
                <div className="py-10 text-center border-2 border-dashed border-slate-200/60 dark:border-slate-800/80 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">No tasks in this lane</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
