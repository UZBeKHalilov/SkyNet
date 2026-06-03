import React from 'react';
import { Award, ShieldAlert, Star, Briefcase, Zap, Compass } from 'lucide-react';

export default function PolicyExplainer() {
  return (
    <div id="policy-explainer-section" className="bg-slate-900/40 border border-slate-800 shadow-lg p-6 lg:p-8 rounded-2xl backdrop-blur-md">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
          <Award className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">
            VIP va Oddiy Yo&apos;lovchilarni Ajratish Strategiyasi
          </h2>
          <p className="text-xs text-slate-400 font-mono">Tashkent International Airport (TAS) Qoidalari</p>
        </div>
      </div>

      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        Toshkent Xalqaro Aeroportida yo&apos;lovchilar oqimini tartibga solish va xizmat sifatini oshirish maqsadida, 
        VIP va oddiy yo&apos;lovchilarga xizmat ko&apos;rsatish jarayonlari quyidagi parametrlarga ko&apos;ra ajratiladi:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-amber-500 font-mono tracking-wider uppercase">
            1. Tashkiliy Ajratish Mezonlari (Identification)
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="mt-1 p-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <Briefcase className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-100">Chipta Toifasi (Ticket Class)</h4>
                <p className="text-xs text-slate-400">First Class va Business Class chiptasiga ega bo&apos;lgan yo&apos;lovchilar.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-1 p-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-100">Loylallik Maqomi (Frequent Flyer)</h4>
                <p className="text-xs text-slate-400">Uzbekistan Airways &quot;UzAirPlus&quot; dasturining Premium Gold/Silver yoki SkyTeam Elite a&apos;zolari.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-1 p-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <Compass className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-100">CIP Lounge Xizmatlari</h4>
                <p className="text-xs text-slate-400">Toshkent aeroportining pullik CIP zaliga kirish ruxsatnomasini sotib olgan mehmonlar.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-1 p-1 bg-amber-500/10 border border-amber-500/20 rounded">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-100">Diplomatik Ruxsatnoma</h4>
                <p className="text-xs text-slate-400">Davlat delegatsiyalari hamda diplomatik pasportga ega yo&apos;lovchilar.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-400 font-mono tracking-wider uppercase">
            2. Xizmat Ko&apos;rsatish Farqlari (Priority Management)
          </h3>

          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-start space-x-2.5">
              <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
              <p className="text-xs text-slate-300">
                <strong className="text-white">Mustaqil Yo&apos;lak (CIP Hall):</strong> VIP yo&apos;lovchilar aeroportga uchrashganda alohida terminal yoki umumiy zaldagi 1 &amp; 2-sonli maxsus darchalarga yo&apos;naltiriladi.
              </p>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
              <p className="text-xs text-slate-300">
                <strong className="text-white">Prioritetli Bagaj Yuklari:</strong> VIP bagajlariga yorqin to&apos;q-sariq rangli <span className="text-amber-400 font-bold">&quot;PRIORITY&quot;</span> teglari taqiladi va samolyotdan tushirilganda birinchi yetkaziladi.
              </p>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
              <p className="text-xs text-slate-300">
                <strong className="text-white">Dynamic Counter Dispatching:</strong> Dasturimizda barcha VIP darchalar faqat VIP navbatdagilarga xizmat ko&apos;rsatadi. Biroq VIP navbat bo&apos;sh bo&apos;lsa, Priority rejimidagi darchalar oddiy yo&apos;lovchilarga yordamga keladi (va aksincha).
              </p>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
              <p className="text-xs text-slate-300">
                <strong className="text-white">VIP Transfer:</strong> Shaxsiy o&apos;tirgichlar, CIP zali hamda samolyotgacha maxsus avtobuslar / yuk guruh xizmatlari ajratiladi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
