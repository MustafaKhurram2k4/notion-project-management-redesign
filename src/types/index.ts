export type ProjectStatus = 'planning' | 'on_track' | 'at_risk' | 'on_hold' | 'completed';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type MilestoneStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';
export type UserStatus = 'available' | 'busy' | 'focus' | 'away';

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar: string;
  status: UserStatus;
  capacityHours: number;
  assignedHours: number;
  location: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
  dueDate?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes?: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'figma' | 'pdf' | 'image' | 'code' | 'doc' | 'archive' | 'sheet';
  sizeBytes: number;
  url?: string;
  uploadedById: string;
  uploadedAt: string;
  projectId: string;
  taskId?: string;
}

export interface Task {
  id: string;
  code: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  reporterId: string;
  startDate?: string;
  dueDate: string;
  tags: string[];
  checklist: ChecklistItem[];
  blockedByTaskIds: string[];
  blocksTaskIds: string[];
  estimatedHours: number;
  spentHours: number;
  createdAt: string;
  updatedAt: string;
  modularNotes?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  progress: number; // 0 - 100
  targetDeliverables: string[];
  completedDeliverables: string[];
}

export interface ModularBlock {
  id: string;
  type: 'text' | 'h1' | 'h2' | 'callout' | 'checklist' | 'quote' | 'table';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'Product' | 'Design' | 'Engineering' | 'Marketing' | 'Operations' | 'Security';
  status: ProjectStatus;
  healthScore: number; // 0 - 100
  progress: number; // 0 - 100
  startDate: string;
  targetDate: string;
  ownerId: string;
  memberIds: string[];
  budgetTotal: number;
  budgetSpent: number;
  isFavorite?: boolean;
  tags: string[];
  overviewBlocks?: ModularBlock[];
}

export interface TimelinePhase {
  id: string;
  projectId: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'planned' | 'delayed';
  ownerId: string;
  dependencyIds: string[];
}

export interface ActivityItem {
  id: string;
  actorId: string;
  action: string;
  targetTitle: string;
  targetType: 'task' | 'project' | 'milestone' | 'file' | 'comment';
  projectId: string;
  taskId?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'deadline' | 'mention' | 'status_change' | 'milestone';
  read: boolean;
  timestamp: string;
  projectId?: string;
  taskId?: string;
}

export type ViewMode = 
  | 'dashboard'
  | 'projects'
  | 'project-detail'
  | 'tasks'
  | 'timeline'
  | 'calendar'
  | 'team'
  | 'files'
  | 'settings';
