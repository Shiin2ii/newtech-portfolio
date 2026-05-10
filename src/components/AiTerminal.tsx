"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { submitContact } from "@/actions/contact";

type TerminalMode = "chat" | "contact";
type ContactField = "name" | "email" | "message" | null;

interface LogEntry {
  id: number;
  text: string;
  type: "prompt" | "system" | "success" | "error" | "loading";
}

export default function AiTerminal() {
  const [mode, setMode] = useState<TerminalMode>("chat");
  const [contactField, setContactField] = useState<ContactField>("name");
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactInput, setContactInput] = useState("");
  const [contactStatus, setContactStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [contactLogs, setContactLogs] = useState<LogEntry[]>([]);
  const [transferText, setTransferText] = useState("");
  const logCounterRef = useRef(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);

  const [chatInput, setChatInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, contactLogs, contactStatus]);

  useEffect(() => {
    if (mode === "contact") {
      contactInputRef.current?.focus();
    }
  }, [mode, contactField]);

  function addLog(text: string, type: LogEntry["type"]) {
    logCounterRef.current += 1;
    const id = logCounterRef.current;
    setContactLogs((prev) => [...prev, { id, text, type }]);
  }

  function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (chatInput.trim() === "/contact") {
      setMode("contact");
      addLog("> /contact", "prompt");
      addLog("Switching to contact mode...", "system");
      setChatInput("");
      return;
    }
    sendMessage({ text: chatInput });
    setChatInput("");
  }

  async function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    const value = contactInput.trim();
    if (!value) return;
    setContactInput("");

    if (contactField === "name") {
      setContactData((prev) => ({ ...prev, name: value }));
      addLog(`> name: ${value}`, "prompt");
      setContactField("email");
    } else if (contactField === "email") {
      setContactData((prev) => ({ ...prev, email: value }));
      addLog(`> email: ${value}`, "prompt");
      setContactField("message");
    } else if (contactField === "message") {
      addLog(`> message: ${value}`, "prompt");
      setContactField(null);
      setContactStatus("loading");

      // Typewriter animation for transfer message
      const transferMsg = "> Executing data transfer...";
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < transferMsg.length) {
          setTransferText(transferMsg.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 40);

      const fd = new FormData();
      fd.append("name", contactData.name);
      fd.append("email", contactData.email);
      fd.append("message", value);

      const result = await submitContact(fd);
      clearInterval(typeInterval);
      setTransferText(transferMsg);

      if (result.success) {
        setContactStatus("success");
      } else {
        setContactStatus("error");
        addLog(`Error: ${result.error ?? "Unknown error."}`, "error");
      }
    }
  }

  function resetTerminal() {
    setMode("chat");
    setContactField("name");
    setContactData({ name: "", email: "", message: "" });
    setContactInput("");
    setContactStatus("idle");
    setTransferText("");
    setContactLogs([]);
    logCounterRef.current = 0;
  }

  const promptLabel =
    mode === "contact" ? "user@portfolio:~$" : "you@ai:~$";

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-cyan-400/60 tracking-widest uppercase mb-2">
            $ ./ai-terminal --interactive
          </p>
          <h2 className="font-mono text-2xl md:text-3xl text-white">
            AI Terminal
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-lg overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
        >
          {/* macOS-style title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" />
            <span className="ml-3 font-mono text-xs text-slate-500 flex-1 text-center select-none">
              {mode === "chat"
                ? "AI Assistant — portfolio.exe"
                : "contact-form.sh"}
            </span>
          </div>

          {/* Terminal body */}
          <div className="bg-[#0d0d0d] p-5 h-80 overflow-y-auto font-mono text-sm space-y-1">
            {mode === "chat" && (
              <>
                <p className="text-slate-500 mb-3">
                  Welcome. I&apos;m an AI assistant for this portfolio. Type{" "}
                  <span className="text-cyan-400">/contact</span> to open the
                  contact form, or ask me anything.
                </p>
                {messages.map((msg: UIMessage) => (
                  <div key={msg.id} className="mb-2">
                    {msg.role === "user" ? (
                      <p className="text-green-400">
                        <span className="text-cyan-400/60">&gt; </span>
                        {msg.parts
                          .filter((p) => p.type === "text")
                          .map((p) => (p as { type: "text"; text: string }).text)
                          .join("")}
                      </p>
                    ) : (
                      <p className="text-slate-300 pl-3 border-l border-slate-700 mb-3 leading-relaxed">
                        {msg.parts
                          .filter((p) => p.type === "text")
                          .map((p) => (p as { type: "text"; text: string }).text)
                          .join("")}
                      </p>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <p className="text-slate-500">
                    <span className="cursor-blink">▋</span>
                  </p>
                )}
              </>
            )}

            {mode === "contact" && (
              <>
                {contactLogs.map((log) => (
                  <p
                    key={log.id}
                    className={
                      log.type === "prompt"
                        ? "text-green-400"
                        : log.type === "error"
                          ? "text-red-400"
                          : "text-slate-400"
                    }
                  >
                    {log.text}
                  </p>
                ))}

                {contactField === "name" && contactStatus === "idle" && (
                  <p className="text-cyan-400 pt-1">Enter your name:</p>
                )}
                {contactField === "email" && contactStatus === "idle" && (
                  <p className="text-cyan-400 pt-1">Enter your email:</p>
                )}
                {contactField === "message" && contactStatus === "idle" && (
                  <p className="text-cyan-400 pt-1">Enter your message:</p>
                )}

                {contactStatus === "loading" && (
                  <p className="text-yellow-400 pt-1">
                    {transferText}
                    <span className="cursor-blink">▋</span>
                  </p>
                )}

                {contactStatus === "success" && (
                  <div className="pt-1 space-y-2">
                    <p className="text-green-400">
                      &gt; Transfer complete. Message sent successfully!
                    </p>
                    <button
                      onClick={resetTerminal}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      &gt; return to chat
                    </button>
                  </div>
                )}

                {contactStatus === "error" && (
                  <div className="pt-1 space-y-2">
                    <button
                      onClick={resetTerminal}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      &gt; try again
                    </button>
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div className="bg-[#0d0d0d] border-t border-white/10 px-5 py-3 flex items-center gap-2">
            <span className="text-cyan-400/60 font-mono text-sm flex-shrink-0 select-none">
              {promptLabel}
            </span>

            {mode === "chat" && (
              <form onSubmit={handleChatSubmit} className="flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-transparent text-green-400 font-mono text-sm outline-none placeholder-slate-700 caret-green-400"
                  placeholder="ask me anything..."
                  autoFocus
                  disabled={isLoading}
                />
              </form>
            )}

            {mode === "contact" &&
              contactField !== null &&
              contactStatus === "idle" && (
                <form onSubmit={handleContactSubmit} className="flex-1">
                  <input
                    ref={contactInputRef}
                    type={contactField === "email" ? "email" : "text"}
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    className="w-full bg-transparent text-green-400 font-mono text-sm outline-none placeholder-slate-700 caret-green-400"
                    placeholder="type and press Enter..."
                    autoComplete="off"
                  />
                </form>
              )}

            {mode === "contact" &&
              (contactField === null || contactStatus !== "idle") && (
                <span className="text-slate-700 font-mono text-sm">—</span>
              )}
          </div>
        </motion.div>

        <p className="mt-4 text-center font-mono text-xs text-slate-600">
          Powered by Vercel AI SDK &middot; Type{" "}
          <span className="text-cyan-400">/contact</span> to send a message
        </p>
      </div>
    </section>
  );
}
