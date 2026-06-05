import React, { useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function PortalTransition({ isOpen, onComplete }: { isOpen: boolean; onComplete: () => void }) {
  const portalRef = React.useRef(null);

  useEffect(() => {
    if (!isOpen || !portalRef.current) return;

    const tl = gsap.timeline({ onComplete });
    tl.fromTo(
      portalRef.current,
      { scale: 0, opacity: 0, rotationZ: 0 },
      { scale: 1, opacity: 1, rotationZ: 360, duration: 1.5, ease: "power2.out" }
    )
      .to(
        portalRef.current,
        { filter: "blur(5px)", opacity: 0, scale: 2, duration: 1, delay: 0.5 },
        "<+=0.5"
      );
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div ref={portalRef} className="w-96 h-96 rounded-full border-4 border-cyan-400 shadow-2xl shadow-cyan-500/50 flex items-center justify-center">
        <div className="w-80 h-80 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 opacity-40 blur-xl animate-pulse" />
        <div className="absolute text-center text-white text-lg font-light tracking-widest">ENTERING AI CIVILIZATION</div>
      </div>
    </motion.div>
  );
}
