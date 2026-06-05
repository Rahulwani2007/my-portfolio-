import React from "react";
import { motion } from "framer-motion";

export default function GlowButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`pointer-events-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-600 text-black font-semibold shadow-2xl ${className || ""}`}
    >
      {children}
    </motion.button>
  );
}
