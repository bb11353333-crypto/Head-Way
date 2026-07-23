import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';
import { Activity, X } from 'lucide-react';

interface Props {
  ageGroup: string;
  sex: string;
}

const getExpectedAverage = (ageGroup: string, sex: string) => {
  let base = 250;
  if (ageGroup === "Under 12") base = 300;
  else if (ageGroup === "13-17") base = 260;
  else if (ageGroup === "18-22") base = 230;
  else if (ageGroup === "23-30") base = 240;
  else if (ageGroup === "31+") base = 270;

  if (sex === "Female") base += 20;
  if (sex === "Other") base += 10;
  return base;
};

export function ReactionTimeTest({ ageGroup, sex }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [testStatus, setTestStatus] = useState<'idle' | 'waiting' | 'ready'>('idle');
  const [results, setResults] = useState<number[]>([]);
  const [earlyClick, setEarlyClick] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleOpen = () => {
    if (!ageGroup || !sex) {
      alert("Please select your Age Group and Sex in the form above first.");
      return;
    }
    setIsOpen(true);
    setStep('intro');
    setResults([]);
    setTestStatus('idle');
    setEarlyClick(false);
  };

  const startTrial = useCallback(() => {
    setTestStatus('waiting');
    setEarlyClick(false);
    const delay = Math.random() * 2000 + 1500; // 1.5s to 3.5s
    timeoutRef.current = setTimeout(() => {
      setTestStatus('ready');
      startTimeRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (testStatus === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setEarlyClick(true);
      setTestStatus('idle');
    } else if (testStatus === 'ready') {
      const endTime = performance.now();
      const rt = Math.round(endTime - startTimeRef.current);
      const newResults = [...results, rt];
      setResults(newResults);

      if (newResults.length >= 3) {
        setStep('result');
      } else {
        setTestStatus('idle');
      }
    } else if (testStatus === 'idle') {
      startTrial();
    }
  }, [testStatus, results, startTrial]);

  const handleClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && step === 'test') {
        e.preventDefault();
        handleClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleClick]);

  const avgRt = results.length > 0 ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;
  const expectedAvg = getExpectedAverage(ageGroup, sex);
  const diff = avgRt - expectedAvg;
  const diffAbs = Math.abs(diff);
  const isSlower = diff > 0;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full mt-4 bg-white border-2 border-[#212529] text-[#212529] py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#F8F9FA] transition-colors flex items-center justify-center gap-2"
      >
        <Activity className="w-5 h-5" />
        Check Reaction Speed
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-2xl w-full shadow-xl border border-[#DEE2E6] flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center p-4 border-b border-[#DEE2E6]">
              <h3 className="font-bold uppercase tracking-tight text-[#212529] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#841617]" />
                Reaction Speed Test
              </h3>
              <button onClick={handleClose} className="text-[#6C757D] hover:text-[#212529] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center p-8 relative">
              {step === 'intro' && (
                <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-2">
                  <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 text-[#212529]">Instructions</h2>
                  <p className="text-[#495057] mb-8 leading-relaxed">
                    This test will measure your reaction time. When you start, the screen will turn red. 
                    <strong> Wait for it to turn green</strong>, and click, tap, or press the spacebar as fast as you can.
                    We will average your score over 3 trials.
                  </p>
                  <button 
                    onClick={() => setStep('test')}
                    className="bg-[#841617] text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#6a1112] transition-colors"
                  >
                    Begin Test
                  </button>
                </div>
              )}

              {step === 'test' && (
                <div 
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center cursor-pointer select-none transition-colors duration-100",
                    testStatus === 'idle' ? "bg-white" :
                    testStatus === 'waiting' ? "bg-red-500" :
                    "bg-green-500"
                  )}
                  onMouseDown={handleClick}
                  onTouchStart={(e) => { e.preventDefault(); handleClick(); }}
                >
                  <div className="text-center mb-8 z-10">
                    <p className="text-sm font-bold uppercase tracking-widest text-[#212529] bg-white/90 px-4 py-2 rounded-full inline-block">
                      Trial {results.length + 1} of 3
                    </p>
                  </div>

                  <div className="text-center z-10 pointer-events-none">
                    {testStatus === 'idle' && !earlyClick && (
                      <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#212529]">
                        Click or Space to Start
                      </h2>
                    )}
                    {testStatus === 'idle' && earlyClick && (
                      <div className="text-[#841617]">
                        <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight mb-2">
                          Too Soon!
                        </h2>
                        <p className="text-lg font-medium">Click or press Space to try again.</p>
                      </div>
                    )}
                    {testStatus === 'waiting' && (
                      <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                        Wait for Green...
                      </h2>
                    )}
                    {testStatus === 'ready' && (
                      <h2 className="text-5xl sm:text-7xl font-bold uppercase tracking-tight text-white animate-in zoom-in-75 duration-75">
                        CLICK / SPACE!
                      </h2>
                    )}
                  </div>
                </div>
              )}

              {step === 'result' && (
                <div className="text-center max-w-lg animate-in fade-in zoom-in-95 duration-300">
                  <h2 className="text-4xl font-bold uppercase tracking-tight text-[#212529] mb-6">
                    {avgRt} ms
                  </h2>
                  <p className="text-lg text-[#495057] mb-6 leading-relaxed">
                    Concussions and Traumatic Brain Injuries can often lower an individual's reaction speed.
                  </p>
                  <div className="bg-[#F8F9FA] p-6 border border-[#DEE2E6] mb-8">
                    <p className="text-md text-[#212529] font-medium leading-relaxed">
                      Your reaction speed is <strong className="text-[#841617] text-xl">{avgRt} ms</strong>, which is <strong className="text-[#841617]">{diffAbs} ms {isSlower ? 'slower' : 'faster'}</strong> than the average for individuals in your gender and age group ({expectedAvg} ms).
                    </p>
                  </div>
                  <button 
                    onClick={handleClose}
                    className="bg-[#212529] text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#343A40] transition-colors"
                  >
                    Close Test
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
