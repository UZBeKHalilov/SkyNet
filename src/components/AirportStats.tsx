import React from 'react';
import { QueueStats } from '../types';
import { Users, Clock, LogIn, Percent, Layers, Landmark } from 'lucide-react';

interface StatsProps {
  stats: QueueStats;
}

export default function AirportStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Pending VIP */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:bg-amber-500/15 transition-all">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono">VIP Kutilayotgan</span>
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/20">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-amber-500 font-mono tracking-tight">
            {stats.totalWaitingVIP}
          </span>
          <span className="text-[10px] text-amber-400/80 block mt-0.5 font-sans uppercase">CIP Navbati</span>
        </div>
      </div>

      {/* Pending Regular */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:bg-blue-500/15 transition-all">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">Oddiy Kutilayotgan</span>
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-blue-400 font-mono tracking-tight">
            {stats.totalWaitingRegular}
          </span>
          <span className="text-[10px] text-blue-400/80 block mt-0.5 font-sans uppercase">Ekonom Klass</span>
        </div>
      </div>

      {/* Average VIP wait time */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">VIP Kutish (O‘rtacha)</span>
          <div className="p-1.5 bg-slate-950 text-amber-500 rounded-lg border border-slate-800">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-white font-mono tracking-tight">
            ~{stats.averageWaitTimeVIP} <span className="text-xs font-normal text-slate-500">daq</span>
          </span>
          <span className="text-[10px] text-emerald-500 block mt-0.5 font-sans uppercase">-15% Optimal</span>
        </div>
      </div>

      {/* Average Regular wait time */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Oddiy Kutish (O‘rtacha)</span>
          <div className="p-1.5 bg-slate-950 text-blue-400 rounded-lg border border-slate-800">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-white font-mono tracking-tight">
            ~{stats.averageWaitTimeRegular} <span className="text-xs font-normal text-slate-500">daq</span>
          </span>
          <span className="text-[10px] text-rose-500 block mt-0.5 font-sans uppercase">+5% Yuqori</span>
        </div>
      </div>

      {/* Total Processed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Check-in Qilingan</span>
          <div className="p-1.5 bg-slate-950 text-emerald-400 rounded-lg border border-slate-800">
            <LogIn className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
            {stats.totalProcessedCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5 font-sans uppercase">Yo&apos;lovchilar jami</span>
        </div>
      </div>

      {/* Average Bag weight */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">O‘rtacha Bagaj</span>
          <div className="p-1.5 bg-slate-950 text-sky-400 rounded-lg border border-slate-800">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
            {stats.averageBaggageWeight} <span className="text-xs font-normal text-slate-500">kg</span>
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5 font-sans uppercase">Yo&apos;lovchi boshiga</span>
        </div>
      </div>
    </div>
  );
}
