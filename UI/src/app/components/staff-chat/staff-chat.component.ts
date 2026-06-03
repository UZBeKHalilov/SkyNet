import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, QueueStats } from '../../models/queue.models';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-staff-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col h-[525px] overflow-hidden rounded-2xl backdrop-blur-md">
      <!-- Bot Chat Header -->
      <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 text-white flex justify-between items-center border-b border-slate-800">
        <div class="flex items-center space-x-2.5">
          <div class="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-amber-500">
            <!-- Bot / Smart Indicator -->
            <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h8"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-sm tracking-tight text-slate-100 flex items-center space-x-1 font-sans">
              <span>Toshkent Terminal 2 AI Maslahatchi</span>
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <span class="text-[10px] text-slate-400 font-mono">Bilingual (UZ / EN) Agent</span>
          </div>
        </div>
        <span class="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
          Gemini Pro
        </span>
      </div>

      <!-- Chat History Container -->
      <div #chatContainer class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80">
        <div 
          *ngFor="let m of messages" 
          class="flex"
          [ngClass]="m.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed font-mono"
            [ngClass]="m.sender === 'user' 
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-tr-none' 
              : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'"
          >
            <div class="whitespace-pre-line">{{ m.text }}</div>
            <span 
              class="block text-[8px] mt-1 text-right font-mono"
              [ngClass]="m.sender === 'user' ? 'text-blue-400/70' : 'text-slate-500'"
            >
              {{ m.timestamp }}
            </span>
          </div>
        </div>

        <!-- Loader Bubble -->
        <div *ngIf="isLoading" class="flex justify-start">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%] flex items-center space-x-2 font-mono">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span class="text-10px text-slate-400">Terminal maslahatchisi javob tayyorlamoqda...</span>
          </div>
        </div>
      </div>

      <!-- Quick Clicks Action Panel -->
      <div class="px-4 py-2 border-t border-slate-850 bg-slate-950 flex flex-wrap gap-1.5 overflow-x-auto max-h-[110px]">
        <button
          *ngFor="let q of quickQuestions"
          (click)="askQuestion(q.text)"
          [disabled]="isLoading"
          type="button"
          class="text-[10px] bg-slate-900 hover:bg-blue-500/10 active:bg-blue-500/20 text-slate-400 hover:text-blue-400 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors font-mono cursor-pointer flex items-center space-x-1"
        >
          <!-- CornerDownRight Icon -->
          <svg class="w-2.5 h-2.5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7"/>
          </svg>
          <span>{{ q.label }}</span>
        </button>
      </div>

      <!-- Footer Message Input form -->
      <form 
        (submit)="handleFormSubmit($event)" 
        class="p-3 border-t border-slate-850 bg-slate-950 flex items-center space-x-2"
      >
        <input
          type="text"
          [(ngModel)]="inputValue"
          name="inputValue"
          [disabled]="isLoading"
          placeholder="Aeroport xizmatlari haqida so'rang..."
          class="flex-1 bg-slate-900 border border-slate-850 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-100 placeholder-slate-600 font-mono"
        />
        <button
          type="submit"
          [disabled]="isLoading"
          class="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 rounded-xl disabled:opacity-40 transition-colors cursor-pointer"
        >
          <!-- Send Icon -->
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>
  `
})
export class StaffChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  inputValue: string = '';
  isLoading: boolean = false;

  quickQuestions = [
    { label: "VIP vs Ekonom Farqlari?", text: "Tizimda VIP va oddiy yo'lovchilar qanday ajratiladi?" },
    { label: "Bagaj Standart Qoidalari?", text: "Toshkent aeroportida Uzbekistan Airways bagaj limits qanday?" },
    { label: "Nyu York HY-101 reysi?", text: "HY-101 reysi haqida ma'lumot bering." }
  ];

  constructor(private queueService: QueueService) {}

  ngOnInit(): void {
    // Inject welcoming starting messages
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages = [
      {
        sender: 'ai',
        text: `Xush kelibsiz! Men Toshkent Xalqaro Aeroporti (TAS - Terminal 2) maslahatchisiman.

Sizga quyidagi sohalar bo’yicha yordam bera olaman:
• 👑 VIP va oddiy yo'lovchilarning farqlanish mezonlari;
• 🛄 Uzbekistan Airways uchun yuk va bagaj me'yorlari;
• ✈️ Reyslar bo'yicha ma'lumotlar.

Nimani bilmoqchisiz? Savolingizni yozing yoki pastdagi namunalardan birini tanlang.`,
        timestamp: now
      }
    ];
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  askQuestion(text: string): void {
    if (this.isLoading) return;
    this.isLoading = true;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add User Message
    this.messages.push({
      sender: 'user',
      text,
      timestamp: timeString
    });

    // Fire HTTP to queueService
    this.queueService.askChatAssistant(text).subscribe({
      next: (res) => {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.messages.push({
          sender: 'ai',
          text: res.text || 'Kechirasiz, ma’lumot olishda xatolik yuz berdi.',
          timestamp: timeNow
        });
        this.isLoading = false;
      },
      error: () => {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.messages.push({
          sender: 'ai',
          text: 'Tarmoq xatoli kuzatildi. Server (C# API) bilan ulanishni tekshiring.',
          timestamp: timeNow
        });
        this.isLoading = false;
      }
    });
  }

  handleFormSubmit(event: Event): void {
    event.preventDefault();
    const text = this.inputValue.trim();
    if (!text) return;
    this.inputValue = '';
    this.askQuestion(text);
  }
}
