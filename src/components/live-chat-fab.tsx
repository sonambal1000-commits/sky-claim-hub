import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = { who: "agent" | "you"; text: string; at: string };

export function LiveChatFab() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      who: "agent",
      text: "Hi! Need help with your claim? I'm here.",
      at: new Date().toISOString(),
    },
  ]);

  // Hide on staff console (it has its own ops UI)
  if (path.startsWith("/staff")) return null;

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { who: "you", text: t, at: new Date().toISOString() }]);
    setText("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          who: "agent",
          text: "Thanks — a teammate will reply within 5 minutes.",
          at: new Date().toISOString(),
        },
      ]);
    }, 1200);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open live chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full gradient-primary text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-1 top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-background bg-success" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="fixed bottom-0 right-0 z-50 flex h-[88vh] w-full flex-col rounded-t-2xl border border-border bg-surface-raised shadow-2xl md:bottom-5 md:right-5 md:h-[560px] md:w-[360px] md:rounded-2xl"
            >
              <header className="flex items-center justify-between gap-3 border-b border-border p-4">
                <div>
                  <div className="text-sm font-semibold">Eagle Claims Support</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Online — replies in 5 min
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    className={[
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                      m.who === "agent"
                        ? "bg-muted text-foreground"
                        : "ml-auto gradient-primary text-primary-foreground",
                    ].join(" ")}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex items-center gap-2 border-t border-border p-3"
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                  className="h-11 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="grid h-11 w-11 place-items-center rounded-full gradient-primary text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
