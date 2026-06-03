import React, { useState, useRef, useEffect } from 'react';
import { QueueStats, ChatMessage } from '../types';
import { Send, Sparkles, MessageSquare, Bot, ArrowRight, CornerDownRight } from 'lucide-react';

interface StaffChatProps {
  stats: QueueStats;
}

export default function StaffChat({ stats }: StaffChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Assalomu alaykum! Toshkent Xalqaro Aeroporti (TAS Terminal 2) Aqlli Navbat Tizimi bo\'yicha maslahatchisiman. VIP va Oddiy yo\'lovchilarning qanday ajratilishi, CIP lounge, parvoz yo\'nalishlari hamda bagaj mezonlari haqida istalgan tilda so\'rang.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { text: "VIP va oddiy yo'lovchilar qanday ajratiladi?", label: "VIP va Oddiy farqi" },
    { text: "UzAirPlus VIP va CIP zallardan kimlar o'tadi?", label: "CIP lounge qoidalari" },
    { text: "HY-101 Nyu-York reysiga yuk (bagaj) qoidalari qanday?", label: "Bagaj mezonlari" },
    { text: "Hozirda VIP navbati qancha va kutish vaqti qanaqa?", label: "Hozirgi navbat statistikasi" }
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/api-assistant/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          contextState: { stats }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Uzr, serverda vaqtinchalik aloqa yo\'qoldi. Lekin qisqacha: VIP yo\'lovchilar avtomatik ravishda birinchi toifa/biznes klass chiptalari va UzAirPlus Gold loyallik maqomlari asosida alohida ajratilib, 1-sonli CIP tezkor darchasi orqali bevosita xizmat ko\'radilar!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col h-[525px] overflow-hidden rounded-2xl backdrop-blur-md">
      {/* Bot Chat Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 text-white flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-amber-500">
            <Bot className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-slate-100 flex items-center space-x-1 font-sans">
              <span>Toshkent Terminal 2 AI Maslahatchi</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Bilingual (UZ / EN) Agent</span>
          </div>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
          Gemini Pro
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed font-mono ${
                m.sender === 'user'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-tr-none'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <span
                className={`block text-[8px] mt-1 text-right font-mono ${
                  m.sender === 'user' ? 'text-blue-400/70' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%] flex items-center space-x-2 font-mono">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] text-slate-400">Terminal maslahatchisi javob tayyorlamoqda...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick click suggestions */}
      <div className="px-4 py-2 border-t border-slate-850 bg-slate-950 flex flex-wrap gap-1.5 overflow-x-auto max-h-[110px]">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q.text)}
            disabled={isLoading}
            className="text-[10px] bg-slate-900 hover:bg-blue-500/10 active:bg-blue-500/20 text-slate-400 hover:text-blue-400 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors font-mono cursor-pointer flex items-center space-x-1"
          >
            <CornerDownRight className="w-2.5 h-2.5 text-blue-500" />
            <span>{q.label}</span>
          </button>
        ))}
      </div>

      {/* Input controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 border-t border-slate-850 bg-slate-950 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder="Aeroport xizmatlari haqida so'rang..."
          className="flex-1 bg-slate-900 border border-slate-850 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-100 placeholder-slate-600 font-mono"
        />
        <button
          type="submit"
          disabled={(!inputValue.trim()) || isLoading}
          className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 rounded-xl disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
