"use client";
import { useEffect } from "react";
import gsap from "gsap";

export function useCinematicReveal(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      ref.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    ).fromTo(
      ref.current,
      { filter: "blur(10px)" },
      { filter: "blur(0px)", duration: 0.8 },
      "<"
    );
  }, [ref]);
}

export function useParticleGlow(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      boxShadow: [
        "0 0 10px rgba(99,243,255,0.3)",
        "0 0 30px rgba(99,243,255,0.8)",
        "0 0 10px rgba(99,243,255,0.3)",
      ],
      duration: 3,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, [ref]);
}

export function usePulseAnimation(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      scale: [1, 1.05, 1],
      duration: 2,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, [ref]);
}

export function useRippleEffect(ref: React.RefObject<HTMLElement>, trigger: boolean) {
  useEffect(() => {
    if (!ref.current || !trigger) return;
    const tl = gsap.timeline();
    tl.to(ref.current, {
      boxShadow: "0 0 0 20px rgba(99,243,255,0)",
      duration: 0.8,
      ease: "power2.out",
    });
  }, [ref, trigger]);
}
