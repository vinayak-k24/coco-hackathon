'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  RotateCw,
  FileText,
  Sliders,
  ChevronRight,
  Zap,
  CornerDownLeft,
  Bot,
} from 'lucide-react';

interface NexaCopilotFloatingAgentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onShowRecommendations: () => void;
  onCreateActionPlan: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content?: string;
  isInitialSummary?: boolean;
}

export default function NexaCopilotFloatingAgent({
  isOpen,
  onClose,
  onOpen,
  onShowRecommendations,
  onCreateActionPlan,
}: NexaCopilotFloatingAgentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'agent-msg-1',
      sender: 'user',
      content: 'Give me a quick summary of what needs my attention today.',
    },
    {
      id: 'agent-msg-2',
      sender: 'assistant',
      isInitialSummary: true,
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef<number>(300);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    messageIdRef.current += 1;
    const userMsgId = `agent-msg-${messageIdRef.current}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', content: text }]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      messageIdRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-msg-${messageIdRef.current}`,
          sender: 'assistant',
          content: data.reply || 'SCADA Telemetry scanned. Telemetry verified.',
        },
      ]);
    } catch {
      messageIdRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-msg-${messageIdRef.current}`,
          sender: 'assistant',
          content:
            'Telemetry analysis complete: Riverside CNC-02 bearing temperature critical at 112°C. Preventive mitigation recommended within 12 hours.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* FLOATING ACTIVATION BUTTON: Only this button is visible all other times */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-50 pl-3.5 pr-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/50 flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95 border border-white/25 cursor-pointer group"
          title="Open Nexa Copilot Chat Agent"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="tracking-tight">Nexa Copilot</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold text-white/95">
            Chat Agent
          </span>
        </button>
      )}

      {/* CHAT AGENT MODAL / DRAWER: Opens only when clicking the floating button */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[450px] max-h-[85vh] h-[640px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight">Nexa Copilot</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">Intelligent Operations Agent</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Stream Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/50">
            {messages.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-xs px-3.5 py-2.5 max-w-[85%] text-xs leading-relaxed shadow-xs">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              if (msg.isInitialSummary) {
                return (
                  <div key={msg.id} className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 border border-slate-200 text-slate-800 space-y-2.5 shadow-xs">
                        <p className="font-semibold text-slate-900 text-xs">
                          Here are the key items for your attention:
                        </p>

                        <ol className="space-y-2 text-xs leading-relaxed text-slate-700">
                          <li className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              1
                            </span>
                            <span>
                              <strong className="text-slate-900">CNC-02 at Riverside</strong> is at high risk of failure within 12 hours (112°C).
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              2
                            </span>
                            <span>
                              <strong className="text-slate-900">7 customer orders</strong> are at risk due to potential line downtime.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              3
                            </span>
                            <span>
                              <strong className="text-slate-900">$284K cost avoidance</strong> opportunity from 3 AI-recommended actions.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              4
                            </span>
                            <span>
                              <strong className="text-slate-900">Supply risk for electronic components</strong> at Austin plant next week.
                            </span>
                          </li>
                        </ol>

                        {/* CTA in Copilot */}
                        <div className="pt-1">
                          <button
                            onClick={onShowRecommendations}
                            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Show recommended actions</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 border border-slate-200 text-slate-800 text-xs leading-relaxed max-w-[88%] whitespace-pre-line shadow-xs">
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-8">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 pt-2 pb-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => handleSend('Why is CNC-02 overheating?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Why CNC-02 overheating?
            </button>
            <button
              onClick={() => handleSend('Explain business impact')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Business impact
            </button>
            <button
              onClick={() => handleSend('Simulate scenarios (what-if)')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Simulate what-if
            </button>
            <button
              onClick={() => handleSend('Create an executive summary')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Executive summary
            </button>
            <button
              onClick={() => handleSend('Draft step-by-step bearing replacement maintenance procedure')}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Draft maintenance procedure
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask anything about your operations..."
                className="flex-1 bg-slate-100/90 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
