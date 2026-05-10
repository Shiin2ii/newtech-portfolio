"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "C#", color: "text-purple-400 border-purple-400/30" },
  { name: "Next.js", color: "text-white border-white/20" },
  { name: "Tailwind CSS", color: "text-cyan-400 border-cyan-400/30" },
  { name: "TypeScript", color: "text-blue-400 border-blue-400/30" },
  { name: "Supabase", color: "text-green-400 border-green-400/30" },
  { name: "Git", color: "text-orange-400 border-orange-400/30" },
  { name: "React", color: "text-cyan-300 border-cyan-300/30" },
  { name: "Drizzle ORM", color: "text-yellow-400 border-yellow-400/30" },
  { name: "PostgreSQL", color: "text-blue-300 border-blue-300/30" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function TechStack() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-cyan-400/60 tracking-widest uppercase mb-2">
            $ ls ./skills
          </p>
          <h2 className="font-mono text-2xl md:text-3xl text-white">
            Tech Stack
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          {skills.map((skill, i) => (
            <motion.div key={skill.name} variants={itemVariants}>
              {/* Float animation on inner div to avoid Framer Motion transform conflict */}
              <div
                className={`animate-float glass rounded-md px-4 py-3 font-mono text-sm font-medium text-center border ${skill.color} hover:scale-105 transition-transform duration-200 cursor-default select-none`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {skill.name}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
