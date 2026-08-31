import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils/formatters';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { tasks, projects, setSelectedTaskId, setIsCreateTaskOpen } = useWorkspace();

  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 10, 1)); // Nov 2024 (matches mock data)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date(2024, 10, 1));
  };

  // Build calendar matrix
  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ dayNumber: null, isCurrentMonth: false, dateStr: '' });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    calendarCells.push({ dayNumber: day, isCurrentMonth: true, dateStr });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Master Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deliverable deadlines, sprint milestones, and launch commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-3 text-slate-800 dark:text-slate-200 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button size="sm" variant="secondary" onClick={handleToday}>
            Today
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

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-center text-xs font-bold text-slate-500 dark:text-slate-400 py-2.5">
          {daysOfWeek.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
          {calendarCells.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[105px] bg-slate-50/40 dark:bg-slate-900/30 p-2"
                />
              );
            }

            const dayTasks = tasks.filter(t => t.dueDate === cell.dateStr);

            return (
              <div
                key={cell.dateStr}
                onClick={() => setIsCreateTaskOpen(true)}
                className="min-h-[105px] p-2 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-left flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {cell.dayNumber}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Day Task Pills */}
                <div className="space-y-1 my-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map(task => {
                    const isDone = task.status === 'done';
                    return (
                      <div
                        key={task.id}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTaskId(task.id);
                        }}
                        className={`text-[10px] p-1 rounded font-medium truncate flex items-center gap-1 ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 line-through opacity-75'
                            : task.priority === 'urgent'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        }`}
                        title={task.title}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}
                  {dayTasks.length > 2 && (
                    <span className="text-[9px] text-slate-400 font-semibold block px-1">
                      +{dayTasks.length - 2} more
                    </span>
                  )}
                </div>
                <div />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
