import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { TBIReport } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Activity, Users, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

export function Dashboard() {
  const [reports, setReports] = useState<TBIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllReasons, setShowAllReasons] = useState(false);
  
  // Filters
  const [filterAge, setFilterAge] = useState("");
  const [filterSex, setFilterSex] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterSport, setFilterSport] = useState("");
  const [filterHasDescription, setFilterHasDescription] = useState("");

  useEffect(() => {
    const q = query(collection(db, "tbi_reports"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp to Date object if needed
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as TBIReport[];
      setReports(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reports:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#6C757D]">
        <div className="w-8 h-8 border-4 border-[#DEE2E6] border-t-[#841617] rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest font-bold">Loading repository data...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="py-20 text-center text-[#6C757D] border border-dashed border-[#DEE2E6] bg-white p-8">
        <Activity className="w-12 h-12 text-[#ADB5BD] mx-auto mb-3" />
        <p className="font-bold uppercase tracking-tight text-[#212529] mb-2">No reports yet</p>
        <p className="text-sm">Be the first to submit an anonymous report to start building the database.</p>
      </div>
    );
  }

  // Calculate statistics
  const totalReports = reports.length;
  const continuedPlayingCount = reports.filter(r => r.continuedPlaying).length;
  const continuedPercentage = Math.round((continuedPlayingCount / totalReports) * 100);
  
  const coachKnewButPlayed = reports.filter(r => r.coachKnew === "yes" && r.continuedPlaying).length;
  
  // Aggregate sports
  const sportCounts: Record<string, number> = {};
  reports.forEach(r => {
    sportCounts[r.sport] = (sportCounts[r.sport] || 0) + 1;
  });
  const sportData = Object.entries(sportCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 sports

  // Pie chart data for continued playing
  const playedData = [
    { name: "Kept Playing", value: continuedPlayingCount, color: "#841617" },
    { name: "Stopped", value: totalReports - continuedPlayingCount, color: "#212529" }
  ];

  // Aggregate symptoms
  const symptomCounts: Record<string, number> = {};
  reports.forEach(r => {
    if (r.symptoms && Array.isArray(r.symptoms)) {
      r.symptoms.forEach(sym => {
        const normalizedSym = sym.startsWith("Other:") ? "Other" : sym;
        symptomCounts[normalizedSym] = (symptomCounts[normalizedSym] || 0) + 1;
      });
    }
  });
  
  const symptomData = [
    { name: "Total Reports", value: totalReports },
    ...Object.entries(symptomCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  ];

  // Aggregate reasons not reported
  const reasonCounts: Record<string, number> = {};
  reports.forEach(r => {
    if (r.reasonNotReported && Array.isArray(r.reasonNotReported)) {
      r.reasonNotReported.forEach(reason => {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      });
    } else if (r.reasonNotReported && typeof r.reasonNotReported === "string") {
      reasonCounts[r.reasonNotReported as string] = (reasonCounts[r.reasonNotReported as string] || 0) + 1;
    }
  });

  const reasonData = Object.entries(reasonCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const displayedReasons = showAllReasons ? reasonData : reasonData.slice(0, 3);

  // Filter logic
  const DEFAULT_SPORTS = ["Hockey", "Football", "Soccer", "Rugby", "Lacrosse", "Basketball", "Wrestling", "Cheerleading"];
  
  const filteredReports = reports.filter(r => {
    if (filterAge && r.ageGroup !== filterAge) return false;
    if (filterSex && (!r.sex || r.sex !== filterSex)) return false;
    if (filterState && r.state !== filterState) return false;
    if (filterSport) {
      if (filterSport === "Other") {
        if (DEFAULT_SPORTS.includes(r.sport)) return false;
      } else {
        if (r.sport !== filterSport) return false;
      }
    }
    if (filterHasDescription === "yes" && !r.incidentDescription) return false;
    if (filterHasDescription === "no" && r.incidentDescription) return false;
    return true;
  });

  const availableAges = Array.from(new Set(reports.map(r => r.ageGroup).filter(Boolean))).sort();
  const availableSexes = ["Male", "Female", "Other"];
  const availableStates = Array.from(new Set(reports.map(r => r.state).filter(Boolean))).sort();
  const availableSports = [...DEFAULT_SPORTS, "Other"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DEE2E6] p-5 flex flex-col justify-center items-center shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D] mb-1">Total Reports</span>
          <span className="text-4xl font-light font-mono text-[#212529]">{totalReports}</span>
        </div>

        <div className="bg-white border border-[#DEE2E6] p-5 flex flex-col justify-center items-center shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D] mb-1">Played Through TBI</span>
          <span className="text-4xl font-light font-mono text-[#841617]">{continuedPercentage}%</span>
        </div>

        <div className="bg-white border border-[#DEE2E6] p-5 flex flex-col justify-center items-center shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C757D] mb-1">Coach Knew & Played</span>
          <span className="text-4xl font-light font-mono text-[#212529]">{coachKnewButPlayed}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sports Chart */}
        <div className="bg-white border border-[#DEE2E6] p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold uppercase tracking-tight text-[#212529]">Incident Distribution by Sport</h3>
            <p className="text-[10px] text-[#6C757D] uppercase tracking-widest mt-1">Top 5 Sports Reported</p>
          </div>
          <div className="flex-grow min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sportData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={90} 
                  tick={{ fill: '#495057', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}
                />
                <Tooltip 
                  cursor={{fill: '#F8F9FA'}} 
                  contentStyle={{borderRadius: '0', border: '1px solid #DEE2E6', boxShadow: 'none', backgroundColor: '#FFFFFF', fontSize: '12px', fontWeight: 'bold'}} 
                  itemStyle={{color: '#841617'}}
                />
                <Bar dataKey="value" radius={[0, 0, 0, 0]} fill="#841617">
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Culture Chart */}
        <div className="bg-white border border-[#DEE2E6] p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold uppercase tracking-tight text-[#212529]">Response to Injury</h3>
            <p className="text-[10px] text-[#6C757D] uppercase tracking-widest mt-1">Actions Taken Post-Incident</p>
          </div>
          <div className="flex-grow min-h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={playedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  stroke="none"
                  style={{fontSize: '10px', fontWeight: 'bold', fill: '#212529'}}
                >
                  {playedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '0', border: '1px solid #DEE2E6', boxShadow: 'none', backgroundColor: '#FFFFFF', fontSize: '12px'}} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Symptoms Chart */}
      <div className="bg-white border border-[#DEE2E6] p-6 shadow-sm flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-bold uppercase tracking-tight text-[#212529]">Reported Symptoms</h3>
          <p className="text-[10px] text-[#6C757D] uppercase tracking-widest mt-1">Frequency of symptoms compared to total reports</p>
        </div>
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={symptomData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={180} 
                tickFormatter={(val) => val.length > 28 ? val.substring(0, 28) + '...' : val}
                tick={{ fill: '#495057', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{fill: '#F8F9FA'}} 
                contentStyle={{borderRadius: '0', border: '1px solid #DEE2E6', boxShadow: 'none', backgroundColor: '#FFFFFF', fontSize: '12px', fontWeight: 'bold'}} 
                itemStyle={{color: '#841617'}}
              />
              <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                {symptomData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === "Total Reports" ? "#212529" : "#841617"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reasons Not Reported */}
      {reasonData.length > 0 && (
        <div className="bg-white border border-[#DEE2E6] shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#DEE2E6] bg-[#F8F9FA]">
            <h3 className="text-sm font-bold uppercase tracking-tight text-[#212529]">Why Symptoms Were Not Reported</h3>
          </div>
          <div className="divide-y divide-[#DEE2E6]">
            {displayedReasons.map((reason, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors">
                <span className="text-xs font-medium text-[#212529] max-w-[85%]">{reason.name}</span>
                <span className="text-lg font-light font-mono text-[#841617]">{reason.value}</span>
              </div>
            ))}
          </div>
          {reasonData.length > 3 && (
            <button 
              onClick={() => setShowAllReasons(!showAllReasons)}
              className="p-4 flex items-center justify-center gap-2 border-t border-[#DEE2E6] text-[10px] font-bold uppercase tracking-widest text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA] transition-colors"
            >
              {showAllReasons ? (
                <>Collapse <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>See All {reasonData.length} Reasons <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>
      )}

      {/* Recent Log */}
      <div className="bg-white border border-[#DEE2E6] shadow-sm flex flex-col">
        <div className="p-5 border-b border-[#DEE2E6] bg-[#F8F9FA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-sm font-bold uppercase tracking-tight text-[#212529]">Recent Anonymous Logs</h3>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select 
              value={filterSport} 
              onChange={e => setFilterSport(e.target.value)}
              className="h-8 rounded-none border border-[#CED4DA] bg-white px-2 text-[10px] uppercase font-bold text-[#495057] outline-none focus:border-[#841617]"
            >
              <option value="">All Sports</option>
              {availableSports.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select 
              value={filterState} 
              onChange={e => setFilterState(e.target.value)}
              className="h-8 rounded-none border border-[#CED4DA] bg-white px-2 text-[10px] uppercase font-bold text-[#495057] outline-none focus:border-[#841617]"
            >
              <option value="">All States</option>
              {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select 
              value={filterAge} 
              onChange={e => setFilterAge(e.target.value)}
              className="h-8 rounded-none border border-[#CED4DA] bg-white px-2 text-[10px] uppercase font-bold text-[#495057] outline-none focus:border-[#841617]"
            >
              <option value="">All Ages</option>
              {availableAges.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select 
              value={filterSex} 
              onChange={e => setFilterSex(e.target.value)}
              className="h-8 rounded-none border border-[#CED4DA] bg-white px-2 text-[10px] uppercase font-bold text-[#495057] outline-none focus:border-[#841617]"
            >
              <option value="">All Sexes</option>
              {availableSexes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select 
              value={filterHasDescription} 
              onChange={e => setFilterHasDescription(e.target.value)}
              className="h-8 rounded-none border border-[#CED4DA] bg-white px-2 text-[10px] uppercase font-bold text-[#495057] outline-none focus:border-[#841617]"
            >
              <option value="">All Responses</option>
              <option value="yes">Has Written Response</option>
              <option value="no">No Written Response</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-[#DEE2E6] max-h-96 overflow-y-auto">
          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-[#6C757D] text-xs font-bold uppercase tracking-widest">
              No reports match your filters
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="p-5 hover:bg-[#F8F9FA] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block bg-[#212529] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                      {report.sport}
                    </span>
                    <span className="text-xs font-bold uppercase text-[#495057]">{report.state}</span>
                    {report.ageGroup && <span className="text-[10px] font-bold uppercase text-[#6C757D] border border-[#DEE2E6] px-1.5 py-0.5">{report.ageGroup}</span>}
                    {report.sex && <span className="text-[10px] font-bold uppercase text-[#6C757D] border border-[#DEE2E6] px-1.5 py-0.5">{report.sex}</span>}
                  </div>
                  <span className="text-[10px] font-mono text-[#ADB5BD]">
                    {report.timestamp instanceof Date ? report.timestamp.toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <div className="mt-4">
                  {report.incidentDescription && (
                    <div className="mb-3 bg-white border border-[#DEE2E6] p-3">
                      <span className="block font-bold uppercase tracking-widest text-[#6C757D] text-[10px] mb-1">Incident Description</span>
                      <p className="text-xs text-[#212529] italic leading-relaxed">"{report.incidentDescription}"</p>
                    </div>
                  )}
                  <p className="text-xs text-[#212529] mb-3 leading-relaxed">
                    <span className="font-bold uppercase tracking-widest text-[#6C757D] text-[10px] mr-2">Symptoms</span> 
                    {report.symptoms.join(", ")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest mt-4 border-t border-[#DEE2E6] pt-3">
                    <span className={cn(
                      "flex items-center gap-1.5",
                      report.continuedPlaying ? "text-[#841617]" : "text-[#495057]"
                    )}>
                      <div className={cn("w-2 h-2 rounded-none", report.continuedPlaying ? "bg-[#841617]" : "bg-[#ADB5BD]")} />
                      {report.continuedPlaying ? "Kept Playing" : "Stopped Playing"}
                    </span>
                    <span className="text-[#DEE2E6]">|</span>
                    <span className="text-[#6C757D]">
                      Coach Knew: <span className="text-[#212529]">{report.coachKnew}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
