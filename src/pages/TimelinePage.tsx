import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { GanttChartSquare, Calendar, ChevronLeft, ChevronRight, Layers, ArrowRight } from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { projects, tasks, milestones, setSelectedProjectId, setSelectedTaskId, setCurrentView } =
    useWorkspace();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = projects.filter(
    p => selectedCategory === 'all' || p.category === selectedCategory
  );

  // Month columns for the timeline grid
  const months = ['Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Timeline & Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize multi-project timelines, delivery phases, and milestone dependencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="h-8 text-xs font-medium px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Security">Security</option>
          </select>
        </div>
      </div>

      {/* Timeline Gantt Chart Container */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
        {/* Timeline Header Row (Months) */}
        <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="col-span-4 p-3.5 border-r border-slate-200 dark:border-slate-800">
            Project / Milestone
          </div>
          <div className="col-span-8 grid grid-cols-6 text-center divide-x divide-slate-200 dark:divide-slate-800">
            {months.map(m => (
              <div key={m} className="p-3.5 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Project Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredProjects.map((project, pIndex) => {
            const projMilestones = milestones.filter(m => m.projectId === project.id);
            const projTasks = tasks.filter(t => t.projectId === project.id);

            // Compute synthetic bar left and width percentages for illustration
            const offsets = [
              { left: '10%', width: '45%', color: 'bg-indigo-500' },
              { left: '25%', width: '60%', color: 'bg-emerald-500' },
              { left: '40%', width: '50%', color: 'bg-amber-500' },
              { left: '15%', width: '70%', color: 'bg-sky-500' },
              { left: '30%', width: '40%', color: 'bg-purple-500' },
            ];
            const barConfig = offsets[pIndex % offsets.length];

            return (
              <div key={project.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                {/* Main Project Row */}
                <div className="grid grid-cols-12 items-center">
                  <div
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setCurrentView('project-detail');
                    }}
                    className="col-span-4 p-3.5 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                        {project.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {project.name}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold tabular-nums text-slate-500 shrink-0">
                      {project.progress}%
                    </span>
                  </div>

                  {/* Gantt Bar Lane */}
                  <div className="col-span-8 p-3.5 relative h-12 flex items-center">
                    {/* Grid Guide Lines */}
                    <div className="absolute inset-0 grid grid-cols-6 divide-x divide-slate-100 dark:divide-slate-800/40 pointer-events-none" />

                    {/* Today marker (subtle dashed vertical line) */}
                    <div className="absolute top-0 bottom-0 left-[35%] w-px bg-rose-400 z-10" />

                    {/* Interactive Project Bar */}
                    <div
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setCurrentView('project-detail');
                      }}
                      style={{ left: barConfig.left, width: barConfig.width }}
                      className={`relative h-6 rounded-lg ${barConfig.color} bg-opacity-90 hover:bg-opacity-100 text-white shadow-2xs flex items-center justify-between px-2.5 text-[10px] font-bold cursor-pointer transition-transform hover:scale-[1.01] z-10`}
                    >
                      <span className="truncate">{project.name}</span>
                      <span className="tabular-nums shrink-0">{formatDate(project.targetDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Milestones */}
                {projMilestones.map(ms => (
                  <div key={ms.id} className="grid grid-cols-12 items-center bg-slate-50/30 dark:bg-slate-900/30 text-xs">
                    <div className="col-span-4 py-2 px-3.5 pl-8 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">
                        ↳ {ms.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(ms.dueDate)}</span>
                    </div>

                    <div className="col-span-8 py-2 px-3.5 relative h-8 flex items-center">
                      <div className="absolute inset-0 grid grid-cols-6 divide-x divide-slate-100 dark:divide-slate-800/20 pointer-events-none" />
                      <div className="w-2.5 h-2.5 rotate-45 bg-indigo-600 dark:bg-indigo-400 shadow-2xs ml-32" />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
