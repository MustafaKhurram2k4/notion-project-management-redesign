import React from 'react';
import { User, UserStatus } from '../../types';

interface AvatarProps {
  user?: User;
  name?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: UserStatus;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  name,
  avatarUrl,
  size = 'md',
  showStatus = false,
  status,
  className = '',
}) => {
  const displayName = user?.name || name || 'User';
  const imgUrl = user?.avatar || avatarUrl;
  const userStatus = status || user?.status || 'available';

  const sizeStyles = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-6 h-6 text-[11px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
    xl: 'w-14 h-14 text-base font-semibold',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  };

  const statusColors: Record<UserStatus, string> = {
    available: 'bg-emerald-500',
    busy: 'bg-rose-500',
    focus: 'bg-indigo-500',
    away: 'bg-amber-400',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={displayName}
          referrerPolicy="no-referrer"
          className={`${sizeStyles[size]} rounded-full object-cover ring-1 ring-slate-200/80 dark:ring-slate-700/80`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-medium ring-1 ring-slate-200/80 dark:ring-slate-700/80`}
        >
          {getInitials(displayName)}
        </div>
      )}

      {showStatus && (
        <span
          title={`Status: ${userStatus}`}
          className={`absolute bottom-0 right-0 rounded-full ring-white dark:ring-slate-900 ${statusDotSizes[size]} ${statusColors[userStatus]}`}
        />
      )}
    </div>
  );
};

export const AvatarGroup: React.FC<{
  users: User[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}> = ({ users, max = 3, size = 'sm', className = '' }) => {
  const visible = users.slice(0, max);
  const remainder = users.length - max;

  const sizeStyles = {
    xs: 'w-5 h-5 text-[9px] -ml-1.5',
    sm: 'w-6 h-6 text-[10px] -ml-2',
    md: 'w-8 h-8 text-xs -ml-2.5',
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {visible.map((u, i) => (
        <div key={u.id} className={i === 0 ? '' : sizeStyles[size]} title={`${u.name} (${u.role})`}>
          <Avatar user={u} size={size} />
        </div>
      ))}
      {remainder > 0 && (
        <div
          title={`${remainder} more members`}
          className={`${sizeStyles[size]} rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-semibold ring-2 ring-white dark:ring-slate-900`}
        >
          +{remainder}
        </div>
      )}
    </div>
  );
};
