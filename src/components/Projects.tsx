import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import ProjectList from "./ProjectList";
import type { Project } from "@/db/schema";

const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description:
      "Modern high-tech portfolio built with Next.js 16, Tailwind CSS, Framer Motion and Vercel AI SDK.",
    source_url: "https://github.com",
    live_url: "https://example.com",
    created_at: new Date(),
  },
  {
    id: 2,
    title: "Full-Stack App",
    description:
      "A full-stack web application with Supabase PostgreSQL, Drizzle ORM and Next.js App Router.",
    source_url: "https://github.com",
    live_url: null,
    created_at: new Date(),
  },
];

export default async function Projects() {
  let projectData: Project[] = [];

  try {
    projectData = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.created_at));
  } catch {
    projectData = PLACEHOLDER_PROJECTS;
  }

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs text-cyan-400/60 tracking-widest uppercase mb-2">
            $ cat ./projects.json
          </p>
          <h2 className="font-mono text-2xl md:text-3xl text-white">
            Projects
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
        </div>

        <ProjectList projects={projectData} />
      </div>
    </section>
  );
}
