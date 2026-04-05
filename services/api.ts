import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('profilehub_session');
      
      // Dispatch event to notify App component to clear user state
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  changePassword: (data: any) => api.post('/auth/change-password', data),
};

export const student = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data: any) => api.put('/student/profile', data),
  uploadProfilePhoto: (formData: any) => api.post('/student/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getPublicProfile: (username: string) => api.get(`/student/public/${username}`),
  getNotifications: () => api.get('/student/notifications'),
  markNotificationsRead: () => api.put('/student/notifications/read'),
};

export const placement = {
  getPlacements: () => api.get('/placement/placements'),
  addPlacement: (data: any) => api.post('/placement/placements', data),
  getInternships: () => api.get('/placement/internships'),
  addInternship: (data: any) => api.post('/placement/internships', data),
  getResumeStrength: () => api.get('/placement/resume-strength'),
};

export const analytics = {
  getStudentAnalytics: () => api.get('/analytics/student'),
  getAdminAnalytics: () => api.get('/analytics/admin'),
};

export const document = {
  uploadDocument: (formData: any) => api.post('/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getDocuments: (params?: any) => api.get('/document', { params }),
  deleteDocument: (id: string) => api.delete(`/document/${id}`),
};

export const admin = {
  getStudents: () => api.get('/admin/students'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  bulkApprove: (studentIds: string[]) => api.post('/admin/bulk-approve', { studentIds }),
  getSuspiciousFiles: () => api.get('/admin/suspicious-files'),
  getPendingDocuments: () => api.get('/admin/documents/pending'),
  verifyDocument: (id: string, status: 'Approved' | 'Rejected', feedback?: string) => 
    api.put(`/admin/documents/${id}/verify`, { status, feedback }),
  updateStudent: (id: string, data: any) => api.put(`/admin/students/${id}`, data),
  resetStudentPassword: (id: string) => api.post(`/admin/students/${id}/reset-password`),
};

export default api;
