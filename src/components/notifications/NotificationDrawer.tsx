import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Drawer } from '../common/Overlay';
import { Button } from '../common/Button';
import { Tabs } from '../common/Feedback';
import { formatRelativeTime } from '../../utils/formatters';
import { Bell, Check, Clock, AlertCircle, MessageSquare, CheckCheck, Sparkles } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedTaskId,
    setSelectedProjectId,
    setCurrentView,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions' | 'deadlines'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'mentions') return n.type === 'mention';
    if (activeTab === 'deadlines') return n.type === 'deadline';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'status_change':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'mention':
        return <MessageSquare className="w-4 h-4 text-indigo-500 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.taskId) {
      setSelectedTaskId(notif.taskId);
      setIsNotificationDrawerOpen(false);
    } else if (notif.projectId) {
      setSelectedProjectId(notif.projectId);
      setCurrentView('project-detail');
      setIsNotificationDrawerOpen(false);
    }
  };

  return (
    <Drawer
      isOpen={isNotificationDrawerOpen}
      onClose={() => setIsNotificationDrawerOpen(false)}
      width="md"
      title={
        <div className="flex items-center justify-between w-full pr-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40 disabled:no-underline font-medium cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
          <Button size="sm" variant="secondary" onClick={() => setIsNotificationDrawerOpen(false)}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'deadlines', label: 'Deadlines' },
            { id: 'mentions', label: 'Mentions' },
          ]}
          activeTab={activeTab}
          onChange={tab => setActiveTab(tab as any)}
        />

        <div className="space-y-2">
          {filteredNotifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                notif.read
                  ? 'bg-white dark:bg-slate-900/50 border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-900/50 shadow-xs'
              }`}
            >
              <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4
                    className={`text-xs font-semibold truncate ${
                      notif.read
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatRelativeTime(notif.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <button
                  type="button"
                  title="Mark as read"
                  onClick={e => {
                    e.stopPropagation();
                    markNotificationRead(notif.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="py-12 text-center">
              <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No notifications in this view
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                You're all caught up with your project updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
