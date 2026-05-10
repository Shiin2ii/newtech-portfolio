"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import type { MouseEvent } from "react";
import type { Project } from "@/db/schema";

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="glass rounded-lg p-6 cursor-default group"
    >
      <div style={{ transform: "translateZ(20px)" }}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-mono text-lg text-white group-hover:text-cyan-400 transition-colors duration-200">
            {project.title}
          </h3>
          <span className="font-mono text-xs text-cyan-400/40 flex-shrink-0 ml-2">
            [{String(project.id).padStart(2, "0")}]
          </span>
        </div>

        <p className="font-mono text-sm text-slate-400 leading-relaxed mb-5">
          {project.description}
        </p>

        <div className="flex gap-3">
          {project.source_url && (
            <a
              href={project.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-green-400/80 border border-green-400/20 px-3 py-1.5 rounded-sm hover:bg-green-400/10 transition-colors"
            >
              &gt; source
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-cyan-400/80 border border-cyan-400/20 px-3 py-1.5 rounded-sm hover:bg-cyan-400/10 transition-colors"
            >
              &gt; live demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
