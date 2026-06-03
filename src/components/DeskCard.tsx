import React from 'react';
import { CheckInDesk } from '../types';
import { Award, Star, User, Lock, Unlock, PlayCircle, CheckCircle2, UserCheck, RefreshCw } from 'lucide-react';

interface DeskCardProps {
  desk: CheckInDesk;
  onCallPassenger: (deskId: number) => any;
  onCompletePassenger: (deskId: number) => any;
  onToggleDesk: (deskId: number) => any;
  isLoading: boolean;
}

const DeskCard: React.FC<DeskCardProps> = ({ desk, onCallPassenger, onCompletePassenger, onToggleDesk, isLoading }) => {
  const isClosed = desk.status === 'Closed';
  const hasPassenger = !!desk.currentPassenger;

  // Render header styled by desk type
  const deskTypeStyle = () => {
    switch (desk.type) {
      case 'VIP':
        return {
          bg: 'from-amber-600/10 via-amber-700/5 to-transparent border-b border-amber-500/20',
          text: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
          border: 'border-amber-500/20',
          title: 'text-amber-400',
          icon: <Award className="w-5 h-5 text-amber-500 animate-pulse" />
        };
      case 'Priority':
        return {
          bg: 'from-blue-600/10 via-indigo-700/5 to-transparent border-b border-blue-500/20',
          text: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          border: 'border-blue-500/20',
          title: 'text-blue-400',
          icon: <Star className="w-5 h-5 text-blue-400" />
        };
      default:
        return {
          bg: 'from-slate-800/20 via-slate-900/10 to-transparent border-b border-slate-800',
          text: 'text-slate-400 bg-slate-850 border-slate-800',
          border: 'border-slate-800',
          title: 'text-slate-200',
          icon: <User className="w-5 h-5 text-slate-400" />
        };
    }
  };

  const style = deskTypeStyle();

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-slate-900/80 shadow-md flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${isClosed ? 'border-slate-850 bg-slate-950/20 opacity-75' : 'border-slate-800'}`}>
      
      {/* Curved Background Accent for Active processing */}
      {!isClosed && hasPassenger && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
      )}

      {/* Desk Title Header */}
      <div className={`p-4 bg-gradient-to-r text-white flex justify-between items-center ${isClosed ? 'from-slate-900 via-slate-950 to-transparent border-b border-slate-850' : style.bg}`}>
        <div className="flex items-center space-x-2.5">
          {style.icon}
          <div>
            <h3 className={`font-bold text-sm tracking-tight font-sans ${style.title}`}>{desk.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${style.text}`}>
                {desk.type} Desk
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                #{desk.id}
              </span>
            </div>
          </div>
        </div>

        {/* Closed overlay badge */}
        {isClosed && (
          <span className="text-xs uppercase bg-slate-950 text-slate-450 px-2 py-0.5 rounded-md border border-slate-850 font-mono text-[9px] font-bold">
            Yopiq
          </span>
        )}
      </div>

      {/* Desk Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between min-h-[170px]">
        {isClosed ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-6">
            <Lock className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
            <p className="text-xs font-mono">Darcha Xizmati To&apos;xtatilgan</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] text-center">Navbatlarni taqsimlash uchun darchani oching</p>
          </div>
        ) : hasPassenger ? (
          <div className="flex-1 flex flex-col justify-between font-mono">
            {/* Active Passenger Details */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 tracking-wider block uppercase">Xizmatda</span>
                  <h4 className="text-sm font-bold text-slate-100 tracking-tight leading-snug uppercase font-sans">
                    {desk.currentPassenger?.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Pasport: <span className="font-semibold text-slate-300">{desk.currentPassenger?.passportNumber}</span>
                  </span>
                </div>
                {/* VIP Indicator Corona */}
                {desk.currentPassenger?.class === 'VIP' ? (
                  <span className="text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1 h-1 rounded-full bg-amber-500 animate-ping mr-1" />
                    👑 VIP / {desk.currentPassenger?.vipReason || 'CIP'}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    ✈️ REGULAR
                  </span>
                )}
              </div>

              {/* Boarding and Bag Details Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="text-center border-r border-slate-850">
                  <span className="text-[9px] text-slate-500 block">Reys</span>
                  <span className="text-xs font-bold text-slate-200">{desk.currentPassenger?.flightNumber}</span>
                </div>
                <div className="text-center border-r border-slate-850">
                  <span className="text-[9px] text-slate-500 block">Bagaj</span>
                  <span className="text-xs font-bold text-slate-200">{desk.currentPassenger?.baggageWeight} kg</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 block">Joy (Seat)</span>
                  <span className="text-xs font-bold text-emerald-400">{desk.currentPassenger?.seatAssignment || '--'}</span>
                </div>
              </div>

              {/* Destination info */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 text-[10px]">Manzil:</span>
                <span className="font-medium text-slate-300">{desk.currentPassenger?.destination}</span>
              </div>
            </div>

            {/* Complete button */}
            <button
              onClick={() => onCompletePassenger(desk.id)}
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 font-medium text-xs rounded-xl shadow-sm transition-all duration-150 cursor-pointer text-center"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Chipta Chop Etish</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between font-mono">
            {/* Idle state */}
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-4">
              <UserCheck className="w-8 h-8 mb-1.5 stroke-1 text-blue-500/40 animate-pulse" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bo&apos;sh Turibdi</p>
              <p className="text-[10px] text-slate-500 mt-0.5 text-center px-4">Yo&apos;lovchini chaqirish uchun quyidagi tugmani bosing</p>
            </div>

            {/* Call Next passenger button */}
            <button
              onClick={() => onCallPassenger(desk.id)}
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 text-white font-medium text-xs rounded-xl shadow-sm transition-all duration-150 cursor-pointer border ${
                desk.type === 'VIP' 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                  : desk.type === 'Priority'
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-blue-500/25'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Chaqirish (Call Next)</span>
            </button>
          </div>
        )}
      </div>

      {/* Desk Footer Status */}
      <div className="border-t border-slate-850 px-4 py-2 bg-slate-950/80 flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <div className="flex items-center space-x-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isClosed ? 'bg-slate-600' : hasPassenger ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span>Hadd: {isClosed ? 'Yopiq' : hasPassenger ? 'Faol' : 'Kutmoqda'}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>Processed: <strong className="text-slate-350">{desk.processedCount}</strong></span>
          <button
            onClick={() => onToggleDesk(desk.id)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded transition duration-100 cursor-pointer"
            title={isClosed ? "Darchani Ochish font-sans" : "Darchani Yopish font-sans"}
          >
            {isClosed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeskCard;
