import React from 'react';
import { Brain, Activity, AlertTriangle } from 'lucide-react';
import youthHeadInjuryImg from '../assets/images/youth_head_injury_1783610747013.jpg';

export function Science({ onNavigate }: { onNavigate: (tab: 'report' | 'dashboard') => void }) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 mt-6 animate-in fade-in duration-500">
      <div className="mb-12 text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight mb-4 text-[#212529]">
          The Science Behind TBIs
        </h2>
        <p className="text-lg text-[#495057] max-w-3xl leading-relaxed">
          Understanding the mechanisms of Traumatic Brain Injuries and the long-term risks associated with compounded trauma.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 text-[#212529] flex items-center gap-2">
            <Brain className="w-6 h-6 text-[#841617]" />
            How TBIs Occur
          </h3>
          <p className="text-[#495057] mb-4 leading-relaxed">
            A Traumatic Brain Injury (TBI) happens when a bump, blow, jolt, or penetrating injury to the head disrupts the normal function of the brain. In sports, this often occurs through high-impact collisions, falls, or rapid acceleration and deceleration of the head.
          </p>
          <p className="text-[#495057] leading-relaxed">
            The brain essentially sloshes inside the skull, causing bruising, torn tissues, and bleeding. Even sub-concussive impacts—blows to the head that do not immediately result in clinical concussion symptoms—can accumulate over time and cause significant neurological damage.
          </p>
        </div>
        <div className="flex flex-col w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-[#841617] mb-2">(15 Sec)</p>
          <div className="bg-[#E9ECEF] border-2 border-[#CED4DA] h-72 flex items-center justify-center rounded-sm overflow-hidden">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/taa0w06FOM0?si=4mVXuWUC4Csq8Qaw&end=15&controls=0&disablekb=1&rel=0" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="bg-[#212529] text-white p-8 sm:p-12 mb-16 rounded-sm shadow-md">
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-[#841617]" />
          The Danger of CTE & Compounded Injuries
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed text-lg">
          Chronic Traumatic Encephalopathy (CTE) is a progressive degenerative disease of the brain found in people with a history of repetitive brain trauma. 
        </p>
        <div className="bg-[#343A40] p-6 border-l-4 border-[#841617]">
          <p className="text-white font-medium text-lg leading-relaxed">
            Crucially, CTE is rarely caused by a single, isolated injury. It is driven by <strong className="text-white font-bold underline decoration-[#841617] decoration-2">compounded injuries</strong>—multiple concussive or sub-concussive impacts sustained in a short period of time.
          </p>
        </div>
        <p className="text-gray-300 mt-6 leading-relaxed">
          When athletes return to play before a concussion has fully healed, the brain remains highly vulnerable. A second impact during this window can trigger a cascade of metabolic events leading to severe swelling, profound neurological deficits, and a significantly higher risk of developing CTE later in life.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
        <div className="h-72 order-2 md:order-1 relative rounded-sm overflow-hidden border border-[#DEE2E6] shadow-sm">
          <img 
            src={youthHeadInjuryImg} 
            alt="Youth athlete in pain" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 text-[#212529] flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#841617]" />
            The Hidden Epidemic
          </h3>
          <p className="text-[#495057] mb-4 leading-relaxed">
            Despite the severe risks, concussions remain dangerously under-reported. Athletes often hide their symptoms out of fear of losing playing time, letting the team down, or due to a lack of understanding of the injury's actual severity.
          </p>
          <p className="text-[#495057] leading-relaxed">
            By continuing to play while injured, athletes unknowingly subject themselves to the exact repetitive trauma that leads to CTE. This is why <button onClick={() => onNavigate('report')} className="underline text-[#841617] hover:text-[#6a1112] transition-colors font-medium">accurate reporting</button>, removing the stigma, and cultural change are absolutely essential to safeguarding the future of athletes.
          </p>
        </div>
      </div>
    </div>
  );
}
