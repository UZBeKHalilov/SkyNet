import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueStats } from '../../models/queue.models';

@Component({
  selector: 'app-airport-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
      <!-- Pending VIP -->
      <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:bg-amber-500/15 transition-all">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono">VIP Kutilayotgan</span>
          <div class="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/20">
            <!-- Layers Icon -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-2xl font-bold text-amber-500 font-mono tracking-tight">
            {{ stats.totalWaitingVIP }}
          </span>
          <span class="text-[10px] text-amber-400/80 block mt-0.5 font-sans uppercase">CIP Navbati</span>
        </div>
      </div>

      <!-- Pending Regular -->
      <div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:bg-blue-500/15 transition-all">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">Oddiy Kutilayotgan</span>
          <div class="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20">
            <!-- Users Icon -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-2xl font-bold text-blue-400 font-mono tracking-tight">
            {{ stats.totalWaitingRegular }}
          </span>
          <span class="text-[10px] text-blue-400/80 block mt-0.5 font-sans uppercase">Ekonom Klass</span>
        </div>
      </div>

      <!-- Avg Wait VIP -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">VIP Kutish (O‘rtacha)</span>
          <div class="p-1.5 bg-slate-950 text-amber-500 rounded-lg border border-slate-800">
            <!-- Clock Icon -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-2xl font-bold text-white font-mono tracking-tight">
            ~{{ stats.averageWaitTimeVIP }} <span class="text-xs font-normal text-slate-500">daq</span>
          </span>
          <span class="text-[10px] text-emerald-500 block mt-0.5 font-sans uppercase">-15% Optimal</span>
        </div>
      </div>

      <!-- Avg Wait Regular -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Oddiy Kutish (O‘rtacha)</span>
          <div class="p-1.5 bg-slate-950 text-blue-400 rounded-lg border border-slate-800">
            <!-- Clock Icon -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-2xl font-bold text-white font-mono tracking-tight">
            ~{{ stats.averageWaitTimeRegular }} <span class="text-xs font-normal text-slate-500">daq</span>
          </span>
          <span class="text-[10px] text-rose-500 block mt-0.5 font-sans uppercase">+5% Yuqori</span>
        </div>
      </div>

      <!-- Checked In Total -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Check-in Qilingan</span>
          <div class="p-1.5 bg-slate-950 text-emerald-400 rounded-lg border border-slate-800">
            <!-- LogIn Icon -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-2xl font-bold text-slate-100 font-mono tracking-tight">
            {{ stats.totalProcessedCount }}
          </span>
          <span class="text-[10px] text-slate-500 block mt-0.5 font-sans uppercase">Yo'lovchilar jami</span>
        </div>
      </div>

      <!-- Average Baggage -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">O‘rtacha Bagaj</span>
          <div class="p-1.5 bg-slate-950 text-sky-400 rounded-lg border border-slate-800">
            <!-- Landmark Icon -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 2 7 22 7 12 2"/>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-2xl font-bold text-slate-100 font-mono tracking-tight">
            {{ stats.averageBaggageWeight }} <span class="text-xs font-normal text-slate-500">kg</span>
          </span>
          <span class="text-[10px] text-slate-500 block mt-0.5 font-sans uppercase">Yo'lovchi boshiga</span>
        </div>
      </div>
    </div>
  `
})
export class AirportStatsComponent {
  @Input({ required: true }) stats!: QueueStats;
}
