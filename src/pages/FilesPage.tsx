import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Button } from '../components/common/Button';
import { SearchInput } from '../components/common/Inputs';
import { Avatar } from '../components/common/Avatar';
import { formatBytes, formatDate } from '../utils/formatters';
import {
  FolderArchive,
  Plus,
  FileText,
  FileCode,
  Image,
  Paperclip,
  Trash2,
  Download,
  ExternalLink,
} from 'lucide-react';

export const FilesPage: React.FC = () => {
  const { attachments, projects, users, currentUser, uploadAttachment, deleteAttachment } =
    useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredAttachments = attachments.filter(att => {
    if (searchQuery && !att.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (projectFilter !== 'all' && att.projectId !== projectFilter) {
      return false;
    }
    if (typeFilter !== 'all' && att.type !== typeFilter) {
      return false;
    }
    return true;
  });

  const handleUploadSimulated = () => {
    uploadAttachment({
      name: `Design-Tokens-Export-${Date.now().toString().slice(-4)}.json`,
      type: 'code',
      sizeBytes: 340000,
      uploadedById: currentUser.id,
      projectId: projects[0]?.id,
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5 text-emerald-500" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-indigo-500" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      default:
        return <Paperclip className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Centralized Asset Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Specifications, architecture diagrams, and design deliverables across all initiatives.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleUploadSimulated}
        >
          Upload Asset
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="w-full sm:w-64">
            <SearchInput
              size="sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search assets by file name..."
            />
          </div>

          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="h-8 text-xs font-medium px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="h-8 text-xs font-medium px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="image">Design Mockups</option>
            <option value="code">Schemas & Code</option>
            <option value="archive">Archives</option>
          </select>
        </div>
      </div>

      {/* Grid of Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAttachments.map(att => {
          const uploader = users.find(u => u.id === att.uploadedById);
          const proj = projects.find(p => p.id === att.projectId);

          return (
            <div
              key={att.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getFileIcon(att.type)}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAttachment(att.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate mb-1" title={att.name}>
                  {att.name}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {proj ? proj.name : 'Workspace General'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
                <span>{formatBytes(att.sizeBytes)}</span>
                <div className="flex items-center gap-1.5">
                  <Avatar user={uploader} size="xs" />
                  <span>{uploader?.name.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
