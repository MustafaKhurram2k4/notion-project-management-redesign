import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Overlay';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { User, UserStatus } from '../../types';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Building,
  MapPin,
  Clock,
  Camera,
  Check,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, showToast } = useWorkspace();
  const { updateProfile, logout } = useAuth();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);
  const [department, setDepartment] = useState(currentUser.department);
  const [location, setLocation] = useState(currentUser.location || 'San Francisco, CA');
  const [status, setStatus] = useState<UserStatus>(currentUser.status || 'available');
  const [capacityHours, setCapacityHours] = useState(currentUser.capacityHours || 40);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setRole(currentUser.role);
    setDepartment(currentUser.department);
    setLocation(currentUser.location || 'San Francisco, CA');
    setStatus(currentUser.status || 'available');
    setCapacityHours(currentUser.capacityHours || 40);
    setAvatar(currentUser.avatar);
  }, [currentUser, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Validation Error', 'Display name cannot be empty.');
      return;
    }

    const updates: Partial<User> = {
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      department: department.trim(),
      location: location.trim(),
      status,
      capacityHours: Number(capacityHours) || 40,
      avatar,
    };

    updateProfile(updates);
    showToast('success', 'Profile Updated', 'Your display credentials and avatar were saved.');
    onClose();
  };

  const handleLogout = () => {
    onClose();
    logout();
    showToast('info', 'Logged Out', 'You have been disconnected from the active workspace.');
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setAvatar(customAvatarUrl.trim());
      setShowUrlInput(false);
      setCustomAvatarUrl('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Edit Workspace Profile"
      description="Update your personal details, avatar, team status, and weekly workload capacity."
    >
      <form onSubmit={handleSave} className="space-y-5 text-left pt-2">
        {/* Avatar Selection Strip */}
        <div className="space-y-2 p-3.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-300/70 dark:border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Profile Avatar
            </span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline cursor-pointer"
            >
              {showUrlInput ? 'Cancel URL' : 'Custom Image URL'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group shrink-0">
              <img
                src={avatar}
                alt={name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-900 dark:ring-white"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Avatar Swatches */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    avatar === av
                      ? 'border-neutral-900 dark:border-white scale-105 ring-2 ring-black/10 dark:ring-white/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="Preset avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {avatar === av && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {showUrlInput && (
            <div className="flex items-center gap-2 pt-2 animate-in fade-in">
              <input
                type="url"
                value={customAvatarUrl}
                onChange={e => setCustomAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="flex-1 h-8 text-xs px-2.5 rounded-lg bg-white dark:bg-[#121214] border border-neutral-300 dark:border-white/15 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
              />
              <Button size="xs" variant="primary" type="button" onClick={handleApplyCustomUrl}>
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Name & Email Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Display Name
            </label>
            <div className="relative">
              <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-white dark:bg-[#121214] border border-neutral-300/80 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-white dark:bg-[#121214] border border-neutral-300/80 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
              />
            </div>
          </div>
        </div>

        {/* Role & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Role Title
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-white dark:bg-[#121214] border border-neutral-300/80 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Department
            </label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-white dark:bg-[#121214] border border-neutral-300/80 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
              >
                <option value="Product">Product</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Status & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Location
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-white dark:bg-[#121214] border border-neutral-300/80 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Availability
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as UserStatus)}
              className="w-full h-9 px-2.5 rounded-lg bg-white dark:bg-[#121214] border border-neutral-300/80 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
            >
              <option value="available">🟢 Available</option>
              <option value="focus">🟣 Focus Mode</option>
              <option value="busy">🟡 In Meetings</option>
              <option value="away">⚪ Out of Office</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              Capacity (Hrs/Wk)
            </label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="number"
                min="10"
                max="80"
                value={capacityHours}
                onChange={e => setCapacityHours(Number(e.target.value))}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-white dark:bg-[#121214] border border-neutral-300/80 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all font-sans"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline font-mono uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
