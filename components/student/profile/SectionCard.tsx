import React from 'react';
import { Button } from '../../ui/Button';
import { Edit2, Save, X } from 'lucide-react';

interface SectionCardProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  loading = false,
  children
}) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6 transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-500/50 dark:ring-blue-500/30' : 'hover:shadow-md dark:shadow-none'}`}>
      <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h3>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all ml-4">
            <Edit2 className="w-4 h-4 mr-2" /> <span className="font-bold">Edit</span>
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold">
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={onSave} isLoading={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20">
              <Save className="w-4 h-4 mr-1" /> Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};
