import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

const WELCOME_MESSAGE = {
  role: 'assistant',
  text: "Hi! I'm the Nexus+ event assistant. Ask me things like \"any tech meetups this month?\" or \"workshops near downtown\" and I'll find matching events for you.",
};

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', text: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        currentMsg: trimmed,
        conversationHistory: nextMessages
          .filter((m) => m !== WELCOME_MESSAGE)
          .map((m) => ({ role: m.role, text: m.text })),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.data.reply,
          events: res.data.events || [],
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I ran into an issue answering that. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-[#f2ca77] text-black shadow-[0_8px_24px_rgba(242,202,119,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
        aria-label="Toggle chat assistant"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[200] w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-[#181a1d] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/[0.06] shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#f2ca77]/10 border border-[#f2ca77]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#f2ca77]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white">Nexus+ Assistant</div>
              <div className="text-[10px] text-white/40">Ask about events</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/30 hover:text-white/70 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#f2ca77]/10 border border-[#f2ca77]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#f2ca77]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] flex flex-col gap-2 ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#f2ca77] text-black rounded-br-sm'
                        : 'bg-white/[0.05] text-white/80 border border-white/[0.06] rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.events && m.events.length > 0 && (
                    <div className="flex flex-col gap-2 w-full">
                      {m.events.map((ev) => (
                        <div
                          key={ev._id}
                          className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-[11px]"
                        >
                          <div className="font-semibold text-white/90 mb-1">
                            {ev.title}
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-white/40">
                            {ev.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(ev.date).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            )}
                            {ev.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {ev.location}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-[#f2ca77]/10 border border-[#f2ca77]/20 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#f2ca77]" />
                </div>
                <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl rounded-bl-sm px-3.5 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-3 border-t border-white/[0.06] shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about an event..."
              className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-white/30 focus:ring-1 focus:ring-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 outline-none transition-all duration-200"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 shrink-0 rounded-xl bg-[#f2ca77] text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f2ca77]/90 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
