import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { cn } from "../lib/utils";
import { ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { ReactionTimeTest } from "./ReactionTimeTest";
import { VestibularTest } from "./VestibularTest";

const SPORTS = [
  "Hockey", "Football", "Soccer", "Rugby", "Lacrosse", 
  "Basketball", "Wrestling", "Cheerleading", "Other"
];

const SYMPTOMS_LIST = [
  "Headache", "Dizziness", "Nausea", "Sensitivity to Light", 
  "Sensitivity to Noise", "Confusion", "Memory Loss", 
  "Fatigue", "Ringing in Ears"
];

const AGE_GROUPS = ["Under 12", "13-17", "18-22", "23-30", "31+"];

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const REASONS_NOT_REPORTED = [
  "I did not think the injury was serious enough to report",
  "I thought the symptoms would go away on their own",
  "I was unsure whether it was a concussion or head injury",
  "I did not want to make a big deal out of it",
  "I was worried about being viewed as weak or less committed",
  "I did not want to miss a game, practice, or competition",
  "I wanted to continue helping my team",
  "I was worried about losing my starting position or role on the team",
  "I was concerned about consequences for future opportunities (such as recruitment or scholarships)",
  "I was worried about disappointing my teammates",
  "I felt pressure from coaches or team staff to continue playing",
  "I felt pressure from teammates to continue playing",
  "I thought others expected me to keep playing",
  "I did not know who I should report it to",
  "I did not know the symptoms could be related to a head injury",
  "There was no athletic trainer, medical professional, or trusted adult available",
  "I was afraid I would not be allowed to return to play",
  "Other"
];

export function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [sport, setSport] = useState("");
  const [otherSport, setOtherSport] = useState("");
  const [position, setPosition] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState("");
  const [continuedPlaying, setContinuedPlaying] = useState<boolean | null>(null);
  const [coachKnew, setCoachKnew] = useState<"yes" | "no" | "unsure" | "">("");
  const [reasonsNotReported, setReasonsNotReported] = useState<string[]>([]);
  const [otherReasonNotReported, setOtherReasonNotReported] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [sex, setSex] = useState("");
  const [state, setState] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);

  const toggleSymptom = (sym: string) => {
    setSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const toggleReasonNotReported = (reason: string) => {
    setReasonsNotReported(prev => 
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sport || symptoms.length === 0 || continuedPlaying === null || !coachKnew || !ageGroup || !sex || !state || ((coachKnew === "no" || coachKnew === "unsure") && reasonsNotReported.length === 0)) {
      alert("Please fill out all required fields.");
      return;
    }

    setShowCaptcha(true);
  };

  const processSubmission = async (token: string | null) => {
    if (!token) return;
    setShowCaptcha(false);
    setIsSubmitting(true);
    try {
      const finalSymptoms = [...symptoms];
      if (finalSymptoms.includes("Other") && otherSymptom) {
        finalSymptoms[finalSymptoms.indexOf("Other")] = `Other: ${otherSymptom}`;
      }

      const finalReasons = [...reasonsNotReported];
      if (finalReasons.includes("Other") && otherReasonNotReported) {
        finalReasons[finalReasons.indexOf("Other")] = `Other: ${otherReasonNotReported}`;
      }

      await addDoc(collection(db, "tbi_reports"), {
        sport: sport === "Other" ? otherSport : sport,
        position,
        symptoms: finalSymptoms,
        continuedPlaying,
        coachKnew,
        reasonNotReported: (coachKnew === "no" || coachKnew === "unsure") ? finalReasons : [],
        ageGroup,
        sex,
        state,
        incidentDescription,
        timestamp: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <CheckCircle2 className="w-16 h-16 text-[#841617] mb-6" />
        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#212529] mb-3">Report Submitted Anonymously</h2>
        <p className="text-sm text-[#6C757D] max-w-md mx-auto mb-8 leading-relaxed">
          Thank you for sharing your experience. Your data helps build a clearer picture of traumatic brain injuries in sports, moving us closer to meaningful legislative change.
        </p>
        <button 
          onClick={() => {
            setIsSuccess(false);
            setSport("");
            setOtherSport("");
            setPosition("");
            setSymptoms([]);
            setOtherSymptom("");
            setContinuedPlaying(null);
            setCoachKnew("");
            setReasonsNotReported([]);
            setOtherReasonNotReported("");
            setAgeGroup("");
            setSex("");
            setState("");
            setIncidentDescription("");
          }}
          className="bg-[#212529] text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#343A40] transition-colors"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-[#F8F9FA] border border-[#DEE2E6] p-5 flex items-start gap-4 shadow-sm">
        <ShieldAlert className="w-6 h-6 text-[#841617] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-[#495057] mb-1">100% Anonymous Reporting</h3>
          <p className="text-[#6C757D] text-xs leading-relaxed">
            Your identity is never collected or stored. This repository exists to highlight the true frequency of TBIs and concussions in sports when athletes feel pressured to play through the pain. Contributing is very quick and takes only minutes.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold uppercase tracking-tight border-b border-[#DEE2E6] pb-2 text-[#212529]">Incident Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#495057]">Sport *</label>
            <select 
              value={sport} 
              onChange={e => setSport(e.target.value)}
              className="w-full h-10 rounded-none border border-[#CED4DA] bg-[#F8F9FA] px-3 text-sm text-[#212529] outline-none focus:border-[#841617]"
            >
              <option value="">Select sport...</option>
              {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          {sport === "Other" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-[#495057]">Specify Sport *</label>
              <input 
                type="text" 
                value={otherSport}
                onChange={e => setOtherSport(e.target.value)}
                className="w-full h-10 rounded-none border border-[#CED4DA] bg-[#F8F9FA] px-3 text-sm text-[#212529] outline-none focus:border-[#841617]"
                placeholder="E.g., Gymnastics"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#495057]">Position (Optional)</label>
            <input 
              type="text" 
              value={position}
              onChange={e => setPosition(e.target.value)}
              className="w-full h-10 rounded-none border border-[#CED4DA] bg-[#F8F9FA] px-3 text-sm text-[#212529] outline-none focus:border-[#841617]"
              placeholder="E.g., Goalie, Linebacker"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#495057]">Age Group *</label>
            <select 
              value={ageGroup} 
              onChange={e => setAgeGroup(e.target.value)}
              className="w-full h-10 rounded-none border border-[#CED4DA] bg-[#F8F9FA] px-3 text-sm text-[#212529] outline-none focus:border-[#841617]"
            >
              <option value="">Select age...</option>
              {AGE_GROUPS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#495057]">Sex *</label>
            <select 
              value={sex} 
              onChange={e => setSex(e.target.value)}
              className="w-full h-10 rounded-none border border-[#CED4DA] bg-[#F8F9FA] px-3 text-sm text-[#212529] outline-none focus:border-[#841617]"
            >
              <option value="">Select sex...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#495057]">US State *</label>
            <select 
              value={state} 
              onChange={e => setState(e.target.value)}
              className="w-full h-10 rounded-none border border-[#CED4DA] bg-[#F8F9FA] px-3 text-sm text-[#212529] outline-none focus:border-[#841617]"
            >
              <option value="">Select state...</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold uppercase tracking-tight border-b border-[#DEE2E6] pb-2 text-[#212529]">Symptoms Experienced *</h3>
        <p className="text-[10px] uppercase tracking-widest text-[#6C757D]">Select all that apply at the time of the incident.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {[...SYMPTOMS_LIST, "Other"].map(sym => (
            <label key={sym} className={cn(
              "flex items-center gap-3 border border-[#DEE2E6] p-3 bg-white cursor-pointer transition-colors",
              symptoms.includes(sym) ? "border-[#841617]" : "hover:border-[#ADB5BD]"
            )}>
              <div className={cn("w-3 h-3 flex-shrink-0 transition-colors", symptoms.includes(sym) ? "bg-[#841617]" : "bg-[#F8F9FA] border border-[#DEE2E6]")}></div>
              <input 
                type="checkbox" 
                checked={symptoms.includes(sym)}
                onChange={() => toggleSymptom(sym)}
                className="hidden"
              />
              <span className="font-medium text-[#212529]">{sym}</span>
            </label>
          ))}
        </div>
        {symptoms.includes("Other") && (
          <div className="space-y-1 mt-3">
            <label className="text-[10px] font-bold uppercase text-[#495057]">Specify Other Symptom(s)</label>
            <input 
              type="text" 
              value={otherSymptom}
              onChange={e => setOtherSymptom(e.target.value)}
              className="w-full h-10 rounded-none border border-[#CED4DA] bg-[#F8F9FA] px-3 text-sm text-[#212529] outline-none focus:border-[#841617]"
              placeholder="Please specify"
            />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold uppercase tracking-tight border-b border-[#DEE2E6] pb-2 text-[#212529]">Culture & Response</h3>
        
        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase text-[#495057]">Did the athlete continue playing after the head impact? *</label>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => setContinuedPlaying(true)}
              className={cn(
                "flex-1 py-4 px-4 border font-bold uppercase tracking-widest text-[10px] transition-colors",
                continuedPlaying === true ? "bg-[#212529] text-white border-[#212529]" : "bg-white text-[#495057] hover:bg-[#F8F9FA] border-[#DEE2E6]"
              )}
            >
              Yes, continued
            </button>
            <button 
              type="button"
              onClick={() => setContinuedPlaying(false)}
              className={cn(
                "flex-1 py-4 px-4 border font-bold uppercase tracking-widest text-[10px] transition-colors",
                continuedPlaying === false ? "bg-[#212529] text-white border-[#212529]" : "bg-white text-[#495057] hover:bg-[#F8F9FA] border-[#DEE2E6]"
              )}
            >
              No, stopped
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase text-[#495057]">Was the coach aware of the impact or symptoms? *</label>
          <div className="grid grid-cols-3 gap-4">
            {(["yes", "no", "unsure"] as const).map(opt => (
              <button 
                key={opt}
                type="button"
                onClick={() => {
                  setCoachKnew(opt);
                  if (opt === "yes") {
                    setReasonsNotReported([]);
                    setOtherReasonNotReported("");
                  }
                }}
                className={cn(
                  "py-4 px-2 sm:px-4 border font-bold uppercase tracking-widest text-[10px] transition-colors",
                  coachKnew === opt ? "bg-[#212529] text-white border-[#212529]" : "bg-white text-[#495057] hover:bg-[#F8F9FA] border-[#DEE2E6]"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        
        {(coachKnew === "no" || coachKnew === "unsure") && (
          <div className="space-y-3 pt-4 border-t border-[#DEE2E6]">
            <label className="block text-[10px] font-bold uppercase text-[#495057]">Why didn't you tell anyone? *</label>
            <div className="flex flex-col gap-2">
              {REASONS_NOT_REPORTED.map(reason => (
                <label key={reason} className={cn(
                  "flex items-start gap-3 border border-[#DEE2E6] p-3 bg-white cursor-pointer transition-colors",
                  reasonsNotReported.includes(reason) ? "border-[#841617]" : "hover:border-[#ADB5BD]"
                )}>
                  <div className={cn("w-3 h-3 mt-0.5 flex-shrink-0 transition-colors", reasonsNotReported.includes(reason) ? "bg-[#841617]" : "bg-[#F8F9FA] border border-[#DEE2E6]")}></div>
                  <input 
                    type="checkbox" 
                    checked={reasonsNotReported.includes(reason)}
                    onChange={() => toggleReasonNotReported(reason)}
                    className="hidden"
                  />
                  <span className="text-xs font-medium text-[#212529]">{reason}</span>
                </label>
              ))}
            </div>
            {reasonsNotReported.includes("Other") && (
              <div className="space-y-1 mt-3">
                <label className="text-[10px] font-bold uppercase text-[#495057]">Specify Other Reason *</label>
                <input 
                  type="text" 
                  value={otherReasonNotReported}
                  onChange={e => setOtherReasonNotReported(e.target.value)}
                  className="w-full h-10 rounded-none border border-[#CED4DA] bg-[#F8F9FA] px-3 text-sm text-[#212529] outline-none focus:border-[#841617]"
                  placeholder="Please specify"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold uppercase tracking-tight border-b border-[#DEE2E6] pb-2 text-[#212529]">Incident Description</h3>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-[#495057]">Please describe what happened and how you got hurt (Optional)</label>
          <textarea 
            value={incidentDescription}
            onChange={e => setIncidentDescription(e.target.value)}
            className="w-full min-h-[100px] rounded-none border border-[#CED4DA] bg-[#F8F9FA] p-3 text-sm text-[#212529] outline-none focus:border-[#841617] resize-y"
            placeholder="E.g., I collided with another player and hit my head on the ground..."
          />
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-[#DEE2E6]">
        <h3 className="text-lg font-bold uppercase tracking-tight text-[#212529] mb-2 text-center">Bonus: Check Your Brain Health</h3>
        <p className="text-sm text-[#6C757D] mb-4 text-center">Concussions can lower reaction speed and vestibular balance. Test yours below (Requires Age and Sex to be filled above).</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReactionTimeTest ageGroup={ageGroup} sex={sex} />
          <VestibularTest />
        </div>
      </div>

      <div className="pt-6 border-t border-[#DEE2E6]">
        {showCaptcha ? (
          <div className="bg-white p-6 border border-[#DEE2E6] flex flex-col items-center animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-tight text-[#212529] mb-4 text-center">Security Check</h3>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
              onChange={(token) => processSubmission(token)}
            />
            <button 
              type="button"
              onClick={() => setShowCaptcha(false)}
              className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#841617] hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#212529] text-white py-4 font-bold uppercase tracking-widest text-xs mt-2 hover:bg-[#343A40] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Submit Anonymous Report
          </button>
        )}
      </div>
    </form>
    </>
  );
}
