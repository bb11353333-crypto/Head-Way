/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ReportForm } from './components/ReportForm';
import { Dashboard } from './components/Dashboard';
import { Home as HomeView } from './components/Home';
import { Science } from './components/Science';
import { CTEImpact } from './components/CTEImpact';
import { FileText, BarChart3, Info, Home, Microscope, AlertCircle, Activity } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'science' | 'cte' | 'report' | 'dashboard'>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212529] font-sans flex flex-col w-full max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <header className="min-h-[80px] border-b border-[#DEE2E6] bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 sm:px-10 py-4 lg:py-0 flex-shrink-0 gap-4 lg:gap-0 w-full max-w-full overflow-hidden">
        <div 
          className="flex items-center gap-3 sm:gap-4 cursor-pointer hover:opacity-80 transition-opacity w-full max-w-full"
          onClick={() => setActiveTab('home')}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Shield_of_Brown_University.svg/960px-Shield_of_Brown_University.svg.png" 
            alt="Brown University Logo" 
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0" 
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-bold uppercase tracking-tight leading-none text-[#212529] break-words">Headway</h1>
            <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[#6C757D] leading-tight mt-0.5">Brown University Lab of Applied Mechanics</p>
          </div>
        </div>
        <nav className="flex gap-4 sm:gap-6 lg:gap-8 text-[10px] sm:text-xs font-semibold uppercase tracking-widest overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveTab('home')}
            className={cn(
              "flex items-center gap-2 pb-1 transition-all",
              activeTab === 'home' 
                ? "text-[#841617] border-b-2 border-[#841617]" 
                : "text-[#6C757D] hover:text-[#212529]"
            )}
          >
            <Home className="w-4 h-4 hidden sm:block" />
            <span>Our Mission</span>
          </button>
          <button
            onClick={() => setActiveTab('science')}
            className={cn(
              "flex items-center gap-2 pb-1 transition-all",
              activeTab === 'science' 
                ? "text-[#841617] border-b-2 border-[#841617]" 
                : "text-[#6C757D] hover:text-[#212529]"
            )}
          >
            <Microscope className="w-4 h-4 hidden sm:block" />
            <span>The Science</span>
          </button>
          <button
            onClick={() => setActiveTab('cte')}
            className={cn(
              "flex items-center gap-2 pb-1 transition-all",
              activeTab === 'cte' 
                ? "text-[#841617] border-b-2 border-[#841617]" 
                : "text-[#6C757D] hover:text-[#212529]"
            )}
          >
            <AlertCircle className="w-4 h-4 hidden sm:block" />
            <span>CTE Impact</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={cn(
              "flex items-center gap-2 pb-1 transition-all",
              activeTab === 'report' 
                ? "text-[#841617] border-b-2 border-[#841617]" 
                : "text-[#6C757D] hover:text-[#212529]"
            )}
          >
            <Activity className="w-4 h-4 hidden sm:block" />
            <span>Report & Test</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "flex items-center gap-2 pb-1 transition-all",
              activeTab === 'dashboard' 
                ? "text-[#841617] border-b-2 border-[#841617]" 
                : "text-[#6C757D] hover:text-[#212529]"
            )}
          >
            <BarChart3 className="w-4 h-4 hidden sm:block" />
            <span>Data Explorer</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex w-full">
        {activeTab === 'home' ? (
          <HomeView onNavigate={setActiveTab} />
        ) : activeTab === 'science' ? (
          <Science onNavigate={setActiveTab} />
        ) : activeTab === 'cte' ? (
          <CTEImpact onNavigate={setActiveTab} />
        ) : activeTab === 'report' ? (
          <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 mt-6">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-4 text-[#212529]">
                Help Us Change the Culture
              </h2>
              <p className="text-[#6C757D] text-sm leading-relaxed max-w-2xl mb-4">
                Too many athletes play through concussions due to pressure and culture. 
                By anonymously sharing your experience, you help build a data-driven case 
                for legislative action and better protection in sports.
              </p>
              <p className="text-[#212529] font-medium text-sm leading-relaxed max-w-2xl bg-[#E9ECEF] p-4 rounded-md border-l-4 border-[#841617]">
                Please complete the secure reporting form below. Following submission, you may participate in optional diagnostic tests designed to screen for alarming indicators of Traumatic Brain Injury (TBI), providing you with immediate, actionable insights into your cognitive and vestibular health.
              </p>
            </div>
            
            <div className="bg-white border border-[#DEE2E6] p-6 sm:p-8 shadow-sm">
              <ReportForm />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 mt-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-tight mb-2 text-[#212529]">
                TBI Repository Dashboard
              </h2>
              <p className="text-xs text-[#6C757D] uppercase tracking-widest">
                Aggregated, anonymized data on traumatic brain injuries in sports to reveal the true 
                scope of the problem.
              </p>
            </div>
            <Dashboard />
          </div>
        )}
      </main>
      
      <footer className="py-4 border-t border-[#DEE2E6] bg-white flex items-center justify-center px-4 sm:px-10 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-[#ADB5BD] flex-shrink-0 gap-2 flex-wrap">
        <Info className="w-3 h-3 shrink-0" />
        <span className="text-center">Built for the Brown University TBI Research Initiative. All data is completely anonymous.</span>
      </footer>
    </div>
  );
}
