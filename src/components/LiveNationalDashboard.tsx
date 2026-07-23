import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { TBIReport } from "../types";

export function LiveNationalDashboard({ onNavigate }: { onNavigate?: (tab: 'report' | 'dashboard') => void }) {
  const [stats, setStats] = useState({
    reports: 0,
    states: 0,
    sports: 0,
    returnedPercentage: 0,
    reportedPercentage: 0,
  });

  useEffect(() => {
    const q = query(collection(db, "tbi_reports"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as TBIReport);
      
      const uniqueStates = new Set(data.map(r => r.state).filter(Boolean));
      const uniqueSports = new Set(data.map(r => r.sport).filter(Boolean));
      
      const totalReports = data.length;
      const continuedPlayingCount = data.filter(r => r.continuedPlaying).length;
      const reportedToCoachCount = data.filter(r => r.coachKnew === "yes").length;
      
      setStats({
        reports: totalReports,
        states: uniqueStates.size,
        sports: uniqueSports.size,
        returnedPercentage: totalReports > 0 ? Math.round((continuedPlayingCount / totalReports) * 100) : 0,
        reportedPercentage: totalReports > 0 ? Math.round((reportedToCoachCount / totalReports) * 100) : 0,
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div 
      onClick={() => onNavigate && onNavigate('report')}
      className={`bg-white border border-[#DEE2E6] p-6 shadow-sm flex flex-col gap-4 ${onNavigate ? 'cursor-pointer hover:border-[#841617] hover:shadow-md transition-all' : ''}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold uppercase tracking-tight text-[#212529]">Live National Dashboard for College and Youth Sports</h3>
        {onNavigate && <span className="text-xs font-bold uppercase tracking-widest text-[#841617]">Add to the Data &rarr;</span>}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D]">Reports</span>
          <span className="text-3xl font-light font-mono text-[#212529]">{stats.reports}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D]">States</span>
          <span className="text-3xl font-light font-mono text-[#212529]">{stats.states}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D]">Sports</span>
          <span className="text-3xl font-light font-mono text-[#212529]">{stats.sports}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D]">Returned to Play</span>
          <span className="text-3xl font-light font-mono text-[#841617]">{stats.returnedPercentage}%</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D]">Told Coach</span>
          <span className="text-3xl font-light font-mono text-[#841617]">{stats.reportedPercentage}%</span>
        </div>
      </div>
    </div>
  );
}
