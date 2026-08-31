import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  Project,
  Task,
  Milestone,
  Attachment,
  Comment,
  ActivityItem,
  NotificationItem,
  TimelinePhase,
  TaskStatus,
  ViewMode,
  ModularBlock,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MILESTONES,
  INITIAL_ATTACHMENTS,
  INITIAL_COMMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TIMELINE_PHASES,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  description?: string;
}

interface WorkspaceContextType {
  // Navigation & View
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  
  // Active User & Switcher
  currentUser: User;
  setCurrentUserId: (id: string) => void;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  isDark: boolean;
  
  // Data Collections
  users: User[];
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  attachments: Attachment[];
  comments: Comment[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  timelinePhases: TimelinePhase[];
  
  // UI Dialog / Drawer Modals
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;
  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isProfileEditOpen: boolean;
  setIsProfileEditOpen: (open: boolean) => void;
  
  // Quick Actions & CRUD
  createProject: (project: Omit<Project, 'id' | 'code' | 'healthScore' | 'progress'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectFavorite: (id: string) => void;
  
  createTask: (task: Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addChecklistItem: (taskId: string, title: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
  
  createMilestone: (milestone: Omit<Milestone, 'id' | 'progress' | 'completedDeliverables'>) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  
  addComment: (taskId: string, content: string) => void;
  uploadAttachment: (attachment: Omit<Attachment, 'id' | 'uploadedAt'>) => void;
  deleteAttachment: (id: string) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  updateProjectBlocks: (projectId: string, blocks: ModularBlock[]) => void;
  
  // System Tools
  resetToDemoData: () => void;
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  dismissToast: (id: string) => void;
}

const STORAGE_PREFIX = 'waypoint_v1_';

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Selection
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PREFIX + 'auth_user_id') || 'user-1';
  });
  
  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem(STORAGE_PREFIX + 'theme') as 'light' | 'dark' | 'system') || 'light';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  // Dialog & Drawer state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastMessage['type'], title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Theme synchronization effect
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      let activeIsDark = false;
      if (theme === 'dark') {
        activeIsDark = true;
      } else if (theme === 'system') {
        activeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsDark(activeIsDark);
      if (activeIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem(STORAGE_PREFIX + 'theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    showToast('info', `Theme updated`, `Interface set to ${newTheme} mode.`);
  };

  // State initialization with localStorage
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [attachments, setAttachments] = useState<Attachment[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'attachments');
    return saved ? JSON.parse(saved) : INITIAL_ATTACHMENTS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'timeline_phases');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE_PHASES;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'attachments', JSON.stringify(attachments));
  }, [attachments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'timeline_phases', JSON.stringify(timelinePhases));
  }, [timelinePhases]);

  // Current user object lookup
  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const setCurrentUserId = (id: string) => {
    setCurrentUserIdState(id);
    localStorage.setItem(STORAGE_PREFIX + 'auth_user_id', id);
    const user = users.find(u => u.id === id);
    if (user) {
      showToast('info', `Active profile switched`, `Viewing workspace as ${user.name} (${user.role}).`);
    }
  };

  // Helper to record activity log
  const logActivity = (
    actorId: string,
    action: string,
    targetTitle: string,
    targetType: ActivityItem['targetType'],
    projectId: string,
    taskId?: string
  ) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      actorId,
      action,
      targetTitle,
      targetType,
      projectId,
      taskId,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newAct, ...prev.slice(0, 49)]);
  };

  // Project CRUD
  const createProject = (projectData: Omit<Project, 'id' | 'code' | 'healthScore' | 'progress'>): Project => {
    const id = `prj-${Date.now()}`;
    const code = projectData.name.substring(0, 3).toUpperCase() || 'PRJ';
    const newProject: Project = {
      ...projectData,
      id,
      code,
      healthScore: 90,
      progress: 0,
      overviewBlocks: [
        {
          id: `blk-${Date.now()}-1`,
          type: 'callout',
          content: `Project kickoff: ${projectData.name}. Target completion date: ${projectData.targetDate}.`,
        },
        {
          id: `blk-${Date.now()}-2`,
          type: 'h2',
          content: 'Objectives & Strategy',
        },
        {
          id: `blk-${Date.now()}-3`,
          type: 'text',
          content: projectData.description,
        },
      ],
    };

    setProjects(prev => [newProject, ...prev]);
    logActivity(currentUser.id, 'created project', newProject.name, 'project', id);
    showToast('success', 'Project created', `"${newProject.name}" is now ready in your workspace.`);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );
    showToast('success', 'Project updated', 'Changes have been saved.');
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    setMilestones(prev => prev.filter(m => m.projectId !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
      setCurrentView('projects');
    }
    showToast('info', 'Project deleted', project ? `"${project.name}" has been removed.` : 'Project removed.');
  };

  const toggleProjectFavorite = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Task CRUD
  const createTask = (taskData: Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Task => {
    const id = `task-${Date.now()}`;
    const project = projects.find(p => p.id === taskData.projectId);
    const code = project ? `${project.code}-${Math.floor(100 + Math.random() * 900)}` : `TSK-${Math.floor(100 + Math.random() * 900)}`;
    
    const newTask: Task = {
      ...taskData,
      id,
      code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    logActivity(currentUser.id, 'created task', newTask.title, 'task', newTask.projectId, newTask.id);

    // Notify assignee if not creator
    if (newTask.assigneeId && newTask.assigneeId !== currentUser.id) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'New Task Assignment',
        message: `${currentUser.name} assigned you to "${newTask.title}".`,
        type: 'assignment',
        read: false,
        timestamp: new Date().toISOString(),
        projectId: newTask.projectId,
        taskId: newTask.id,
      };
      setNotifications(prev => [notif, ...prev]);
    }

    showToast('success', 'Task created', `"${newTask.title}" added.`);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
          return updated;
        }
        return t;
      })
    );
    showToast('success', 'Task updated', 'Changes saved successfully.');
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
    showToast('info', 'Task deleted', task ? `"${task.title}" was deleted.` : 'Task removed.');
  };

  const moveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          if (t.status === newStatus) return t;
          logActivity(currentUser.id, `moved task to ${newStatus.replace('_', ' ')}`, t.title, 'task', t.projectId, taskId);
          return { ...t, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  // Checklist management
  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const newChecklist = t.checklist.map(c => (c.id === itemId ? { ...c, completed: !c.completed } : c));
          return { ...t, checklist: newChecklist, updatedAt: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  const addChecklistItem = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newItem = { id: `chk-${Date.now()}`, title: title.trim(), completed: false };
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, checklist: [...t.checklist, newItem], updatedAt: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  const deleteChecklistItem = (taskId: string, itemId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, checklist: t.checklist.filter(c => c.id !== itemId), updatedAt: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  // Milestones CRUD
  const createMilestone = (milestoneData: Omit<Milestone, 'id' | 'progress' | 'completedDeliverables'>) => {
    const id = `ms-${Date.now()}`;
    const newMs: Milestone = {
      ...milestoneData,
      id,
      progress: milestoneData.status === 'completed' ? 100 : 0,
      completedDeliverables: [],
    };
    setMilestones(prev => [...prev, newMs]);
    logActivity(currentUser.id, 'added milestone', newMs.title, 'milestone', newMs.projectId);
    showToast('success', 'Milestone added', `"${newMs.title}" scheduled.`);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(prev =>
      prev.map(m => {
        if (m.id === id) {
          return { ...m, ...updates };
        }
        return m;
      })
    );
    showToast('success', 'Milestone updated', 'Milestone details updated.');
  };

  const deleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
    showToast('info', 'Milestone deleted', 'Milestone removed.');
  };

  // Comments
  const addComment = (taskId: string, content: string) => {
    if (!content.trim()) return;
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      taskId,
      authorId: currentUser.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments(prev => [...prev, newComment]);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      logActivity(currentUser.id, 'commented on', task.title, 'comment', task.projectId, taskId);
    }
  };

  // Attachments
  const uploadAttachment = (attachmentData: Omit<Attachment, 'id' | 'uploadedAt'>) => {
    const newAtt: Attachment = {
      ...attachmentData,
      id: `att-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setAttachments(prev => [newAtt, ...prev]);
    logActivity(currentUser.id, 'uploaded file', newAtt.name, 'file', newAtt.projectId, newAtt.taskId);
    showToast('success', 'File uploaded', `"${newAtt.name}" is now accessible.`);
  };

  const deleteAttachment = (id: string) => {
    const att = attachments.find(a => a.id === id);
    setAttachments(prev => prev.filter(a => a.id !== id));
    showToast('info', 'File deleted', att ? `"${att.name}" removed.` : 'Attachment deleted.');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('info', 'Notifications cleared', 'All notifications marked as read.');
  };

  // Modular Project Blocks
  const updateProjectBlocks = (projectId: string, blocks: ModularBlock[]) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, overviewBlocks: blocks } : p))
    );
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setUsers(INITIAL_USERS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setMilestones(INITIAL_MILESTONES);
    setAttachments(INITIAL_ATTACHMENTS);
    setComments(INITIAL_COMMENTS);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTimelinePhases(INITIAL_TIMELINE_PHASES);
    setSelectedProjectId(null);
    setSelectedTaskId(null);
    setCurrentView('dashboard');
    showToast('success', 'Workspace Reset', 'Demo workspace restored to pristine initial state.');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProjectId,
        setSelectedProjectId,
        currentUser,
        setCurrentUserId,
        theme,
        setTheme,
        isDark,
        users,
        projects,
        tasks,
        milestones,
        attachments,
        comments,
        activities,
        notifications,
        timelinePhases,
        selectedTaskId,
        setSelectedTaskId,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isProfileEditOpen,
        setIsProfileEditOpen,
        createProject,
        updateProject,
        deleteProject,
        toggleProjectFavorite,
        createTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        createMilestone,
        updateMilestone,
        deleteMilestone,
        addComment,
        uploadAttachment,
        deleteAttachment,
        markNotificationRead,
        markAllNotificationsRead,
        updateProjectBlocks,
        resetToDemoData,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
