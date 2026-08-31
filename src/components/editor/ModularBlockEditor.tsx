import React, { useState } from 'react';
import { ModularBlock } from '../../types';
import { Plus, Trash2, GripVertical, AlertCircle, Heading, CheckSquare, Type, Quote, Table } from 'lucide-react';

interface ModularBlockEditorProps {
  blocks: ModularBlock[];
  onChange: (blocks: ModularBlock[]) => void;
  readOnly?: boolean;
}

export const ModularBlockEditor: React.FC<ModularBlockEditorProps> = ({
  blocks,
  onChange,
  readOnly = false,
}) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  const updateBlockContent = (id: string, content: string) => {
    onChange(blocks.map(b => (b.id === id ? { ...b, content } : b)));
  };

  const addBlock = (type: ModularBlock['type'], afterIndex: number) => {
    const newBlock: ModularBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      content:
        type === 'callout'
          ? 'Important notice or strategic constraint for this phase.'
          : type === 'h2'
          ? 'New Section Heading'
          : type === 'checklist'
          ? 'First deliverable or verification item'
          : type === 'quote'
          ? 'Client feedback or executive principle statement.'
          : 'Write your notes or documentation details here...',
    };

    const newBlocks = [...blocks];
    newBlocks.splice(afterIndex + 1, 0, newBlock);
    onChange(newBlocks);
    setActiveMenuIndex(null);
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return;
    onChange(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => (
        <div key={block.id} className="group relative rounded-lg transition-colors p-1 -mx-1 hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
          <div className="flex items-start gap-2">
            {!readOnly && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 pt-1 shrink-0">
                <button
                  type="button"
                  title="Add block below"
                  onClick={() => setActiveMenuIndex(activeMenuIndex === idx ? null : idx)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Remove block"
                  onClick={() => removeBlock(block.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Block Type Rendering */}
            <div className="flex-1 min-w-0">
              {block.type === 'h1' && (
                <input
                  type="text"
                  disabled={readOnly}
                  value={block.content}
                  onChange={e => updateBlockContent(block.id, e.target.value)}
                  className="w-full text-lg font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none py-1"
                />
              )}

              {block.type === 'h2' && (
                <input
                  type="text"
                  disabled={readOnly}
                  value={block.content}
                  onChange={e => updateBlockContent(block.id, e.target.value)}
                  className="w-full text-base font-bold text-slate-800 dark:text-slate-200 bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none py-1"
                />
              )}

              {block.type === 'callout' && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-950 dark:text-indigo-200">
                  <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <textarea
                    rows={2}
                    disabled={readOnly}
                    value={block.content}
                    onChange={e => updateBlockContent(block.id, e.target.value)}
                    className="w-full text-xs leading-relaxed bg-transparent resize-none focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
              )}

              {block.type === 'quote' && (
                <div className="border-l-2 border-slate-400 dark:border-slate-600 pl-3 py-1 italic">
                  <textarea
                    rows={2}
                    disabled={readOnly}
                    value={block.content}
                    onChange={e => updateBlockContent(block.id, e.target.value)}
                    className="w-full text-xs leading-relaxed bg-transparent resize-none focus:outline-none text-slate-700 dark:text-slate-300 italic"
                  />
                </div>
              )}

              {block.type === 'checklist' && (
                <div className="space-y-1.5 py-1">
                  {block.content.split('\n').map((line, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <input
                        type="text"
                        disabled={readOnly}
                        value={line}
                        onChange={e => {
                          const lines = block.content.split('\n');
                          lines[lIdx] = e.target.value;
                          updateBlockContent(block.id, lines.join('\n'));
                        }}
                        className="flex-1 text-xs text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {block.type === 'text' && (
                <textarea
                  rows={2}
                  disabled={readOnly}
                  value={block.content}
                  onChange={e => updateBlockContent(block.id, e.target.value)}
                  className="w-full text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-transparent resize-none focus:outline-none focus:bg-white dark:focus:bg-slate-800/50 rounded p-1"
                />
              )}
            </div>
          </div>

          {/* Quick Insert Popover */}
          {activeMenuIndex === idx && (
            <div className="absolute left-10 top-8 z-30 w-56 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 gap-1 text-xs animate-in zoom-in-95">
              <span className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Insert Block
              </span>
              <button
                type="button"
                onClick={() => addBlock('text', idx)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
              >
                <Type className="w-3.5 h-3.5 text-slate-400" />
                <span>Text Paragraph</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('h2', idx)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
              >
                <Heading className="w-3.5 h-3.5 text-slate-400" />
                <span>Section Heading</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('callout', idx)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
              >
                <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>Callout Box</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('checklist', idx)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>Deliverables Checklist</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('quote', idx)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
              >
                <Quote className="w-3.5 h-3.5 text-amber-500" />
                <span>Quote / Note</span>
              </button>
            </div>
          )}
        </div>
      ))}

      {!readOnly && (
        <button
          type="button"
          onClick={() => addBlock('text', blocks.length - 1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-1 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add block</span>
        </button>
      )}
    </div>
  );
};
