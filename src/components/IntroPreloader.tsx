import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Terminal as TerminalIcon,
  Cpu,
  ShieldCheck,
  Fingerprint,
  Lock,
  Database,
  Power,
  ChevronRight,
  Monitor,
  Activity,
  Globe
} from 'lucide-react';

// Procedural audio synthesizer using the Web Audio API (zero static asset dependency)
class CyberSynth {
  private ctx: AudioContext | null = null;

  init() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('Audio Context not supported:', e);
    }
  }

  playType() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750 + Math.random() * 300, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Ignore audio block
    }
  }

  playScan() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(420, this.ctx.currentTime + 0.25);
      
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      // Ignore
    }
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const playNote = (freq: number, delay: number, dur: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        
        gain.gain.setValueAtTime(0.0, now + delay);
        gain.gain.linearRampToValueAtTime(0.03, now + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + dur);
      };

      // Cyber chord ascent
      playNote(523.25, 0, 0.25); // C5
      playNote(659.25, 0.08, 0.25); // E5
      playNote(783.99, 0.16, 0.3); // G5
      playNote(1046.50, 0.24, 0.5); // C6
    } catch (e) {
      // Ignore
    }
  }

  playWarp() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const dur = 1.4;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(2000, now + dur);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(6, now);
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(3500, now + dur);
      
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + dur);
    } catch (e) {
      // Ignore
    }
  }
}

interface IntroPreloaderProps {
  onComplete: () => void;
}

export default function IntroPreloader({ onComplete }: IntroPreloaderProps) {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [percentage, setPercentage] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [scannedData, setScannedData] = useState<{ label: string; value: string }[]>([]);
  const [isWarping, setIsWarping] = useState(false);
  const [isBooting, setIsBooting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<any>(null);
  const synthRef = useRef<CyberSynth | null>(null);

  // Start system and trigger Web Audio Context initialization
  const startSystem = () => {
    if (synthRef.current) {
      synthRef.current.init();
      // Cyber double chirp
      synthRef.current.playType();
      setTimeout(() => {
        synthRef.current?.playType();
      }, 75);
    }
    setIsBooting(true);
  };

  // Initialize synth and user interaction listeners to kick-start AudioContext
  useEffect(() => {
    synthRef.current = new CyberSynth();
    
    const handleInteraction = () => {
      if (synthRef.current) {
        synthRef.current.init();
      }
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('mousemove', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
    };
  }, []);

  // System Diagnostics
  const systemInfo = useRef({
    os: navigator.userAgent.includes('Windows') ? 'Windows OS' : navigator.userAgent.includes('Mac') ? 'macOS' : 'Linux/Unix',
    cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : '8 Cores',
    resolution: `${window.innerWidth}x${window.innerHeight}`,
    gpu: 'Neural Engine 49.8',
    network: 'SECURE QUANTUM LINK'
  });

  // Text scramble effect helper
  const scrambleText = (text: string, callback: (t: string) => void, duration = 800) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()_+=[]{}|;:,.<>?';
    let start = 0;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const length = text.length;

    const timer = setInterval(() => {
      let result = '';
      for (let i = 0; i < length; i++) {
        if (i < (start / steps) * length) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      callback(result);
      start++;
      if (start >= steps) {
        clearInterval(timer);
        callback(text);
      }
    }, intervalTime);
  };

  // Skip Intro function
  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    // Play warp sound
    synthRef.current?.playWarp();
    
    // Fast warp transition
    setIsWarping(true);
    
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.15,
      filter: 'blur(10px)',
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => {
        onComplete();
      }
    });
  };

  // Keyboard shortcut for skip (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3D Canvas Starfield / Particle Warp
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    interface Particle {
      x: number;
      y: number;
      z: number;
      color: string;
    }

    const numParticles = 200;
    const particles: Particle[] = [];

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 1000,
        z: Math.random() * 1000,
        color: i % 2 === 0 ? 'rgba(6, 182, 212, ' : 'rgba(99, 102, 241, ' // Cyan or Indigo
      });
    }

    const fov = 400;
    const cx = width / 2;
    const cy = height / 2;

    const animate = () => {
      // Background clear with slight trail (matrix effect)
      ctx.fillStyle = isWarping ? 'rgba(3, 3, 3, 0.25)' : 'rgba(3, 3, 3, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Speed changes depending on warping state
      const speed = isWarping ? 45 : 1.5;

      particles.forEach((p) => {
        // Move towards viewer
        p.z -= speed;

        // Reset if behind viewer
        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * 1000;
          p.y = (Math.random() - 0.5) * 1000;
        }

        // 3D Projection
        const k = fov / p.z;
        const sx = cx + p.x * k;
        const sy = cy + p.y * k;

        // Size based on proximity
        const size = (1 - p.z / 1000) * 3;

        // Fade in based on distance
        const opacity = (1 - p.z / 1000);

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + opacity + ')';
          ctx.fill();
        }
      });

      // Holographic scanlines effect
      if (!isWarping) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 4) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isWarping]);

  // Main GSAP Timeline
  useEffect(() => {
    if (!isBooting) return;
    
    // Prevent scrolling while intro is active
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        // Final fade out of intro container
        setIsWarping(true);
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.15,
          filter: 'blur(15px)',
          duration: 1.5,
          ease: 'power3.inOut',
          onComplete: () => {
            document.body.style.overflow = '';
            onComplete();
          }
        });
      }
    });

    timelineRef.current = tl;

    // --- PHASE 1: BOOT SEQUENCE ---
    const logs = [
      'Initializing Neural Core...',
      'Loading Quantum Database...',
      'Connecting Global Network...',
      'Establishing Secure Connection...',
      'Starting AI Engine...',
      'System Ready...'
    ];

    logs.forEach((log, index) => {
      tl.to({}, {
        duration: 0.35,
        onStart: () => {
          setBootLogs((prev) => [...prev, `> ${log}`]);
          synthRef.current?.playType();
        }
      });
    });

    // Animate counter & progress bar
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        setPercentage(Math.floor(counterObj.val));
      }
    }, 0);

    // --- PHASE 2: VISITOR ANALYSIS ---
    tl.to({}, {
      duration: 0.4,
      onStart: () => setPhase(2)
    });

    const analysisItems = [
      { label: 'DEVICE SIGNATURE', value: systemInfo.current.os },
      { label: 'PROCESSOR MATRIX', value: systemInfo.current.cores },
      { label: 'PORT VIEWPORT', value: systemInfo.current.resolution },
      { label: 'COGNITIVE CORE', value: systemInfo.current.gpu },
      { label: 'LINK METRICS', value: systemInfo.current.network }
    ];

    analysisItems.forEach((item, index) => {
      tl.to({}, {
        duration: 0.35,
        onStart: () => {
          setScannedData((prev) => [...prev, item]);
          synthRef.current?.playScan();
        }
      });
    });

    // --- PHASE 3: AUTHENTICATION ---
    tl.to({}, {
      duration: 0.4,
      onStart: () => {
        setPhase(3);
        synthRef.current?.playSuccess();
      }
    });

    // Biometric scanning hold time
    tl.to({}, { duration: 2.4 });

    // --- PHASE 4: WELCOME SCREEN ---
    tl.to({}, {
      duration: 0.4,
      onStart: () => setPhase(4)
    });

    // Cinematic delay for titles
    tl.to({}, { duration: 3.5 });

    // --- PHASE 5: PORTFOLIO LAUNCH ---
    tl.to({}, {
      duration: 0.4,
      onStart: () => {
        setPhase(5);
        synthRef.current?.playWarp();
      }
    });

    // Final compile logs before portal opens
    tl.to({}, { duration: 2.0 });

    return () => {
      // In case component unmounts early, restore scrolling
      document.body.style.overflow = '';
    };
  }, [isBooting, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#030303] select-none z-[99999] flex flex-col items-center justify-center overflow-hidden font-mono text-[#06b6d4]"
      style={{
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.95)',
        textShadow: '0 0 5px rgba(6, 182, 212, 0.4)'
      }}
    >
      {/* Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none" />

      {/* Vignette & CRT Screen Curved Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-crt-vignette opacity-70" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 md:top-8 md:right-8 z-[100000] px-4 py-2 bg-black/40 border border-cyan-500/30 rounded text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer flex items-center gap-2"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        <span>Skip Boot</span>
        <span className="text-[10px] text-cyan-500/50 hidden md:inline-block">[ESC]</span>
      </button>

      {/* ------------------------------------------------------------- */}
      {/* SYSTEM OFFLINE & INITIALIZER GATE */}
      {/* ------------------------------------------------------------- */}
      {!isBooting ? (
        <div className="w-[90%] max-w-md flex flex-col items-center gap-6 z-10 px-8 py-10 bg-black/65 border border-cyan-500/25 rounded-md backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.08)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div className="relative p-6 border border-cyan-500/30 rounded-full bg-cyan-950/10 cursor-pointer group hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300" onClick={startSystem}>
            <Power className="w-12 h-12 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-105 transition-all animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
          
          <div className="flex flex-col gap-2 font-mono">
            <h2 className="text-sm font-bold tracking-[0.25em] text-cyan-300 uppercase animate-[flicker_2s_infinite]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              AI OS v49.2.0
            </h2>
            <p className="text-[10px] text-cyan-500/60 tracking-widest uppercase font-semibold">System Core Offline</p>
          </div>
          
          <button
            onClick={startSystem}
            className="w-full px-5 py-3 border border-cyan-500/30 bg-cyan-950/20 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] text-cyan-300 transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            INITIALIZE BOOT SEQUENCE
          </button>
        </div>
      ) : (
        <>
          {/* ------------------------------------------------------------- */}
          {/* PHASE 1: SYSTEM INITIALIZATION */}
          {/* ------------------------------------------------------------- */}
          {phase === 1 && (
            <div className="w-[90%] max-w-lg flex flex-col gap-6 z-10 px-6 py-8 bg-black/60 border border-cyan-500/20 rounded-md backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-4">
                <TerminalIcon className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  AI OS v49.2.0 - BOOT DIRECTIVE
                </span>
              </div>
    
              {/* Logs terminal */}
              <div className="h-32 flex flex-col justify-end text-xs md:text-sm font-light text-cyan-400/90 gap-1.5 font-mono overflow-hidden">
                {bootLogs.map((log, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
    
              {/* Progress Section */}
              <div className="flex flex-col gap-2 border-t border-cyan-500/20 pt-4">
                <div className="flex justify-between items-center text-xs tracking-wider">
                  <span className="text-cyan-500/70">CORE SYSTEM POWER</span>
                  <span className="font-bold font-mono text-cyan-300">{percentage.toString().padStart(3, '0')}%</span>
                </div>
                {/* Custom high-tech progress bar */}
                <div className="w-full h-[6px] bg-cyan-950/40 border border-cyan-500/30 rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-100"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
    
          {/* ------------------------------------------------------------- */}
          {/* PHASE 2: VISITOR ANALYSIS */}
          {/* ------------------------------------------------------------- */}
          {phase === 2 && (
            <div className="w-[90%] max-w-3xl flex flex-col md:flex-row gap-8 items-center justify-center z-10 px-8 py-10 bg-black/65 border border-cyan-500/20 rounded-md backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.08)] relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
    
              {/* Interactive HUD SVG Ring (Left Column on Desktop) */}
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                {/* Spinning external radar ring */}
                <svg className="absolute w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="6 4 20 8 10 15"
                  />
                </svg>
                {/* Opposite spinning middle ring */}
                <svg className="absolute w-5/6 h-5/6 animate-[spin_8s_linear_infinite_reverse]" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.5)"
                    strokeWidth="1"
                    strokeDasharray="40 10 5 15"
                  />
                </svg>
                {/* Inner radar crosshair */}
                <svg className="absolute w-2/3 h-2/3 animate-[spin_25s_linear_infinite]" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.2)"
                    strokeWidth="1"
                  />
                  <path d="M50 0 L50 100 M0 50 L100 50" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <Activity className="w-10 h-10 text-cyan-400 animate-[pulse_1.5s_ease-in-out_infinite]" />
                  <span className="text-[10px] tracking-[0.2em] text-indigo-400 mt-2 font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    SCANNING
                  </span>
                </div>
              </div>
    
              {/* Scanned Data List (Right Column on Desktop) */}
              <div className="flex-1 w-full flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-3">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    METRIC SCANNER IN PROCESS
                  </span>
                </div>
    
                <div className="flex flex-col gap-3 font-mono text-xs md:text-sm">
                  {scannedData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-cyan-950/20 py-1">
                      <span className="text-cyan-500/60 uppercase tracking-wider">{item.label}</span>
                      <span className="text-cyan-300 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
    
                {/* Sweep Laser Bar Animation */}
                <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none overflow-hidden rounded-md">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] absolute animate-[laser-sweep_2s_linear_infinite]" />
                </div>
              </div>
            </div>
          )}
    
          {/* ------------------------------------------------------------- */}
          {/* PHASE 3: AUTHENTICATION */}
          {/* ------------------------------------------------------------- */}
          {phase === 3 && (
            <div className="w-[90%] max-w-md flex flex-col items-center justify-center z-10 px-8 py-12 bg-black/70 border border-emerald-500/20 rounded-md backdrop-blur-md shadow-[0_0_60px_rgba(16,185,129,0.05)] text-center relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-pulse" />
    
              {/* Authentication Icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-500/15 rounded-full filter blur-md animate-ping" />
                <div className="relative p-5 border border-emerald-500/30 rounded-full bg-emerald-950/20">
                  <Fingerprint className="w-12 h-12 text-emerald-400 animate-pulse" />
                </div>
              </div>
    
              <div className="flex flex-col gap-2 mb-6 font-mono text-xs text-emerald-500/80">
                <p className="tracking-widest animate-[pulse_1.2s_ease-in-out_infinite]">&gt; SCANNING NEURAL PATTERN...</p>
                <p className="text-[10px] text-emerald-600/60">INTEGRITY BLOCK: VALIDATED</p>
              </div>
    
              <div className="border border-emerald-500/30 bg-emerald-950/15 px-6 py-4 rounded w-full flex flex-col gap-2 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                <h3 className="text-base md:text-lg font-bold tracking-[0.25em] text-emerald-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  AUTHENTICATION SUCCESSFUL
                </h3>
                <p className="text-xs font-semibold tracking-[0.4em] text-emerald-300/80 uppercase">
                  ACCESS GRANTED
                </p>
              </div>
            </div>
          )}
    
          {/* ------------------------------------------------------------- */}
          {/* PHASE 4: FUTURE WELCOME SCREEN */}
          {/* ------------------------------------------------------------- */}
          {phase === 4 && (
            <div className="z-10 text-center flex flex-col items-center px-4 max-w-4xl relative">
              {/* Futuristic glowing geometric accents */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 border border-indigo-500/10 rounded-full pointer-events-none filter blur-sm animate-pulse" />
    
              {/* Header titles */}
              <div className="flex flex-col gap-1.5 mb-8 animate-[flicker_1.5s_ease-in-out]">
                <span
                  className="text-xs font-bold tracking-[0.5em] text-indigo-400/90 uppercase mb-2 block"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  System Online // Neural Net Active
                </span>
                
                <h1
                  className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 relative select-none filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  WELCOME TO THE FUTURE
                </h1>
    
                <h2
                  className="text-base sm:text-lg md:text-xl font-medium tracking-[0.35em] text-indigo-400 mt-2"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  YEAR 2049
                </h2>
              </div>
    
              {/* Profile Name & Specialties */}
              <div className="flex flex-col items-center gap-4 border-t border-cyan-500/20 pt-8 w-full max-w-lg">
                <h3
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.15em] text-white"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  RAHUL WANI
                </h3>
    
                <div className="flex flex-col gap-2.5 mt-3 text-xs md:text-sm font-semibold tracking-[0.25em] text-cyan-400/80 uppercase">
                  <p className="hover:text-cyan-300 transition-colors">COMPUTER ENGINEERING STUDENT</p>
                  <p className="hover:text-cyan-300 transition-colors">FULL STACK DEVELOPER</p>
                  <p className="hover:text-cyan-300 transition-colors">AI ENTHUSIAST</p>
                  <p className="hover:text-cyan-300 transition-colors">ANDROID APP DEVELOPER</p>
                </div>
              </div>
            </div>
          )}
    
          {/* ------------------------------------------------------------- */}
          {/* PHASE 5: PORTFOLIO LAUNCH */}
          {/* ------------------------------------------------------------- */}
          {phase === 5 && (
            <div className="w-[90%] max-w-lg flex flex-col gap-6 z-10 px-6 py-8 bg-black/60 border border-cyan-500/20 rounded-md backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.05)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-4">
                <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  COMPILING PERSONAL ARCHIVE
                </span>
              </div>
    
              {/* Database log lines */}
              <div className="flex flex-col text-xs md:text-sm font-light text-cyan-400/90 gap-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" /> Loading Personal Database...</span>
                  <span className="text-emerald-400 font-bold">[ OK ]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" /> Loading Projects...</span>
                  <span className="text-emerald-400 font-bold">[ OK ]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" /> Loading Skills...</span>
                  <span className="text-emerald-400 font-bold">[ OK ]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" /> Loading Experience...</span>
                  <span className="text-emerald-400 font-bold">[ OK ]</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" /> Loading Achievements...</span>
                  <span className="text-emerald-400 font-bold">[ OK ]</span>
                </div>
              </div>
    
              {/* Launcher Alert Box */}
              <div className="border border-indigo-500/30 bg-indigo-950/15 px-4 py-3 rounded mt-2 flex flex-col items-center justify-center gap-1 animate-pulse">
                <h4 className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  PORTFOLIO READY
                </h4>
                <p className="text-[10px] tracking-[0.3em] text-indigo-400 uppercase font-semibold">
                  LAUNCHING DIGITAL UNIVERSE...
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
