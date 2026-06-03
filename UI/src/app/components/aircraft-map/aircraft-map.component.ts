import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Passenger, CheckInDesk, FlightInfo } from '../../models/queue.models';

@Component({
  selector: 'app-aircraft-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div id="aircraft-cabin-section" class="bg-slate-900/40 border border-slate-800 shadow-lg p-6 lg:p-8 rounded-2xl backdrop-blur-md space-y-6">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div class="flex items-center space-x-3">
          <div class="p-3 bg-blue-500/10 border border-blue-500/25 rounded-xl text-blue-400">
            <!-- Plane Icon -->
            <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white font-sans tracking-tight">
              Samolyot Saloni Seating Chart (Visual Cabin Map)
            </h2>
            <p class="text-xs text-slate-400 font-mono">Bilingual Interactive VIP Priority Seating Distribution</p>
          </div>
        </div>

        <!-- Filter Dropdown & Legend Toggle -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Flight Selector -->
          <div class="flex items-center space-x-2">
            <span class="text-xs text-slate-400 font-mono font-semibold uppercase">Reys:</span>
            <select
              [(ngModel)]="selectedFlight"
              class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL" class="bg-slate-900 text-slate-100">Barcha Reyslar (All)</option>
              <option *ngFor="let f of flights" [value]="f.flightNumber]" class="bg-slate-900 text-slate-100">
                {{ f.flightNumber }} ➔ {{ f.destination }}
              </option>
            </select>
          </div>

          <!-- Highlight mode / Toggle stats panel -->
          <button
            (click)="toggleSeatingView()"
            class="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Sikll: {{ showDetailedLayout ? 'Kengaytirilgan' : 'Kompakt' }}
          </button>
        </div>
      </div>

      <!-- Main Columns Grid: Layout on large screens -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        <!-- Left Column: Legend and Stats on Priority and Segment Rules -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-slate-950/50 border border-slate-850 rounded-xl p-4 space-y-4">
            <h3 class="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono border-b border-slate-850 pb-2">
              Seating Rules & Legend
            </h3>
            
            <p class="text-xs text-slate-400 leading-relaxed font-sans">
              Yo'lovchilar samolyot bo'limlariga darchada check-in qilingan vaqtda ularning 
              ijtimoiy maqomi va muhimligiga qarab quyidagicha taqsimlanadi:
            </p>

            <div class="space-y-3 font-mono text-xs">
              <!-- Tier 1: Diplomacy -->
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded bg-rose-500/30 border border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)] flex-shrink-0"></div>
                <div class="flex-1">
                  <span class="text-rose-400 font-bold block">1-Qator: Government/Diplomacy</span>
                  <span class="text-[10px] text-slate-500 block">Davlat delegatsiyalari & Diplomatlar</span>
                </div>
              </div>

              <!-- Tier 2: First Class -->
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded bg-amber-500/40 border border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] flex-shrink-0"></div>
                <div class="flex-1">
                  <span class="text-amber-400 font-bold block">2-Qator: First Class VIP</span>
                  <span class="text-[10px] text-slate-500 block">Birinchi toifali chipta egalari</span>
                </div>
              </div>

              <!-- Tier 3: CIP lounge guest -->
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/40 flex-shrink-0"></div>
                <div class="flex-1">
                  <span class="text-yellow-400 font-bold block">3-Qator: CIP Lounge Guests</span>
                  <span class="text-[10px] text-slate-500 block">Pullik CIP lounge mehmonlari</span>
                </div>
              </div>

              <!-- Tier 4: Business class -->
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/30 flex-shrink-0"></div>
                <div class="flex-1">
                  <span class="text-orange-400 font-bold block">4-Qator: Business Class</span>
                  <span class="text-[10px] text-slate-500 block">Biznes klass chiptasiga ega bo'lganlar</span>
                </div>
              </div>

              <!-- Tier 5: Premium Loyalty member -->
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded bg-violet-500/20 border border-violet-500/30 flex-shrink-0"></div>
                <div class="flex-1">
                  <span class="text-violet-400 font-bold block">5-Qator: Premium Loyalty Gold</span>
                  <span class="text-[10px] text-slate-500 block">UzAirPlus Gold & SkyTeam Elite</span>
                </div>
              </div>

              <!-- Tier 6+: Regular/Economy -->
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/30 flex-shrink-0"></div>
                <div class="flex-1">
                  <span class="text-blue-400 font-bold block">6-30-Qatorlar: Economy Coach</span>
                  <span class="text-[10px] text-slate-500 block">Ekonom-klass yo'lovchilari uchun (Orqa qism)</span>
                </div>
              </div>

              <!-- Empty seat status -->
              <div class="flex items-center space-x-3 pt-2 border-t border-slate-850">
                <div class="w-4 h-4 rounded bg-slate-900 border border-slate-800 flex-shrink-0"></div>
                <span class="text-[11px] text-slate-400">Bo'sh joylar (Empty and Available)</span>
              </div>
            </div>
          </div>

          <!-- Highlight Stats Panel -->
          <div class="bg-slate-950/50 border border-slate-850 rounded-xl p-4 space-y-3 font-mono text-xs">
            <h4 class="text-slate-300 font-bold uppercase tracking-wider pb-1 border-b border-slate-850">
              Cabin Statistics ({{ selectedFlight === 'ALL' ? 'Barcha Reyslar' : selectedFlight }})
            </h4>
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-855">
                <span class="text-[10px] text-slate-500 block">VIP BANDLIGI</span>
                <span class="text-base font-bold text-amber-500">{{ getVipSeatedCount() }} / 30</span>
              </div>
              <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-855">
                <span class="text-[10px] text-slate-500 block">EKONOM BANDLIGI</span>
                <span class="text-base font-bold text-blue-400">{{ getRegularSeatedCount() }} / 150</span>
              </div>
            </div>
            <div class="p-2 bg-slate-900/30 rounded-lg text-[10px] text-slate-400 leading-normal flex items-start space-x-2">
              <span class="text-amber-500">⚡</span>
              <span>Darchalarda navbatni <strong>Chaqirish</strong> va keyin <strong>Yakunlash</strong> buyruqlarini berganingizda, yo'lovchilar chiptalari bilan tegishli o'rindiqlariga avtomatik ravishda o'tiradilar.</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Visual Airplane Mockup -->
        <div class="lg:col-span-8 flex justify-center py-4 bg-slate-950/40 rounded-2xl border border-slate-850 overflow-hidden relative min-h-[500px]">
          
          <!-- Outer Fuselage graphic frame -->
          <div class="w-full max-w-lg mx-auto px-4 relative flex flex-col items-center">
            
            <!-- Nose Cone (Cockpit) representation -->
            <div class="w-[180px] h-[100px] bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-[100px] border-t-2 border-x-2 border-slate-700 flex flex-col justify-end items-center pb-4 space-y-1 relative shadow-lg">
              <div class="absolute top-6 flex space-x-6">
                <!-- Windshields -->
                <div class="w-10 h-4 bg-slate-950/60 border border-slate-700 rounded-tr-[5px] rounded-bl-[10px] -skew-x-[15deg]"></div>
                <div class="w-10 h-4 bg-slate-950/60 border border-slate-700 rounded-tl-[5px] rounded-br-[10px] skew-x-[15deg]"></div>
              </div>
              <span class="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">Flight Deck</span>
            </div>

            <!-- Fuselage Body Container with wings absolute background -->
            <div class="w-[260px] md:w-[280px] bg-slate-900/80 border-x-2 border-slate-700 py-6 relative shadow-2xl flex flex-col items-center">
              
              <!-- Left and Right Wings drawing (Only showing partially on borders overlay) -->
              <div class="absolute top-[220px] -left-[100px] w-[100px] h-[30px] bg-gradient-to-l from-slate-700 to-slate-855 rounded-l-full rotate-12 border-l border-t border-slate-600 pointer-events-none opacity-40"></div>
              <div class="absolute top-[220px] -right-[100px] w-[100px] h-[30px] bg-gradient-to-r from-slate-700 to-slate-855 rounded-r-full -rotate-12 border-r border-t border-slate-600 pointer-events-none opacity-40"></div>

              <!-- Internal Cabin Header -->
              <div class="w-full text-center pb-4 border-b border-dashed border-slate-800">
                <span class="text-[9px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-full text-amber-500 font-bold tracking-widest uppercase">
                  👑 VIP & FIRST CLASS CABIN (ROWS 1-5)
                </span>
              </div>

              <!-- Seating Grid layout -->
              <div class="p-4 w-full space-y-3 max-h-[420px] overflow-y-auto" id="seating-chart-container">
                
                <!-- Loop over Aircraft row list -->
                <div 
                  *ngFor="let row of getCabinRows()" 
                  class="flex items-center justify-between w-full"
                  [ngClass]="{
                    'py-1 bg-amber-500/5 rounded border border-amber-500/10 px-1': row <= 5,
                    'border-t border-dashed border-slate-800 pt-3 mt-3': row === 6
                  }"
                >
                  
                  <!-- Left Seats: A, B, C -->
                  <div class="flex space-x-1.5 justify-end flex-1 pr-3">
                    <div 
                      *ngFor="let letter of ['A', 'B', 'C']"
                      [id]="'seat-' + row + letter"
                      (click)="clickSeat(row, letter)"
                      class="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[9px] font-mono font-bold transition-all relative group cursor-pointer border"
                      [ngStyle]="getSeatStyles(row, letter)"
                    >
                      {{ letter }}
                      
                      <!-- Hover Tooltip detailing occupied user -->
                      <div 
                        *ngIf="getPassengerAtSeat(row, letter) as p"
                        class="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 w-48 bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-2xl z-[99] text-left leading-relaxed font-sans cursor-default pointer-events-none"
                      >
                        <div class="flex justify-between items-center mb-1.5 pb-1.5 border-b border-slate-850">
                          <span class="text-[9px] font-mono font-bold text-slate-400">Seat {{ row }}{{ letter }}</span>
                          <span 
                            class="text-[8px] font-mono font-bold px-1 py-0.2 rounded"
                            [ngClass]="p.class === 'VIP' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-800 text-slate-300'"
                          >
                            {{ p.class }}
                          </span>
                        </div>
                        <p class="text-[11px] font-bold text-slate-100 uppercase truncate mb-0.5">{{ p.name }}</p>
                        <div class="text-[9px] text-slate-400 space-y-0.5 font-mono">
                          <p>Reys: <strong class="text-white">{{ p.flightNumber }}</strong></p>
                          <p>Uchadi: <strong class="text-white">{{ p.destination }}</strong></p>
                          <p *ngIf="p.vipReason !== 'None'">Yoriq: <strong class="text-amber-400">{{ p.vipReason }}</strong></p>
                          <p>Bagaj: <strong class="text-emerald-400">{{ p.baggageWeight }} kg</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Aisle Index indicator -->
                  <div class="text-[10px] font-bold font-mono text-slate-500 min-w-[20px] text-center bg-slate-950 border border-slate-850 rounded py-0.5 shadow-sm">
                    {{ row }}
                  </div>

                  <!-- Right Seats: D, E, F -->
                  <div class="flex space-x-1.5 justify-start flex-1 pl-3">
                    <div 
                      *ngFor="let letter of ['D', 'E', 'F']"
                      [id]="'seat-' + row + letter"
                      (click)="clickSeat(row, letter)"
                      class="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[9px] font-mono font-bold transition-all relative group cursor-pointer border"
                      [ngStyle]="getSeatStyles(row, letter)"
                    >
                      {{ letter }}

                      <!-- Hover Tooltip detailing occupied user -->
                      <div 
                        *ngIf="getPassengerAtSeat(row, letter) as p"
                        class="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 w-48 bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-2xl z-[99] text-left leading-relaxed font-sans cursor-default pointer-events-none"
                      >
                        <div class="flex justify-between items-center mb-1.5 pb-1.5 border-b border-slate-850">
                          <span class="text-[9px] font-mono font-bold text-slate-400">Seat {{ row }}{{ letter }}</span>
                          <span 
                            class="text-[8px] font-mono font-bold px-1 py-0.2 rounded"
                            [ngClass]="p.class === 'VIP' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-800 text-slate-300'"
                          >
                            {{ p.class }}
                          </span>
                        </div>
                        <p class="text-[11px] font-bold text-slate-100 uppercase truncate mb-0.5">{{ p.name }}</p>
                        <div class="text-[9px] text-slate-400 space-y-0.5 font-mono">
                          <p>Reys: <strong class="text-white">{{ p.flightNumber }}</strong></p>
                          <p>Uchadi: <strong class="text-white">{{ p.destination }}</strong></p>
                          <p *ngIf="p.vipReason !== 'None'">Yoriq: <strong class="text-amber-400">{{ p.vipReason }}</strong></p>
                          <p>Bagaj: <strong class="text-emerald-400">{{ p.baggageWeight }} kg</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <!-- Tail separator -->
              <div class="w-full text-center pt-4 border-t border-dashed border-slate-800 mt-2">
                <span class="text-[8px] font-mono text-slate-600 block">Toshkent Aeroporti TAS - T2 Saloni</span>
              </div>
            </div>

            <!-- Tail and stabilizers design -->
            <div class="w-[100px] h-[50px] bg-slate-900 border-x-2 border-b-2 border-slate-700 rounded-b-3xl relative flex flex-col items-center justify-center">
              <div class="absolute -bottom-8 w-[14px] h-[40px] bg-slate-800 border-x border-b border-slate-600 rounded-b"></div>
              <div class="absolute -bottom-2 -left-12 w-[60px] h-[10px] bg-slate-800 rotate-12 border-l border-b border-slate-600 rounded-bl"></div>
              <div class="absolute -bottom-2 -right-12 w-[60px] h-[10px] bg-slate-800 -rotate-12 border-r border-b border-slate-600 rounded-br"></div>
              <span class="text-[8px] font-mono font-bold text-slate-600">Tail APU</span>
            </div>

          </div>
        </div>

      </div>

      <!-- Seating Passenger Inspection Detail Banner -->
      <div *ngIf="selectedPassenger" class="bg-slate-950/60 p-4 border border-blue-500/20 rounded-xl space-y-3 font-mono text-xs text-slate-300 animate-fadeIn">
        <div class="flex justify-between items-center pb-2 border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            <span class="font-bold text-white">Yo'lovchi Joylashuv Tafsiloti: Seat {{ selectedPassenger.seatAssignment }}</span>
          </div>
          <button 
            (click)="selectedPassenger = null"
            class="text-slate-500 hover:text-slate-300 font-bold p-1 cursor-pointer"
          >
            Sinchlash (Close) x
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 leading-normal">
          <div>
            <span class="text-[10px] text-slate-500 block">ISM-SHARIF:</span>
            <strong class="text-white text-sm uppercase">{{ selectedPassenger.name }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">REYS RAQAMI & YO'NALISH:</span>
            <strong>{{ selectedPassenger.flightNumber }} ➔ {{ selectedPassenger.destination }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">NAVBAL RAQAMI (TOKEN):</span>
            <strong class="text-amber-500">🏆 {{ selectedPassenger.queueNumber }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">YUK BORI (BAGGAGE):</span>
            <strong class="text-emerald-400">{{ selectedPassenger.baggageWeight }} kg</strong>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::-webkit-scrollbar {
      width: 4px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.4);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(51, 65, 85, 0.8);
      border-radius: 4px;
    }
  `]
})
export class AircraftMapComponent implements OnInit {
  @Input() desks: CheckInDesk[] = [];
  @Input() history: Passenger[] = [];
  @Input() flights: FlightInfo[] = [];

  selectedFlight: string = 'ALL';
  showDetailedLayout: boolean = false; // Toggle to only render up to Row 15, or all rows

  selectedPassenger: Passenger | null = null;

  ngOnInit(): void {}

  // Toggle rows count list for compact vs complete presentation
  toggleSeatingView(): void {
    this.showDetailedLayout = !this.showDetailedLayout;
  }

  // Generate sequence of rows
  getCabinRows(): number[] {
    const rows: number[] = [];
    // Always show rows 1 to 5 (VIP rows)
    for (let r = 1; r <= 5; r++) {
      rows.push(r);
    }
    // Economy rows are 6 to 30.
    // If compact view, show up to Row 15 to fit UI beautifully, else all rows up to 30
    const limit = this.showDetailedLayout ? 30 : 15;
    for (let r = 6; r <= limit; r++) {
      rows.push(r);
    }
    return rows;
  }

  // Cross reference desks current checked in passenger and finished boarding history
  getPassengerAtSeat(row: number, letter: string): Passenger | null {
    const seatCode = `${row}${letter}`;

    // 1. Search in open active check-in counters processing now
    for (const d of this.desks) {
      if (d.currentPassenger && d.currentPassenger.seatAssignment === seatCode) {
        if (this.selectedFlight === 'ALL' || d.currentPassenger.flightNumber === this.selectedFlight) {
          return d.currentPassenger;
        }
      }
    }

    // 2. Search in compiled done history
    for (const p of this.history) {
      if (p.seatAssignment === seatCode) {
        if (this.selectedFlight === 'ALL' || p.flightNumber === this.selectedFlight) {
          return p;
        }
      }
    }

    return null;
  }

  // Compute styling map according to passenger VIP reason or economy status
  getSeatStyles(row: number, letter: string): any {
    const passenger = this.getPassengerAtSeat(row, letter);

    if (!passenger) {
      // Empty seat styling
      return {
        'background-color': '#020617', // bg-slate-950
        'border-color': '#1e293b', // border-slate-800
        'color': '#475569' // text-slate-600
      };
    }

    // Occupied seat styling based on priority
    if (passenger.class === 'VIP') {
      const reason = passenger.vipReason;
      if (reason === 'Diplomacy/Gov') {
        return {
          'background-color': 'rgba(244, 63, 94, 0.2)', // rose
          'border-color': '#f43f5e',
          'color': '#f43f5e',
          'box-shadow': '0 0 10px rgba(244, 63, 94, 0.6)',
          'font-weight': 'bold',
          'transform': 'scale(1.05)'
        };
      } else if (reason === 'First Class') {
        return {
          'background-color': 'rgba(245, 158, 11, 0.25)', // amber
          'border-color': '#f59e0b',
          'color': '#f59e0b',
          'box-shadow': '0 0 8px rgba(245, 158, 11, 0.5)',
          'font-weight': 'bold'
        };
      } else if (reason === 'CIP Lounge Guest') {
        return {
          'background-color': 'rgba(234, 179, 8, 0.15)', // yellow
          'border-color': '#eab308',
          'color': '#eab308'
        };
      } else if (reason === 'Business Class') {
        return {
          'background-color': 'rgba(249, 115, 22, 0.15)', // orange
          'border-color': '#f97316',
          'color': '#f97316'
        };
      } else { // Premium Loyalty or standard VIP
        return {
          'background-color': 'rgba(139, 92, 246, 0.15)', // violet
          'border-color': '#8b5cf6',
          'color': '#8b5cf6'
        };
      }
    } else {
      // Regular passenger styling
      return {
        'background-color': 'rgba(59, 130, 246, 0.15)', // blue
        'border-color': '#3b82f6',
        'color': '#3b82f6'
      };
    }
  }

  // Count VIP passengers currently seated
  getVipSeatedCount(): number {
    let count = 0;
    for (let r = 1; r <= 5; r++) {
      for (const letter of ['A', 'B', 'C', 'D', 'E', 'F']) {
        if (this.getPassengerAtSeat(r, letter)) count++;
      }
    }
    return count;
  }

  // Count regular passengers currently seated
  getRegularSeatedCount(): number {
    let count = 0;
    // Walk rows 6 to 30
    for (let r = 6; r <= 30; r++) {
      for (const letter of ['A', 'B', 'C', 'D', 'E', 'F']) {
        if (this.getPassengerAtSeat(r, letter)) count++;
      }
    }
    return count;
  }

  // User click on a seat
  clickSeat(row: number, letter: string): void {
    const p = this.getPassengerAtSeat(row, letter);
    if (p) {
      this.selectedPassenger = p;
    } else {
      this.selectedPassenger = null;
    }
  }
}
