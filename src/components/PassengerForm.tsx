import React, { useState } from 'react';
import { Passenger, FlightInfo } from '../types';
import { UserPlus, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface PassengerFormProps {
  flights: FlightInfo[];
  onAddPassenger: (passengerData: {
    name: string;
    flightNumber: string;
    destination: string;
    class: 'VIP' | 'Regular';
    vipReason?: string;
    baggageWeight: number;
  }) => Promise<void>;
  onSimulateBulk: () => Promise<void>;
  isLoading: boolean;
}

export default function PassengerForm({ flights, onAddPassenger, onSimulateBulk, isLoading }: PassengerFormProps) {
  const [name, setName] = useState('');
  const [flightIndex, setFlightIndex] = useState(0);
  const [passengerClass, setPassengerClass] = useState<'VIP' | 'Regular'>('Regular');
  const [vipReason, setVipReason] = useState('Business Class');
  const [baggageWeight, setBaggageWeight] = useState(18);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const vipReasons = [
    'Business Class',
    'First Class',
    'Premium Loyalty',
    'CIP Lounge Guest',
    'Diplomacy/Gov'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Yo‘lovchi ismi-sharifini yozing.');
      return;
    }

    const selectedFlight = flights[flightIndex];
    if (!selectedFlight) {
      setErrorMsg('Reys tanlanmagan.');
      return;
    }

    try {
      await onAddPassenger({
        name,
        flightNumber: selectedFlight.flightNumber,
        destination: selectedFlight.destination,
        class: passengerClass,
        vipReason: passengerClass === 'VIP' ? vipReason : undefined,
        baggageWeight: Number(baggageWeight)
      });

      setName('');
      setSuccessMsg(`Yo‘lovchi muvaffaqiyatli ${passengerClass === 'VIP' ? 'VIP (CIP)' : 'Oddiy'} navbatga qo‘shildi!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg('Navbatga qo‘shishda xatolik yuz berdi.');
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 shadow-lg p-6 rounded-2xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-800">
        <h3 className="font-bold text-slate-100 flex items-center space-x-2 text-sm uppercase tracking-wider font-mono">
          <UserPlus className="w-5 h-5 text-blue-400" />
          <span>Navbatga Ro&apos;yxatdan O&apos;tkazish</span>
        </h3>
        
        {/* Bulk Simulation Pill */}
        <button
          onClick={onSimulateBulk}
          disabled={isLoading}
          type="button"
          className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 text-amber-400 disabled:opacity-50 text-[11px] rounded-lg border border-amber-500/20 transition-colors font-semibold cursor-pointer font-mono"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Simulyatsiya (⚡ +5)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-950/40 text-red-400 text-xs rounded-xl flex items-center space-x-2 border border-red-900/30 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 text-emerald-400 text-xs rounded-xl flex items-center space-x-3 border border-emerald-900/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <p>{successMsg}</p>
          </div>
        )}

        {/* Name input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">Ism-Sharif (Passportdagidek)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            placeholder="Masalan: ABDULLA QODIRIY"
            className="w-full text-sm px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-100 placeholder-slate-600 bg-slate-950/80 font-mono uppercase"
          />
        </div>

        {/* Flight Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">Parvoz (Flight) Yo&apos;nalishi</label>
          <select
            value={flightIndex}
            onChange={(e) => setFlightIndex(Number(e.target.value))}
            disabled={isLoading}
            className="w-full text-sm px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-100 bg-slate-950/80 font-mono"
          >
            {flights.map((f, i) => (
              <option key={f.flightNumber} value={i} className="bg-slate-900 text-slate-100">
                {f.flightNumber} — {f.destination} ({f.departureTime})
              </option>
            ))}
          </select>
        </div>

        {/* Baggage selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">Yuk og&apos;irligi (Baggage KG)</label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="2"
              max="45"
              value={baggageWeight}
              onChange={(e) => setBaggageWeight(Number(e.target.value))}
              disabled={isLoading}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-xs font-bold font-mono px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-350 min-w-[55px] text-center">
              {baggageWeight} kg
            </span>
          </div>
        </div>

        {/* Class toggle tabs with nice feedback */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">Xizmat Toifasi (Class)</label>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 border border-slate-850 rounded-xl">
            <button
              type="button"
              onClick={() => setPassengerClass('Regular')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer font-mono ${passengerClass === 'Regular' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Oddiy (Economy)
            </button>
            <button
              type="button"
              onClick={() => setPassengerClass('VIP')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer font-mono ${passengerClass === 'VIP' ? 'bg-amber-500/15 border border-amber-500/20 text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            >
              👑 VIP (CIP Class)
            </button>
          </div>
        </div>

        {/* VIP Reason selection */}
        {passengerClass === 'VIP' && (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-400 font-mono mb-1.5 uppercase tracking-wide">VIP Tasdiqlash Mezoni</label>
            <select
              value={vipReason}
              onChange={(e) => setVipReason(e.target.value)}
              disabled={isLoading}
              className="w-full text-sm px-3 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-slate-200 bg-slate-950/85 font-mono"
            >
              {vipReasons.map(r => (
                <option key={r} value={r} className="bg-slate-900 text-slate-250">
                  {r}
               </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit bar */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-4 text-xs font-mono font-bold rounded-xl shadow-md border cursor-pointer uppercase transition-all tracking-wider ${passengerClass === 'VIP' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'}`}
        >
          {isLoading ? 'Iltimos kuting...' : passengerClass === 'VIP' ? 'VIP (CIP) Navbatiga Qo‘shish' : 'Ekonom Navbatiga Qo‘shish'}
        </button>
      </form>
    </div>
  );
}
