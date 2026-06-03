import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-policy-explainer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="policy-explainer-section" class="bg-slate-900/40 border border-slate-800 shadow-lg p-6 lg:p-8 rounded-2xl backdrop-blur-md mt-10">
      <div class="flex items-center space-x-3 mb-6">
        <div class="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
          <!-- Award Icon -->
          <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white font-sans tracking-tight">
            VIP va Oddiy Yo'lovchilarni Ajratish Strategiyasi
          </h2>
          <p class="text-xs text-slate-400 font-mono">Tashkent International Airport (TAS) Qoidalari</p>
        </div>
      </div>

      <p class="text-sm text-slate-300 mb-6 leading-relaxed">
        Toshkent Xalqaro Aeroportida yo'lovchilar oqimini tartibga solish va xizmat sifatini oshirish maqsadida, 
        VIP va oddiy yo'lovchilarga xizmat ko'rsatish jarayonlari quyidagi parametrlarga ko'ra ajratiladi:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-amber-500 font-mono tracking-wider uppercase">
            1. Tashkiliy Ajratish Mezonlari (Identification)
          </h3>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="mt-1 p-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <!-- Briefcase Icon -->
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-medium text-slate-100">Chipta Toifasi (Ticket Class)</h4>
                <p class="text-xs text-slate-400">First Class va Business Class chiptasiga ega bo'lgan yo'lovchilar.</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="mt-1 p-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <!-- Star Icon -->
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-medium text-slate-100">Loylallik Maqomi (Frequent Flyer)</h4>
                <p class="text-xs text-slate-400">Uzbekistan Airways "UzAirPlus" dasturining Premium Gold/Silver yoki SkyTeam Elite a'zolari.</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="mt-1 p-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <!-- Compass Icon -->
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-medium text-slate-100">CIP Lounge Xizmatlari</h4>
                <p class="text-xs text-slate-400">Toshkent aeroportining pullik CIP zaliga kirish ruxsatnomasini sotib olgan mehmonlar.</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="mt-1 p-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <!-- ShieldAlert Icon -->
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-medium text-slate-100">Diplomatik Ruxsatnoma</h4>
                <p class="text-xs text-slate-400">Davlat delegatsiyalari hamda diplomatik pasportga ega yo'lovchilar.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-blue-400 font-mono tracking-wider uppercase">
            2. Xizmat Ko'rsatish Farqlari (Priority Management)
          </h3>

          <div class="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div class="flex items-start space-x-2.5">
              <div class="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              <p class="text-xs text-slate-300">
                <strong class="text-white">Mustaqil Yo'lak (CIP Hall):</strong> VIP yo'lovchilar aeroportga uchrashganda alohida terminal yoki umumiy zaldagi 1 &amp; 2-sonli maxsus darchalarga yo'naltirilされます。
              </p>
            </div>

            <div class="flex items-start space-x-2.5">
              <div class="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              <p class="text-xs text-slate-300">
                <strong class="text-white">Prioritetli Bagaj Yuklari:</strong> VIP bagajlariga yorqin to'q-sariq rangli <span class="text-amber-400 font-bold">"PRIORITY"</span> teglari taqiladi va samolyotdan tushirilganda birinchi yetkaziladi.
              </p>
            </div>

            <div class="flex items-start space-x-2.5">
              <div class="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              <p class="text-xs text-slate-300">
                <strong class="text-white">Dynamic Counter Dispatching:</strong> Dasturimizda barcha VIP darchalar faqat VIP navbatdagilarga xizmat ko'rsatadi. Biroq VIP navbat bo'sh bo'lsa, Priority rejimidagi darchalar oddiy yo'lovchilarga yordamga keladi (va aksincha).
              </p>
            </div>

            <div class="flex items-start space-x-2.5">
              <div class="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              <p class="text-xs text-slate-300">
                <strong class="text-white">VIP Transfer:</strong> Shaxsiy o'tirgichlar, CIP zali hamda samolyotgacha maxsus avtobuslar / yuk guruh xizmatlari ajratiladi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PolicyExplainerComponent {}
