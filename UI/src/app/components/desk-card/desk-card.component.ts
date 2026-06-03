import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckInDesk } from '../../models/queue.models';

@Component({
  selector: 'app-desk-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="bg-slate-900/40 border transition-all duration-300 rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md relative overflow-hidden h-[310px]"
      [ngClass]="{
        'border-amber-500/30 ring-1 ring-amber-500/10': desk.type === 'VIP' && desk.status === 'Processing',
        'border-blue-500/25': desk.type !== 'VIP' && desk.status === 'Processing',
        'border-slate-800 opacity-90': desk.status !== 'Processing',
        'opacity-50 border-dashed border-slate-900 bg-slate-950/25': desk.status === 'Closed'
      }"
    >
      <!-- Background watermark card -->
      <div class="absolute -right-6 -bottom-8 opacity-[0.03] select-none text-white font-bold font-display text-8xl pointer-events-none">
        0{{ desk.id }}
      </div>

      <!-- Card Top Info Header -->
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <div class="flex items-center space-x-1.5">
            <h3 class="font-bold text-xs uppercase tracking-wide text-slate-100 font-mono">{{ desk.name }}</h3>
            <span 
              *ngIf="desk.type === 'VIP'" 
              class="text-[8px] font-mono bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.2 rounded-full border border-amber-500/30"
            >
              VIP
            </span>
            <span 
              *ngIf="desk.type === 'Priority'" 
              class="text-[8px] font-mono bg-blue-500/20 text-blue-300 font-semibold px-1.5 py-0.2 rounded-full border border-blue-500/30"
            >
              PRIORITY
            </span>
          </div>
          <span class="text-[10px] text-slate-500 font-mono">Darcha ID: Desk-00{{ desk.id }}</span>
        </div>

        <!-- Status Tag indicators -->
        <span 
          class="text-[9px] px-2 py-0.5 rounded-full font-bold border font-mono tracking-wider"
          [ngClass]="{
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': desk.status === 'Idle',
            'bg-amber-500/15 text-amber-400 border-amber-500/25 animate-pulse': desk.status === 'Processing',
            'bg-blue-500/15 text-blue-400 border-blue-500/20': desk.status === 'Open',
            'bg-rose-500/10 text-rose-400 border-rose-500/20': desk.status === 'Closed'
          }"
        >
          ● {{ desk.status }}
        </span>
      </div>

      <!-- Current Processing Passenger Body -->
      <div class="my-4 flex-1 flex flex-col justify-center">
        <!-- CLOSED CORE IF -->
        <div *ngIf="desk.status === 'Closed'" class="text-center py-5 space-y-1 font-mono text-slate-600">
          <p class="text-xs uppercase tracking-wider font-bold">Xizmat To'xtatilgan</p>
          <p class="text-[10px]">Ushbu darcha hozirda offline holatda</p>
        </div>

        <!-- IDLE CORE IF -->
        <div *ngIf="desk.status === 'Idle'" class="text-center py-5 space-y-1 font-mono text-slate-500">
          <p class="text-xs uppercase font-bold tracking-tight text-emerald-500/70">Navbat Kutilmoqda</p>
          <p class="text-[10px]">Yangi yo'lovchini chaqirishga tayyor</p>
        </div>

        <!-- ACTIVE PASSENGER CORE IF -->
        <div *ngIf="desk.status === 'Processing' && desk.currentPassenger" class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 space-y-2">
          <div class="flex justify-between items-center pb-2 border-b border-dashed border-slate-800">
            <div>
              <span class="text-[9px] text-slate-500 block uppercase font-mono">Yo'lovchi</span>
              <span class="text-xs font-bold font-sans text-slate-200 uppercase tracking-tight">{{ desk.currentPassenger.name }}</span>
            </div>
            <span 
              class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
              [ngClass]="desk.currentPassenger.class === 'VIP' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'"
            >
              #{{ desk.currentPassenger.queueNumber }}
            </span>
          </div>

          <!-- Bottom detailed grid -->
          <div class="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
            <div>
              <span class="text-[8px] text-slate-600 block uppercase">Reys</span>
              <span class="font-bold text-slate-300">{{ desk.currentPassenger.flightNumber }}</span>
            </div>
            <div>
              <span class="text-[8px] text-slate-600 block uppercase">O'rindiq</span>
              <span class="font-bold text-emerald-400">{{ desk.currentPassenger.seatAssignment || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-[8px] text-slate-600 block uppercase">Yuk</span>
              <span class="font-bold text-slate-300">{{ desk.currentPassenger.baggageWeight }}kg</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card footer statistics / actions triggers -->
      <div class="pt-3 border-t border-slate-850/60 flex items-center justify-between">
        <div class="flex items-center space-x-2 font-mono text-[9px] text-slate-500">
          <span>Processed: <strong>{{ desk.processedCount }}</strong></span>
          <span>•</span>
          <span>Speed: <strong>{{ desk.averageProcessingTime }}s</strong></span>
        </div>

        <!-- Buttons Panel matching desk operational statuses -->
        <div class="flex items-center space-x-1.5">
          <!-- Toggle online close/open -->
          <button
            (click)="triggerToggle()"
            [disabled]="isLoading"
            type="button"
            class="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-850 rounded-lg cursor-pointer transition-colors"
            title="Darchani yoqish/o'chirish"
          >
            <!-- Power Icon -->
            <svg class="w-3.5 h-3.5" [ngClass]="{'text-rose-500': desk.status !== 'Closed', 'text-slate-500': desk.status === 'Closed'}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/>
            </svg>
          </button>

          <!-- CALL PASSENGER: IF open/idle -->
          <button
            *ngIf="desk.status !== 'Closed' && desk.status !== 'Processing'"
            (click)="triggerCall()"
            [disabled]="isLoading"
            type="button"
            class="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 hover:border-blue-500/40 text-blue-400 font-mono text-[10px] font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1"
          >
            <!-- ArrowRight Icon -->
            <span>Chaqirish</span>
          </button>

          <!-- COMPLETE: IF processing -->
          <button
            *ngIf="desk.status === 'Processing'"
            (click)="triggerComplete()"
            [disabled]="isLoading"
            type="button"
            class="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1"
          >
            <!-- CheckSquare Icon -->
            <span>Yakunlash</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DeskCardComponent {
  @Input({ required: true }) desk!: CheckInDesk;
  @Input() isLoading: boolean = false;

  @Output() onCallPassenger = new EventEmitter<number>();
  @Output() onCompletePassenger = new EventEmitter<number>();
  @Output() onToggleDesk = new EventEmitter<number>();

  triggerCall(): void {
    this.onCallPassenger.emit(this.desk.id);
  }

  triggerComplete(): void {
    this.onCompletePassenger.emit(this.desk.id);
  }

  triggerToggle(): void {
    this.onToggleDesk.emit(this.desk.id);
  }
}
