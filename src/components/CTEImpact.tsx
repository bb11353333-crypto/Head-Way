import React from 'react';
import { AlertCircle, FileVideo, BookOpen, BrainCircuit } from 'lucide-react';

export function CTEImpact({ onNavigate }: { onNavigate: (tab: 'report' | 'dashboard') => void }) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 mt-6 animate-in fade-in duration-500">
      <div className="mb-12 text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight mb-4 text-[#212529]">
          The Reality of CTE
        </h2>
        <p className="text-lg text-[#495057] max-w-3xl leading-relaxed">
          Behind the statistics are real athletes facing life-altering consequences. Chronic Traumatic Encephalopathy (CTE) is not just a medical term; it is a devastating reality that strips away cognitive function and quality of life.
        </p>
      </div>

      {/* Youth Sports Impact */}
      <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
        <div className="bg-[#E9ECEF] border-2 border-[#CED4DA] aspect-video flex flex-col items-center justify-center rounded-sm relative overflow-hidden">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/qIX3lhWc01k?si=HM8TQZnhYjpoNSVz" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 text-[#212529] flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#841617]" />
            Where It Begins
          </h3>
          <p className="text-[#495057] mb-4 leading-relaxed">
            As the footage illustrates, high-impact collisions and rapid head decelerations are a frequent, inherent risk across all contact sports—from football and hockey to soccer and lacrosse. These intense moments often occur in the blink of an eye and frequently go unaddressed in the heat of competition.
          </p>
          <p className="text-[#495057] leading-relaxed">
            The foundation for CTE is often laid long before athletes reach the professional level. Youth sports collisions, especially when players are rushed back onto the field without proper recovery, expose developing brains to severe repetitive trauma.
          </p>
        </div>
      </div>

      {/* The Human Cost */}
      <div className="mb-20">
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-8 text-center text-[#212529]">
          The Human Cost of Repetitive Trauma
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-[#DEE2E6] p-6 shadow-sm flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-[#841617] mb-2">(32 Sec)</p>
            <div className="bg-[#E9ECEF] border-2 border-[#CED4DA] aspect-video flex flex-col items-center justify-center rounded-sm mb-6 overflow-hidden">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/SedClkAnclk?start=958&end=990&controls=0&disablekb=1&rel=0" 
                title="PBS Frontline CTE" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>
            <h4 className="font-bold uppercase tracking-tight text-[#212529] mb-3">Cognitive Decline & Memory Loss</h4>
            <p className="text-[#6C757D] text-sm leading-relaxed">
              Former athletes often experience profound struggles with short-term memory, executive function, and the ability to organize thoughts. What begins as forgetfulness can rapidly progress to severe dementia.
            </p>
          </div>
          <div className="bg-white border border-[#DEE2E6] p-6 shadow-sm flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-[#841617] mb-2">(8 Sec)</p>
            <div className="bg-[#E9ECEF] border-2 border-[#CED4DA] aspect-video flex flex-col items-center justify-center rounded-sm mb-6 overflow-hidden">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/sbLzejquVGg?end=8&mute=1&controls=0&disablekb=1&rel=0" 
                title="YouTube shorts video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>
            <h4 className="font-bold uppercase tracking-tight text-[#212529] mb-3">Motor Impairment & Speech</h4>
            <p className="text-[#6C757D] text-sm leading-relaxed">
              As the Tau protein spreads through the brain, it attacks areas controlling motor skills. This manifests as slurred speech, tremors, and a loss of physical coordination, stripping athletes of their independence.
            </p>
          </div>
        </div>
      </div>

      {/* Research & Our Purpose */}
      <div className="bg-[#212529] text-white p-8 sm:p-12 mb-12 rounded-sm shadow-md">
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-[#841617]" />
          The Research Connecting Our Purpose
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed text-lg">
          Clinical studies from institutions like the Boston University CTE Center have confirmed that CTE is directly linked to <strong className="text-white font-bold">repetitive head impacts (RHI)</strong>. It is not necessarily the major, knockout concussions that cause the most damage, but rather the accumulation of hundreds or thousands of "minor" sub-concussive hits.
        </p>
        <p className="text-gray-300 mb-6 leading-relaxed">
          This is exactly why this platform exists. The culture of "toughing it out" directly feeds the cycle of repetitive trauma. When symptoms are hidden and players stay in the game, their brains are repeatedly subjected to impact while already in a vulnerable state. 
        </p>
        <div className="bg-[#343A40] p-6 border-l-4 border-[#841617]">
          <p className="text-white font-medium text-lg leading-relaxed">
            <button onClick={() => onNavigate('report')} className="underline decoration-[#841617] decoration-2 hover:text-gray-300 transition-colors">By reporting symptoms anonymously</button>, we are gathering critical data on the <span className="italic">hidden</span> impacts. This research is vital to proving the true frequency of these injuries, changing return-to-play protocols, and ultimately breaking the cycle that leads to CTE.
          </p>
        </div>
      </div>

    </div>
  );
}
