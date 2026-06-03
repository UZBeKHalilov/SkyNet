import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightInfo } from '../../models/queue.models';

@Component({
  selector: 'app-passenger-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900/40 border border-slate-800 shadow-lg p-6 rounded-2xl backdrop-blur-md">
      <div class="flex justify-between items-center mb-5 pb-4 border-b border-slate-800">
        <h3 class="font-bold text-slate-100 flex items-center space-x-2 text-sm uppercase tracking-wider font-mono">
          <!-- UserPlus Icon -->
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 11v6M22 14h-6"/>
          </svg>
          <span>Navbatga Ro'yxatdan O'tkazish</span>
        </h3>
        
        <button
          (click)="triggerSimulateBulk()"
          [disabled]="isLoading"
          type="button"
          class="flex items-center space-x-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 text-amber-400 disabled:opacity-50 text-[11px] rounded-lg border border-amber-500/20 transition-colors font-semibold cursor-pointer font-mono"
        >
          <!-- Sparkles Icon -->
          <svg class="w-3.5 h-3.5 text-amber-500 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
          </svg>
          <span>Simulyatsiya (⚡ +5)</span>
        </button>
      </div>

      <form (submit)="onSubmit($event)" class="space-y-4">
        <!-- Error & Success Banners -->
        <div *ngIf="errorMsg" class="p-3 bg-red-950/40 text-red-400 text-xs rounded-xl flex items-center space-x-2 border border-red-900/30 font-mono">
          <!-- AlertCircle Icon -->
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{{ errorMsg }}</p>
        </div>

        <div *ngIf="successMsg" class="p-3 bg-emerald-950/40 text-emerald-400 text-xs rounded-xl flex items-center space-x-3 border border-emerald-900/30 font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <p>{{ successMsg }}</p>
        </div>

        <!-- Name Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">Ism-Sharif (Passportdagidek)</label>
          <input
            type="text"
            [(ngModel)]="name"
            name="name"
            [disabled]="isLoading"
            placeholder="Masalan: ABDULLA QODIRIY"
            class="w-full text-sm px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-100 placeholder-slate-600 bg-slate-950/80 font-mono uppercase"
          />
        </div>

        <!-- Flight Select -->
        <div>
          <label class="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">Parvoz (Flight) Yo'nalishi</label>
          <select
            [(ngModel)]="flightIndex"
            name="flightIndex"
            [disabled]="isLoading"
            class="w-full text-sm px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-100 bg-slate-950/80 font-mono"
          >
            <option *ngFor="let f of flights; let i = index" [value]="i" class="bg-slate-900 text-slate-100">
              {{ f.flightNumber }} — {{ f.destination }} ({{ f.departureTime }})
            </option>
          </select>
        </div>

        <!-- Baggage Range -->
        <div>
          <label class="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">Yuk og'irligi (Baggage KG)</label>
          <div class="flex items-center space-x-3">
            <input
              type="range"
              min="2"
              max="40"
              [(ngModel)]="baggageWeight"
              name="baggageWeight"
              [disabled]="isLoading"
              class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span class="text-xs font-bold font-mono px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 min-w-[55px] text-center">
              {{ baggageWeight }} kg
            </span>
          </div>
        </div>

        <!-- Class Selection -->
        <div>
          <label class="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">Xizmat Toifasi (Class)</label>
          <div class="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 border border-slate-850 rounded-xl">
            <button
              type="button"
              (click)="setPassengerClass('Regular')"
              class="py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer font-mono"
              [ngClass]="passengerClass === 'Regular' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'"
            >
              Oddiy (Economy)
            </button>
            <button
              type="button"
              (click)="setPassengerClass('VIP')"
              class="py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer font-mono"
              [ngClass]="passengerClass === 'VIP' ? 'bg-amber-500/15 border border-amber-500/20 text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-300'"
            >
              👑 VIP (CIP Class)
            </button>
          </div>
        </div>

        <!-- VIP Reason (Conditional) -->
        <div *ngIf="passengerClass === 'VIP'" class="pt-2">
          <label class="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">VIP Tasdiqlash Mezoni</label>
          <select
            [(ngModel)]="vipReason"
            name="vipReason"
            [disabled]="isLoading"
            class="w-full text-sm px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-slate-200 bg-slate-950/85 font-mono"
          >
            <option *ngFor="let r of vipReasons" [value]="r" class="bg-slate-900 text-slate-250">
              {{ r }}
            </option>
          </select>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="isLoading"
          class="w-full py-2.5 px-4 text-xs font-mono font-bold rounded-xl shadow-md border cursor-pointer uppercase transition-all tracking-wider"
          [ngClass]="passengerClass === 'VIP' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'"
        >
          {{ isLoading ? 'Iltimos kuting...' : (passengerClass === 'VIP' ? 'VIP (CIP) Navbatiga Qo‘shish' : 'Ekonom Navbatiga Qo‘shish') }}
        </button>
      </form>
    </div>
  `
})
export class PassengerFormComponent {
  @Input() flights: FlightInfo[] = [];
  @Input() isLoading: boolean = false;

  @Output() onAddPassenger = new EventEmitter<any>();
  @Output() onSimulateBulk = new EventEmitter<void>();

  // State bindings
  name: string = '';
  flightIndex: number = 0;
  baggageWeight: number = 18;
  passengerClass: 'VIP' | 'Regular' = 'Regular';
  vipReason: string = 'Business Class';

  // Warnings
  errorMsg: string | null = null;
  successMsg: string | null = null;

  vipReasons: string[] = [
    'Business Class',
    'First Class',
    'Premium Loyalty',
    'CIP Lounge Guest',
    'Diplomacy/Gov'
  ];

  setPassengerClass(pClass: 'VIP' | 'Regular'): void {
    this.passengerClass = pClass;
  }

  triggerSimulateBulk(): void {
    this.onSimulateBulk.emit();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.errorMsg = null;
    this.successMsg = null;

    if (!this.name.trim()) {
      this.errorMsg = 'Yo‘lovchi ism-sharifini yozishingiz shart.';
      return;
    }

    if (this.flights.length === 0) {
      this.errorMsg = 'Parvozlar ro‘yxati bo‘sh.';
      return;
    }

    const selectedFlight = this.flights[this.flightIndex];
    if (!selectedFlight) {
      this.errorMsg = 'Xato parvoz tanlandi.';
      return;
    }

    const payload = {
      name: this.name.toUpperCase().trim(),
      flightNumber: selectedFlight.flightNumber,
      destination: selectedFlight.destination,
      class: this.passengerClass,
      vipReason: this.passengerClass === 'VIP' ? this.vipReason : 'None',
      baggageWeight: this.baggageWeight
    };

    this.onAddPassenger.emit(payload);

    // Alert feedback
    this.successMsg = `${payload.name} muvaffaqiyatli ro‘yxatga qo‘shildi!`;
    this.name = '';

    // Auto clear success banner
    setTimeout(() => {
      this.successMsg = null;
    }, 4000);
  }
}
