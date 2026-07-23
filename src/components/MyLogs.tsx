import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, FileText, Download } from 'lucide-react';
import { TBIReport } from '../types';

export function MyLogs() {
  const [reports, setReports] = useState<TBIReport[]>([]);

  useEffect(() => {
    const savedReports = localStorage.getItem('headway_reports');
    if (savedReports) {
      try {
        const parsed = JSON.parse(savedReports);
        // Sort by timestamp descending
        parsed.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setReports(parsed);
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  const chartData = [...reports].reverse().map((report, idx) => ({
    date: new Date(report.timestamp).toLocaleDateString(),
    symptoms: report.symptoms?.length || 0,
    index: idx + 1
  }));

  const downloadReport = (report: TBIReport) => {
    // Basic CSV download or text file
    const content = `Headway Report Export\nDate: ${new Date(report.timestamp).toLocaleString()}\nSport: ${report.sport}\nSymptoms: ${report.symptoms?.join(', ')}\nContinued Playing: ${report.continuedPlaying ? 'Yes' : 'No'}\nReported to Coach: ${report.coachKnew}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Headway_Report_${new Date(report.timestamp).toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 mt-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-2 text-[#212529]">My Personal Logs</h2>
        <p className="text-xs text-[#6C757D] uppercase tracking-widest">
          View your past reports and track your symptom trends. Stored locally on your device.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-[#DEE2E6] p-10 text-center flex flex-col items-center">
          <Calendar className="w-12 h-12 text-[#ADB5BD] mb-4" />
          <h3 className="font-bold uppercase tracking-tight text-[#212529] mb-2">No Reports Found</h3>
          <p className="text-sm text-[#6C757D]">You haven't logged any suspected concussions or symptoms yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="bg-white border border-[#DEE2E6] p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#212529] mb-6">Symptom Severity Trend</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DEE2E6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C757D' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6C757D' }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#212529', border: 'none', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="symptoms" name="Symptom Count" stroke="#841617" strokeWidth={3} dot={{ r: 4, fill: '#841617' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#212529] mb-4">Past Reports</h3>
            <div className="flex flex-col gap-3">
              {reports.map((report, idx) => (
                <div key={idx} className="bg-white border border-[#DEE2E6] p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-[#841617] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#E9ECEF] p-2 rounded-sm shrink-0">
                      <FileText className="w-5 h-5 text-[#6C757D]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-tight text-[#212529]">{report.sport || 'Unknown Sport'}</h4>
                      <p className="text-xs text-[#6C757D]">{new Date(report.timestamp).toLocaleDateString()} at {new Date(report.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {report.symptoms?.slice(0, 3).map((sym, sIdx) => (
                          <span key={sIdx} className="bg-[#F8F9FA] border border-[#DEE2E6] text-[9px] uppercase tracking-wider px-2 py-1 font-bold text-[#6C757D]">
                            {sym}
                          </span>
                        ))}
                        {(report.symptoms?.length || 0) > 3 && (
                          <span className="bg-[#F8F9FA] border border-[#DEE2E6] text-[9px] uppercase tracking-wider px-2 py-1 font-bold text-[#6C757D]">
                            +{(report.symptoms?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => downloadReport(report)}
                    className="flex items-center justify-center gap-2 border border-[#DEE2E6] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#212529] hover:bg-[#F8F9FA] transition-colors self-start sm:self-center"
                  >
                    <Download className="w-3 h-3" /> Export
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
