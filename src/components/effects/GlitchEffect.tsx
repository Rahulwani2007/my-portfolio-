import React, { useEffect } from "react";
import gsap from "gsap";

export default function GlitchEffect({ trigger }: { trigger: boolean }) {
  const glitchRef = React.useRef(null);

  useEffect(() => {
    if (!trigger || !glitchRef.current) return;

    const tl = gsap.timeline();
    tl.to(glitchRef.current, { rotationX: 5, rotationY: -8, duration: 0.1 })
      .to(glitchRef.current, { rotationX: -5, rotationY: 8, duration: 0.1 })
      .to(glitchRef.current, { rotationX: 0, rotationY: 0, duration: 0.1 });

    for (let i = 0; i < 8; i++) {
      tl.to(
        glitchRef.current,
        {
          filter: `hue-rotate(${Math.random() * 360}deg) brightness(${0.7 + Math.random() * 0.3})`,
          duration: 0.05,
        },
        "<+=0.05"
      );
    }

    tl.to(glitchRef.current, { filter: "hue-rotate(0deg) brightness(1)", duration: 0.2 });
  }, [trigger]);

  return (
    <div
      ref={glitchRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "rgba(255, 100, 100, 0.02)",
        textShadow: "2px 2px 0px rgba(255, 0, 0, 0.3)",
      }}
    />
  );
}
