import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Dumbbell, Zap } from 'lucide-react';
import { api } from '../services/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AICoachPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Greetings! I am your OmniGym FitZone AI Performance Assistant. How can I assist you today with workout plans, nutrition macronutrients, or facility operations optimization?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/coach', { prompt: userMsg });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.response }]);
    } catch (err) {
      // Fallback response if offline or mock
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Based on your request regarding "${userMsg}", I recommend focusing on progressive overload with a 4-day push-pull-legs split and maintaining a caloric surplus of 300 kcal for lean muscle hypertrophy.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-3 h-3" /> Gemini 1.5 Pro Fitness Intelligence
          </div>
          <h1 className="text-2xl font-serif italic text-white">AI Fitness Coach</h1>
        </div>
      </div>

      <div className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
        {/* Chat log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-black font-medium'
                    : 'bg-white/5 border border-white/10 text-gray-200'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-gray-800 text-amber-500 flex items-center justify-center font-bold shrink-0 border border-white/10">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400 italic">
                Analyzing biomechanics and generating recommendation...
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Coach for a customized workout, nutrition plan, or bio-breakdown..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            Send <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
