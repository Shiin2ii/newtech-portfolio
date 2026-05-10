"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FULL_TEXT = "> Hello, I'm Ngô Hồ Tấn Toàn | IT Student & Web Developer";

export default function Hero() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < FULL_TEXT.length) {
        setDisplayedText(FULL_TEXT.slice(0, index + 1));
        index++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-4xl w-full"
      >
        <p className="font-mono text-xs text-cyan-400/50 tracking-widest uppercase mb-4">
          portfolio.exe — v1.0.0
        </p>

        <h1 className="font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight text-green-400 min-h-[3rem] flex items-center justify-center gap-1 flex-wrap">
          <span>{displayedText}</span>
          <span className="cursor-blink inline-block w-0.5 h-[1.1em] bg-green-400 align-middle" />
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingDone ? 1 : 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 font-mono text-sm border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 transition-colors duration-200 rounded-sm"
          >
            ./view-projects
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 font-mono text-sm border border-green-400/40 text-green-400 hover:bg-green-400/10 transition-colors duration-200 rounded-sm"
          >
            ./contact-me
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingDone ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 font-mono text-sm text-slate-500"
        >
          <span className="text-cyan-400/50">$</span> Building modern web
          experiences with Next.js, TypeScript &amp; AI
        </motion.p>
      </motion.div>
    </section>
  );
}
