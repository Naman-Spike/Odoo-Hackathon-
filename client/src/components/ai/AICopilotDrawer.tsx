import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Trash2, 
  Copy, 
  Check, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { AIPromptSuggestions } from './AIPromptSuggestions';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: { label: string; url?: string; actionType?: string }[];
}

export const AICopilotDrawer: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.profile?.firstName || 'there'}! I am **Dayflow AI Copilot**, your real-time HR & workforce intelligence assistant. You can ask me about your leave balances, drafted time-off notes, payroll breakdown, attendance telemetry, or policy guidelines.`,
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Ctrl+K / Cmd+K) to open/close AI Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/query', {
        query: queryText,
        history: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
      });

      const aiReply = res.data.response || res.data.answer || 'I have analyzed your organization telemetry.';
      const actions = res.data.actions || [];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiReply,
        timestamp: new Date(),
        actions
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ ${err.response?.data?.error || 'Unable to connect to Dayflow AI engine. Please verify that the backend server is running.'}`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat session refreshed. How can I assist you with Dayflow HRMS today?`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-black text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_12px_32px_rgba(0,0,0,0.25)] hover:bg-zinc-900 transition-all duration-300 hover:scale-105 cursor-pointer group select-none border border-black/80"
        title="Open Dayflow AI Copilot (Ctrl+K)"
      >
        <div className="relative">
          <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
        </div>
        <span className="text-xs font-black tracking-tight font-sans">AI Copilot</span>
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-mono text-zinc-300 border border-white/20">
          ⌘K
        </kbd>
      </button>

      {/* Slide-over Liquid Glass AI Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div
              className={`w-screen transition-all duration-300 ease-out transform ${
                isExpanded ? 'max-w-3xl' : 'max-w-lg'
              }`}
            >
              <div className="h-full flex flex-col bg-gradient-to-br from-white/95 via-white/90 to-white/80 backdrop-blur-3xl shadow-2xl border-l border-white/90 specular-highlight">
                
                {/* Header Strip */}
                <div className="p-4 sm:p-5 border-b border-white/80 bg-white/40 backdrop-blur-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-black flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.2)]">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-zinc-900 tracking-tight font-sans">
                          Dayflow AI Copilot
                        </h2>
                        <span className="text-[9px] font-mono font-bold text-zinc-900 bg-white/80 px-2 py-0.5 rounded-full border border-white/90 shadow-sm">
                          GenAI 2.0
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Real-time HR analytics & conversational assistant
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
                      title={isExpanded ? 'Collapse Drawer' : 'Expand Drawer'}
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleClearHistory}
                      className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer"
                      title="Clear Conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans select-text">
                  {messages.map((m) => {
                    const isAi = m.role === 'assistant';
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                      >
                        {isAi && (
                          <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className={`max-w-[85%] space-y-2`}>
                          <div
                            className={`p-3.5 rounded-3xl text-xs leading-relaxed transition-all ${
                              isAi
                                ? 'bg-white/85 text-zinc-900 border border-white/95 shadow-[inset_0_1.5px_1px_rgba(255,255,255,1),0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-xl'
                                : 'bg-black text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_18px_rgba(0,0,0,0.15)]'
                            }`}
                          >
                            {/* Render Markdown-like bold and line breaks cleanly */}
                            <div className="whitespace-pre-wrap font-sans">
                              {m.content.split('\n').map((line, lIdx) => (
                                <p key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>
                                  {line}
                                </p>
                              ))}
                            </div>

                            {/* Assistant Copy Utility */}
                            {isAi && m.id !== 'welcome' && (
                              <div className="flex justify-end pt-2 mt-2 border-t border-zinc-100/80">
                                <button
                                  onClick={() => handleCopy(m.id, m.content)}
                                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-800 transition-colors font-mono cursor-pointer"
                                >
                                  {copiedId === m.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-black" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy response</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {!isAi && (
                          <div className="w-7 h-7 rounded-xl bg-zinc-200 text-zinc-800 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/80 border border-white/90 text-xs text-zinc-500 font-mono flex items-center gap-2 backdrop-blur-xl shadow-sm">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                        <span>Analyzing organization telemetry...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions Section */}
                <div className="px-4 sm:px-6 pt-2 pb-1 border-t border-white/80 bg-white/30 backdrop-blur-md">
                  <AIPromptSuggestions
                    isAdmin={!!isAdmin}
                    onSelectPrompt={(p) => handleSendMessage(p)}
                  />
                </div>

                {/* Chat Input Box */}
                <div className="p-4 sm:p-5 border-t border-white/80 bg-white/60 backdrop-blur-2xl">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="relative flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Dayflow AI anything..."
                      disabled={isLoading}
                      className="flex-1 bg-white/90 border border-white/95 rounded-2xl px-4 py-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black shadow-[inset_0_1.5px_1px_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all"
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!input.trim() || isLoading}
                      icon={Send}
                      className="px-4 py-3 rounded-2xl font-mono text-xs shadow-md"
                    >
                      Ask
                    </Button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
