"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  { label: "Year of Study", value: "Year 4" },
  { label: "Major", value: "IT" },
  { label: "Projects", value: "10+" },
  { label: "Status", value: "Open to work" },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-cyan-400/60 tracking-widest uppercase mb-2">
            $ cat ./about.md
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">About Me</h2>
          <div className="mt-2 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-start"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl scale-110" />
              {/* Avatar container */}
              <div className="relative w-52 h-52 rounded-full border-2 border-cyan-400/30 overflow-hidden glass">
                <Image
                  src="/avatar.jpg"
                  alt="Ngô Hồ Tấn Toàn"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://api.dicebear.com/9.x/initials/svg?seed=TT&backgroundColor=0d9488&textColor=ffffff&fontSize=40";
                  }}
                />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0a0a0a] shadow-lg shadow-green-400/50" />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">
                Ngô Hồ Tấn Toàn
                <span className="ml-3 font-mono text-xs text-cyan-400 border border-cyan-400/30 px-2 py-0.5 rounded-sm">
                  IT Student
                </span>
              </h3>

              <p className="text-sm text-slate-400 leading-7">
                Xin chào! Tôi là sinh viên IT đam mê xây dựng các ứng dụng web
                hiện đại. Tôi thích khám phá các công nghệ mới và tạo ra những
                trải nghiệm người dùng mượt mà, tối giản nhưng ấn tượng.
              </p>

              <p className="text-sm text-slate-400 leading-7">
                Hiện tại tôi đang học chuyên ngành Công nghệ thông tin và tập
                trung vào full-stack web development với{" "}
                <span className="text-cyan-400">Next.js</span>,{" "}
                <span className="text-cyan-400">TypeScript</span> và{" "}
                <span className="text-cyan-400">Supabase</span>.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="glass rounded-md px-4 py-3">
                  <p className="font-mono text-xs text-cyan-400/60 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm font-medium text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
