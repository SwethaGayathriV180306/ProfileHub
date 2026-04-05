import React, { useState, useEffect } from 'react';
import { document as documentApi } from '../../services/api';
import { Document } from '../../types';
import { Button } from '../../components/ui/Button';
import { Upload, Trash2, Eye, FileText, Image as ImageIcon, X, Search, Filter, AlertTriangle, RefreshCw, Clock } from 'lucide-react';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadType, setUploadType] = useState<Document['type']>('Resume');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentApi.getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', uploadType);

    try {
      await documentApi.uploadDocument(formData);
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await documentApi.deleteDocument(docId);
      setDeleteConfirm(null);
      if (previewDoc?.id === docId) setPreviewDoc(null);
      fetchDocuments();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Delete failed');
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const filteredDocs = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === 'All' || doc.type === filterType)
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.size - a.size;
      return 0;
    });

  if (loading) return <div>Loading Documents...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Document Manager</h1>
           <p className="text-slate-500 dark:text-slate-400">Upload resumes, certificates, and proofs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-fit">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 border-b dark:border-slate-800 pb-2">Upload New Document</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Document Type</label>
              <select className="w-full border-slate-300 dark:border-slate-700 rounded-lg shadow-sm p-2 border bg-white dark:bg-slate-800 dark:text-white"
                value={uploadType} onChange={(e) => setUploadType(e.target.value as any)}>
                <option value="Resume">Resume</option>
                <option value="Certificate">Certificate</option>
                <option value="Project">Project Document</option>
                <option value="Internship">Internship Proof</option>
                <option value="Placement">Placement Related</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                <Upload className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Click to upload</span>
                <span className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</span>
              </label>
            </div>
            {selectedFile && (
              <div className="text-sm bg-blue-50 dark:bg-blue-900/30 p-2 rounded text-blue-800 dark:text-blue-300 flex justify-between items-center">
                <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={()=>setSelectedFile(null)}/>
              </div>
            )}
            <Button className="w-full" disabled={!selectedFile} onClick={handleUpload}>Upload Document</Button>
          </div>
        </div>

        {/* List & Filters */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="pl-9 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="border border-slate-200 dark:border-slate-700 rounded-lg text-sm p-2 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Resume">Resume</option>
                <option value="Certificate">Certificate</option>
                <option value="Project">Project</option>
                <option value="Internship">Internship</option>
              </select>
              <select 
                className="border border-slate-200 dark:border-slate-700 rounded-lg text-sm p-2 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="date">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>

          {/* Document List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px]">
             <div className="px-6 py-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300 flex justify-between items-center">
               <span>Uploaded Documents ({filteredDocs.length})</span>
               <Button variant="ghost" size="sm" onClick={fetchDocuments}><RefreshCw className="w-4 h-4"/></Button>
             </div>
             
             {filteredDocs.length === 0 ? (
               <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                 <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                 <p>No documents found matching your criteria.</p>
               </div>
             ) : (
               <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                 {filteredDocs.map(doc => (
                   <li key={doc.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-4 flex-1 min-w-0">
                       <div className={`p-3 rounded-lg shrink-0 ${doc.fileType === 'pdf' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                         {['jpg','png','jpeg'].includes(doc.fileType) ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                       </div>
                       <div className="min-w-0 flex-1">
                         <div className="flex items-center gap-2 flex-wrap">
                           <p className="font-semibold text-slate-800 dark:text-white truncate">{doc.name}</p>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                             doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                             doc.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                           }`}>{doc.status}</span>
                         </div>
                         <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                           <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{doc.type}</span>
                           <span>{formatBytes(doc.size)}</span>
                           <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(doc.uploadDate).toLocaleDateString()}</span>
                         </div>
                         {doc.status === 'Rejected' && doc.feedback && (
                           <p className="text-xs text-red-600 mt-1 flex items-center gap-1 bg-red-50 px-2 py-1 rounded w-fit">
                             <AlertTriangle className="w-3 h-3"/> {doc.feedback}
                           </p>
                         )}
                       </div>
                     </div>
                     <div className="flex gap-2 shrink-0">
                       <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(doc)} title="View">
                         <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(doc.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50" title="Delete">
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-sm w-full p-6 text-center border dark:border-slate-800">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Delete Document?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Are you sure you want to delete this document? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white truncate pr-4">{previewDoc.name}</h3>
              <button onClick={() => setPreviewDoc(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-500 dark:text-slate-400 hover:text-red-500"/>
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 p-4 overflow-auto flex justify-center items-center relative">
              {['jpg', 'png', 'jpeg'].includes(previewDoc.fileType) ? (
                <img src={previewDoc.url} className="max-w-full max-h-full object-contain shadow-lg" alt="Preview" />
              ) : previewDoc.fileType === 'pdf' ? (
                <iframe src={previewDoc.url} className="w-full h-full min-h-[500px] shadow-lg bg-white" title="PDF Preview" />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                  <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600 mb-4">Preview not available for this file type.</p>
                  <a href={previewDoc.url} download className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
