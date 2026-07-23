import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { Brain, X, Smartphone, Activity } from 'lucide-react';

export function VestibularTest() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [errorMsg, setErrorMsg] = useState("");
  
  const [renderState, setRenderState] = useState({
    brainX: 0,
    brainY: 0,
    isCentered: false,
    targetRadius: 80
  });
  
  const [finalTime, setFinalTime] = useState<number>(0);

  const tilt = useRef({ alpha: 0, beta: 0, gamma: 0, isReal: false });
  const game = useRef({
    active: false,
    baseline: { alpha: 0, beta: 0, gamma: 0 },
    brainWorldX: 0,
    brainWorldY: 0,
    lastTime: 0,
    startTime: 0,
    targetRadius: 80
  });

  const frameRef = useRef<number>();

  const handleOpen = () => {
    setIsOpen(true);
    setStep('intro');
    setErrorMsg("");
  };

  const handleClose = () => {
    setIsOpen(false);
    game.current.active = false;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  };

  const requestPermission = async () => {
    // Request permission for iOS 13+ devices
    if (typeof (DeviceOrientationEvent as any) !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          startTest();
        } else {
          setErrorMsg("Permission denied. We need motion access for this test.");
        }
      } catch (e) {
        setErrorMsg("Error requesting permission.");
      }
    } else {
      // Non-iOS or older devices don't need explicit permission
      startTest();
    }
  };

  const startTest = () => {
    setStep('test');
    
    // Spawn the brain slightly off-center
    const angle = Math.random() * Math.PI * 2;
    const distance = 100; 
    
    game.current = {
      active: true,
      baseline: { ...tilt.current },
      brainWorldX: Math.cos(angle) * distance,
      brainWorldY: Math.sin(angle) * distance,
      lastTime: performance.now(),
      startTime: performance.now(),
      targetRadius: 80
    };
    
    frameRef.current = requestAnimationFrame(loop);
  };

  const loop = () => {
    if (!game.current.active) return;
    const now = performance.now();
    const dt = (now - game.current.lastTime) / 1000;
    game.current.lastTime = now;
    const elapsedTime = now - game.current.startTime;

    // Calculate camera position based on how much the device has tilted since round start
    let dAlpha = 0;
    let dBeta = tilt.current.beta - game.current.baseline.beta;
    
    if (tilt.current.isReal) {
      // Alpha wraps at 360, so we find the shortest path
      dAlpha = (tilt.current.alpha - game.current.baseline.alpha + 540) % 360 - 180;
    } else {
      // Mouse fallback mapping
      dAlpha = tilt.current.alpha - game.current.baseline.alpha;
    }

    // Map tilt to camera coordinates
    const sensitivityX = 8;
    const sensitivityY = 8;
    
    let cameraX = dAlpha * sensitivityX;
    let cameraY = dBeta * sensitivityY;

    // Brain relative to center of screen initially to find distance
    let bx = game.current.brainWorldX - cameraX;
    let by = game.current.brainWorldY - cameraY;
    let dist = Math.sqrt(bx*bx + by*by);

    // The brain runs away from the camera
    let speed = Math.max(0, 80 - (elapsedTime / 30)); // Progressively slows down over time
    
    // Don't run too far off screen (max distance around 200px)
    if (dist > 200) speed = 0;

    if (dist > 0 && speed > 0) {
      // Vector pointing away from the center of the screen
      const dirX = bx / dist;
      const dirY = by / dist;
      
      game.current.brainWorldX += dirX * speed * dt;
      game.current.brainWorldY += dirY * speed * dt;
      
      // Recalculate relative position after moving
      bx = game.current.brainWorldX - cameraX;
      by = game.current.brainWorldY - cameraY;
      dist = Math.sqrt(bx*bx + by*by);
    }

    const isCentered = dist < game.current.targetRadius;

    if (isCentered) {
      // Immediately win
      game.current.active = false;
      setFinalTime(elapsedTime);
      setStep('result');
      return;
    }

    setRenderState({
      brainX: bx,
      brainY: by,
      isCentered,
      targetRadius: game.current.targetRadius
    });

    frameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    // Fallback for desktop testing in browser previews
    const handleMouseMove = (e: MouseEvent) => {
      if (!tilt.current.isReal) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dx = (e.clientX - centerX) / centerX;
        const dy = (e.clientY - centerY) / centerY;
        tilt.current = { alpha: dx * 90, beta: dy * 45, gamma: dx * 45, isReal: false };
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Listen for actual device tilt
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null && e.alpha !== null) {
        tilt.current = { alpha: e.alpha, beta: e.beta, gamma: e.gamma, isReal: true };
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      game.current.active = false;
    };
  }, []);

  // Remove the old avgTime since finalTime is a single number now
  // const avgTime = ...

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full mt-4 bg-white border-2 border-[#212529] text-[#212529] py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#F8F9FA] transition-colors flex items-center justify-center gap-2"
      >
        <Smartphone className="w-5 h-5" />
        Brain Balance Test
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-2xl w-full shadow-xl border border-[#DEE2E6] flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center p-4 border-b border-[#DEE2E6]">
              <h3 className="font-bold uppercase tracking-tight text-[#212529] flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#841617]" />
                Vestibular Balance Test
              </h3>
              <button onClick={handleClose} className="text-[#6C757D] hover:text-[#212529] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow flex flex-col relative overflow-hidden bg-[#F8F9FA]">
              {step === 'intro' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-2 z-10 bg-white">
                  <Smartphone className="w-16 h-16 text-[#841617] mb-6 animate-pulse" />
                  <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 text-[#212529]">Find Your Balance</h2>
                  <p className="text-[#495057] mb-8 leading-relaxed max-w-md">
                    Mild Traumatic Brain Injuries (mTBI) can affect vestibular function and spatial orientation. 
                    In this test, the brain will try to run away off-center. <strong className="text-[#212529]">Move and tilt your device</strong> to track it down and bring it into the target circle.
                  </p>
                  
                  {errorMsg && <p className="text-[#841617] mb-4 text-sm font-medium">{errorMsg}</p>}
                  
                  <button 
                    onClick={requestPermission}
                    className="bg-[#841617] text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#6a1112] transition-colors"
                  >
                    Start Test
                  </button>
                  <p className="text-[10px] uppercase tracking-widest text-[#ADB5BD] mt-6">
                    Note: On desktop, you can use your mouse to simulate device tilt.
                  </p>
                </div>
              )}

              {step === 'test' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute top-4 text-center z-10">
                    <p className="text-sm font-medium text-[#212529] mt-1">
                      Catch the brain
                    </p>
                  </div>
                  
                  {/* Target Circle */}
                  <div 
                    className={cn(
                      "absolute rounded-full border-4 transition-colors duration-300",
                      renderState.isCentered ? "border-green-500 bg-green-500/10" : "border-[#DEE2E6]"
                    )}
                    style={{
                      width: renderState.targetRadius * 2,
                      height: renderState.targetRadius * 2,
                    }}
                  />
                  
                  {/* The Brain */}
                  <div 
                    className="absolute transition-transform duration-75"
                    style={{
                      transform: `translate(${renderState.brainX}px, ${renderState.brainY}px)`
                    }}
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-full bg-white shadow-lg border transition-colors",
                      renderState.isCentered ? "border-green-500" : "border-[#841617]"
                    )} style={{ width: 48, height: 48 }}>
                      <Brain className={cn(
                        "w-6 h-6",
                        renderState.isCentered ? "text-green-600" : "text-[#841617]"
                      )} />
                    </div>
                  </div>
                </div>
              )}

              {step === 'result' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 bg-white z-10">
                  <h2 className="text-4xl font-bold uppercase tracking-tight text-[#212529] mb-2">
                    {Math.round(finalTime)} ms
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-[#6C757D] mb-6">Time to Catch</p>
                  
                  <p className="text-md text-[#495057] mb-8 leading-relaxed max-w-md">
                    Vestibular processing is crucial for athletes. Longer times can sometimes correlate with vestibular disruption common in mTBIs. 
                  </p>
                  
                  <button 
                    onClick={handleClose}
                    className="bg-[#212529] text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#343A40] transition-colors"
                  >
                    Finish
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
