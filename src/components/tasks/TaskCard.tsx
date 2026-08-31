import React from 'react';
import { Task, Project, User } from '../../types';
import { PriorityBadge, TaskStatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate, isOverdue, isDueToday } from '../../utils/formatters';
import { CheckSquare, Paperclip, MessageSquare, AlertCircle, Clock, Link2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  project?: Project;
  assignee?: User;
  commentCount?: number;
  attachmentCount?: number;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  isCompact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  project,
  assignee,
  commentCount = 0,
  attachmentCount = 0,
  onClick,
  onDragStart,
  isCompact = false,
}) => {
  const completedChecklistCount = task.checklist.filter(c => c.completed).length;
  const totalChecklistCount = task.checklist.length;
  const overdue = isOverdue(task.dueDate) && task.status !== 'done';
  const dueToday = isDueToday(task.dueDate) && task.status !== 'done';
  const hasBlockers = task.blockedByTaskIds.length > 0;

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-sm transition-all duration-150 p-3.5 cursor-pointer text-left select-none"
    >
      {/* Top Header: Code, Priority, Blocker indicator */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 uppercase">
            {task.code}
          </span>
          {project && (
            <span
              title={project.name}
              className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[110px]"
            >
              {project.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {hasBlockers && task.status !== 'done' && (
            <span
              title={`Blocked by ${task.blockedByTaskIds.length} task(s)`}
              className="p-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Title */}
      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {task.title}
      </h4>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && !isCompact && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-medium"
            >
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-slate-400">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Bottom Row: Checklist Progress, Deadlines, Assignee */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/70 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          {/* Due date */}
          <div
            className={`flex items-center gap-1 font-medium ${
              overdue
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : dueToday
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-400 dark:text-slate-400'
            }`}
          >
            <Clock className="w-3 h-3 shrink-0" />
            <span>{formatDate(task.dueDate)}</span>
          </div>

          {/* Checklist indicator */}
          {totalChecklistCount > 0 && (
            <div
              className={`flex items-center gap-1 ${
                completedChecklistCount === totalChecklistCount
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-slate-400'
              }`}
            >
              <CheckSquare className="w-3 h-3 shrink-0" />
              <span>
                {completedChecklistCount}/{totalChecklistCount}
              </span>
            </div>
          )}

          {/* Attachment count */}
          {attachmentCount > 0 && (
            <div className="flex items-center gap-0.5 text-slate-400">
              <Paperclip className="w-3 h-3" />
              <span>{attachmentCount}</span>
            </div>
          )}

          {/* Comments count */}
          {commentCount > 0 && (
            <div className="flex items-center gap-0.5 text-slate-400">
              <MessageSquare className="w-3 h-3" />
              <span>{commentCount}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        {assignee && (
          <div className="shrink-0" title={`Assigned to ${assignee.name}`}>
            <Avatar user={assignee} size="xs" showStatus />
          </div>
        )}
      </div>
    </div>
  );
};
