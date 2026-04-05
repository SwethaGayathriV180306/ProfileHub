import React, { useContext } from 'react';
import { admin as adminApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { FileText, Download, Table, PieChart, Users } from 'lucide-react';
import { StudentProfile } from '../../types';

const Reports: React.FC = () => {
  const { user } = useContext(AuthContext);

  const generateReport = async (type: string) => {
    try {
      const response = await adminApi.getStudents();
      const profiles: StudentProfile[] = response.data;
      
      let data: string[][] = [];
      let headers: string[] = [];
      let filename = '';

      if (type === 'MASTER') {
         headers = ["Roll No", "Name", "Department", "Year", "CGPA", "Phone", "Email"];
         data = profiles.map(p => [p.username, p.fullName, p.department, p.year, p.academic?.cgpa?.toString() || '0', p.phone, p.email]);
         filename = 'Master_Student_List.csv';
      } else if (type === 'ARREARS') {
         headers = ["Roll No", "Name", "Department", "Arrear Count"];
         data = profiles.filter(p => p.academic?.arrearCount > 0).map(p => [p.username, p.fullName, p.department, p.academic.arrearCount.toString()]);
         filename = 'Arrear_Students_Report.csv';
      } else if (type === 'FEES') {
         headers = ["Roll No", "Name", "Fees Due (INR)"];
         data = profiles.filter(p => p.academic?.feesDue > 0).map(p => [p.username, p.fullName, p.academic.feesDue.toString()]);
         filename = 'Fees_Due_Report.csv';
      } else if (type === 'PLACEMENT') {
         headers = ["Roll No", "Name", "Dept", "CGPA", "Placement FA %", "Status"];
         data = profiles.filter(p => (p.academic?.placementFaPercentage || 0) >= 75 && (p.academic?.cgpa || 0) >= 7.5 && (p.academic?.arrearCount || 0) === 0)
                        .map(p => [p.username, p.fullName, p.department, p.academic.cgpa.toString(), p.academic.placementFaPercentage.toString(), "Eligible"]);
         filename = 'Placement_Eligible_Report.csv';
      }

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...data.map(r => r.join(','))].join('\n');
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      
      // Log action via API if needed, but for now we just download
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate report', error);
      alert('Failed to generate report');
    }
  };

  const ReportCard = ({ title, desc, icon: Icon, type }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md dark:hover:shadow-none transition-shadow">
       <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg"><Icon size={24}/></div>
          <Button variant="outline" size="sm" onClick={() => generateReport(type)}><Download className="w-4 h-4 mr-2"/> Download</Button>
       </div>
       <h3 className="font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
       <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reports Center</h1>
          <p className="text-slate-500 dark:text-slate-400">Generate and export system-wide reports.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard title="Master Student List" desc="Complete database of all students with basic academic info." icon={Users} type="MASTER" />
          <ReportCard title="Arrear Report" desc="List of students with currently active arrears." icon={Table} type="ARREARS" />
          <ReportCard title="Placement Eligibility" desc="Students meeting FA > 75%, CGPA > 7.5 and no arrears." icon={PieChart} type="PLACEMENT" />
          <ReportCard title="Fees Dues List" desc="Students with outstanding fee payments." icon={FileText} type="FEES" />
       </div>
    </div>
  );
};

export default Reports;