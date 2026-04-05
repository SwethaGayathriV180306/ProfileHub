import React, { useState, useEffect, useContext } from 'react';
import { admin as adminApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Document } from '../../types';
import { Button } from '../../components/ui/Button';
import { Check, X, Eye } from 'lucide-react';

const DocumentVerification: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [queue, setQueue] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const response = await adminApi.getPendingDocuments();
      setQueue(response.data);
    } catch (error) {
      console.error('Failed to load pending documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (doc: Document, status: 'Approved' | 'Rejected') => {
    const reason = status === 'Rejected' ? prompt("Enter rejection reason for student:") : undefined;
    if (status === 'Rejected' && !reason) return;

    try {
      const targetId = (doc as any)._id || doc.id;
      await adminApi.verifyDocument(targetId, status, reason);
      loadQueue(); // Refresh
    } catch (error) {
      console.error('Action failed', error);
      alert('Action failed');
    }
  };

  if (loading) return <div>Loading Queue...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
       <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Document Verification</h1>
          <p className="text-slate-500 dark:text-slate-400">Review pending uploads from students.</p>
       </div>

       {queue.length === 0 ? (
         <div className="bg-white dark:bg-slate-900 p-12 rounded-xl shadow-sm text-center border border-slate-200 dark:border-slate-800">
            <div className="bg-green-100 dark:bg-green-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
               <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">All Caught Up!</h3>
            <p className="text-slate-500 dark:text-slate-400">No pending documents to review.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queue.map((doc) => (
               <div key={(doc as any)._id || doc.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                  <div className="p-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-start">
                     <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{doc.type}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date((doc as any).uploadedAt || doc.uploadDate).toLocaleDateString()}</p>
                     </div>
                     <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded uppercase">Pending</span>
                  </div>
                  <div className="p-4 flex-1">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
                          {((doc as any).student || (doc as any).uploadedBy)?.name?.[0] || 'U'}
                        </div>
                        <div>
                           <p className="font-semibold text-sm text-slate-800 dark:text-white">{((doc as any).student || (doc as any).uploadedBy)?.name || 'Unknown'}</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400">{((doc as any).student || (doc as any).uploadedBy)?.username || 'N/A'}</p>
                        </div>
                     </div>
                     <div className="bg-slate-100 dark:bg-slate-800/50 rounded p-3 text-sm text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span className="truncate max-w-[150px]">{doc.name}</span>
                        <span className="text-xs font-mono">{Math.round(((doc as any).fileSize || doc.size || 0)/1024)} KB</span>
                     </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex gap-2">
                     <Button className="flex-1 bg-green-600 hover:bg-green-700" size="sm" onClick={() => handleAction(doc, 'Approved')}>Approve</Button>
                     <Button className="flex-1 bg-red-600 hover:bg-red-700" size="sm" onClick={() => handleAction(doc, 'Rejected')}>Reject</Button>
                     <Button variant="secondary" size="sm" onClick={() => {
                        const url = (doc as any).fileUrl || doc.url;
                        if (url) window.open(url, '_blank');
                        else alert("No file URL available for this document.");
                     }}><Eye size={16}/></Button>
                  </div>
               </div>
            ))}
         </div>
       )}
    </div>
  );
};

export default DocumentVerification;