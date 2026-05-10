import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import AiTerminal from "@/components/AiTerminal";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <AiTerminal />
      <footer className="py-8 text-center font-mono text-xs text-slate-600 border-t border-white/5">
        <span className="text-cyan-400/40">&gt;</span> Ngô Hồ Tấn Toàn &copy;{" "}
        {new Date().getFullYear()} — Built with Next.js, TypeScript &amp; ❤️
      </footer>
      <BackToTop />
    </main>
  );
}
