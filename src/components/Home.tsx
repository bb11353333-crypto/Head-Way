import React from 'react';
import { FileText, ArrowRight, Heart, Shield, Users, Activity } from 'lucide-react';
import { LiveNationalDashboard } from './LiveNationalDashboard';

interface HomeProps {
  onNavigate: (tab: 'report' | 'dashboard') => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto min-h-[500px] md:min-h-[600px] py-16 flex items-center justify-center overflow-hidden bg-[#212529]">
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop" 
            alt="Athletes supporting each other" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white mb-6 leading-tight">
            Athletes protecting athletes.
          </h1>
          <div className="text-lg md:text-xl text-gray-300 font-medium mb-10 max-w-3xl mx-auto leading-relaxed flex flex-col gap-6">
            <p>
              Headway is an anonymous reporting tool and symptom tracker designed to help athletes safely log suspected concussions and check their cognitive health.
            </p>
            <p className="text-sm sm:text-base uppercase tracking-widest text-white font-bold bg-[#841617]/80 backdrop-blur-md p-6 border border-[#841617]">
              By sharing your anonymous report, you unlock insights into your brain health while helping us build a data-driven case for better protection in sports.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <button 
              onClick={() => onNavigate('report')}
              className="bg-[#841617] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#6a1112] transition-colors flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" /> Report & Test for Symptoms
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#212529] transition-colors flex items-center justify-center gap-2"
            >
              View the Impact
            </button>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto pt-16 px-6">
        <LiveNationalDashboard onNavigate={onNavigate} />
      </section>

      {/* Reaction Time Test Promo */}
      <section className="w-full bg-[#841617] text-white my-12 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6 text-center md:text-left flex-col md:flex-row">
            <Activity className="w-10 h-10 opacity-90 shrink-0" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight mb-2">
                Check Your Reaction Speed
              </h2>
              <p className="text-sm text-white/80 max-w-xl leading-relaxed">
                Concussions can lower reaction speed. Report an incident to unlock our reaction test and see how your speed compares to your peers.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('report')}
            className="bg-white text-[#841617] px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            Unlock the Test <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Mission / Empathy Section */}
      <section className="w-full max-w-5xl mx-auto py-20 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold uppercase tracking-tight text-[#212529]">
              You are not alone.
            </h2>
            <div className="w-12 h-1 bg-[#841617]"></div>
            <p className="text-[#495057] leading-relaxed text-lg">
              Every year, thousands of athletes experience traumatic brain injuries (TBIs). 
              Yet, the fear of letting down the team, losing a starting spot, or looking weak 
              forces many to hide their symptoms. 
            </p>
            <p className="text-[#495057] leading-relaxed text-lg">
              <strong className="text-[#212529]">This is where the culture shifts.</strong> <button onClick={() => onNavigate('report')} className="underline text-[#841617] hover:text-[#6a1112] transition-colors font-medium">By anonymously sharing your experience</button>, you stand in solidarity with athletes everywhere. Your story validates others and proves that taking care of your brain is the ultimate sign of strength.
            </p>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[#841617] my-6">
              Together Let's Head-way into a safer world for athletes.
            </p>
          </div>
          <div className="relative h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2029&auto=format&fit=crop" 
              alt="Team huddle" 
              className="w-full h-full object-cover shadow-lg border border-[#DEE2E6]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Pillars of Change */}
      <section className="w-full bg-[#E9ECEF] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[#212529] mb-12">
            Why Your Voice Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#DEE2E6] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F8F9FA] flex items-center justify-center rounded-full mb-6 border border-[#DEE2E6]">
                <Heart className="w-8 h-8 text-[#841617]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#212529] mb-3">Community Support</h3>
              <p className="text-[#6C757D] text-sm leading-relaxed">
                Show others they aren't the only ones facing these challenges. Anonymity provides a safe space to be honest about the pressure.
              </p>
            </div>
            <div className="bg-white p-8 border border-[#DEE2E6] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F8F9FA] flex items-center justify-center rounded-full mb-6 border border-[#DEE2E6]">
                <Shield className="w-8 h-8 text-[#841617]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#212529] mb-3">Safer Guidelines</h3>
              <p className="text-[#6C757D] text-sm leading-relaxed">
                Real-world data is the most powerful tool we have to advocate for better concussion protocols and safer return-to-play policies.
              </p>
            </div>
            <div className="bg-white p-8 border border-[#DEE2E6] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F8F9FA] flex items-center justify-center rounded-full mb-6 border border-[#DEE2E6]">
                <Users className="w-8 h-8 text-[#841617]" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#212529] mb-3">Culture Shift</h3>
              <p className="text-[#6C757D] text-sm leading-relaxed">
                Together, we are transforming the narrative from "toughing it out" to prioritizing long-term health and well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-4xl mx-auto py-24 px-6 text-center">
        <h2 className="text-3xl font-bold uppercase tracking-tight text-[#212529] mb-6">
          Check Your Brain Health. Protect Your Peers.
        </h2>
        <p className="text-[#495057] leading-relaxed text-lg mb-10 max-w-2xl mx-auto">
          Whether your injury happened yesterday or years ago, your experience is invaluable. 
          Help us build the most comprehensive, athlete-driven repository of concussion data, and unlock insights into your own reaction speed.
        </p>
        <button 
          onClick={() => onNavigate('report')}
          className="bg-[#212529] text-white px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-[#343A40] transition-colors inline-flex items-center gap-3"
        >
          <Activity className="w-5 h-5" /> Take the Reaction Test
        </button>
      </section>

    </div>
  );
}
