import React, { useState, useEffect } from 'react';
import { Passenger, CheckInDesk, QueueStats, FlightInfo } from './types';
import AirportStats from './components/AirportStats';
import DeskCard from './components/DeskCard';
import PassengerForm from './components/PassengerForm';
import PolicyExplainer from './components/PolicyExplainer';
import StaffChat from './components/StaffChat';
import { 
  Plane, 
  RotateCcw, 
  RefreshCw, 
  FolderSync, 
  Clock, 
  ListOrdered, 
  Inbox, 
  Landmark, 
  Calendar,
  Layers,
  Users,
  Award,
  History,
  Luggage
} from 'lucide-react';

export default function App() {
  const [desks, setDesks] = useState<CheckInDesk[]>([]);
  const [vipQueue, setVipQueue] = useState<Passenger[]>([]);
  const [regularQueue, setRegularQueue] = useState<Passenger[]>([]);
  const [history, setHistory] = useState<Passenger[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    totalWaitingVIP: 0,
    totalWaitingRegular: 0,
    totalProcessedCount: 0,
    averageWaitTimeVIP: 0,
    averageWaitTimeRegular: 0,
    averageBaggageWeight: 0,
    activeDesksCount: 0
  });
  const [flights, setFlights] = useState<FlightInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Fetch complete queue states on load
  const loadState = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await fetch('/api/queue/state');
      if (response.ok) {
        const data = await response.json();
        setDesks(data.desks);
        setVipQueue(data.vipQueue);
        setRegularQueue(data.regularQueue);
        setStats(data.stats);
        setHistory(data.history || []);
        setFlights(data.flights || []);
      }
    } catch (error) {
      console.error('Error loading airport queue state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadState();
    
    // Auto sync state silently every 5 seconds
    const interval = setInterval(() => {
      loadState(true);
    }, 5000);

    // Live clock update
    const clockInterval = setInterval(() => {
      const date = new Date();
      setTimeStr(date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  // Add passenger handler
  const handleAddPassenger = async (passengerData: {
    name: string;
    flightNumber: string;
    destination: string;
    class: 'VIP' | 'Regular';
    vipReason?: string;
    baggageWeight: number;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue/passenger/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passengerData)
      });
      if (res.ok) {
        await loadState(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate bulk passengers
  const handleSimulateBulk = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue/passenger/simulate-bulk', {
        method: 'POST'
      });
      if (res.ok) {
        await loadState(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Process next queue passenger to desk
  const handleCallPassenger = async (deskId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue/desk/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deskId })
      });
      if (res.ok) {
        await loadState(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Complete processing and print boarding pass
  const handleCompletePassenger = async (deskId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue/desk/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deskId })
      });
      if (res.ok) {
        await loadState(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Open/Close toggle check-in desks
  const handleToggleDesk = async (deskId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue/desk/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deskId })
      });
      if (res.ok) {
        await loadState(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Full reset state
  const handleResetSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue/reset', {
        method: 'POST'
      });
      if (res.ok) {
        await loadState(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12 antialiased">
      {/* Uzbekistan Airways Inspired Sapphire Header bar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white">
              <Plane className="w-6 h-6 rotate-45 transform" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-wider font-sans uppercase">
                Toshkent Xalqaro Aeroporti
              </h1>
              <p className="text-[11px] text-slate-400 font-mono flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1.5" />
                Check-in Navbatini Boshqarish Tizimi v2.2
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Live Clock widget */}
            <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-[11px] text-slate-300 flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>TAS Local: {timeStr || '10:36'}</span>
            </div>

            {/* Sync control */}
            <button
              onClick={() => loadState()}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 transition duration-150 cursor-pointer"
              title="Navbatlarni yangilash"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Reset control */}
            <button
              onClick={handleResetSimulation}
              disabled={isLoading}
              className="flex items-center space-x-1.5 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-950/60 px-3 py-1.5 rounded-xl border border-red-900/30 transition duration-150 text-[11px] font-semibold cursor-pointer"
              title="Navbat va darchalarni tiklash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>To&apos;liq Tozalash</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Space */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Statistics section */}
        <AirportStats stats={stats} />

        {/* Priority Segregation Policy Explainer Box */}
        <PolicyExplainer />

        {/* Counter Panels grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-850">
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-tight font-sans">
                Check-in Ro&apos;yxatdan O&apos;tish Darchalari (Operational Counters)
              </h2>
              <p className="text-xs text-slate-400">VIP/Priority va ekonom darchalar oqimi real vaqtda boshqariladi</p>
            </div>
            <span className="text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full font-mono text-slate-300">
              Active: {stats.activeDesksCount} / 6
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {desks.map(desk => (
              <DeskCard
                key={desk.id}
                desk={desk}
                onCallPassenger={handleCallPassenger}
                onCompletePassenger={handleCompletePassenger}
                onToggleDesk={handleToggleDesk}
                isLoading={isLoading}
              />
            ))}
          </div>
        </section>

        {/* Primary Interactive Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Live Queues Tracks (VIP & Economy Waiting) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs for Waiting Queue Lists */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-md">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ListOrdered className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider font-mono">Faol Navbat kutiluvchilari</h3>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center text-amber-500 font-bold">
                    👑 VIP: {vipQueue.length}
                  </span>
                  <span className="text-slate-800 font-sans">|</span>
                  <span className="flex items-center text-blue-400 font-bold">
                    ✈️ Ekonom: {regularQueue.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* VIP Pending Queue Block */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2.5 bg-amber-500/5 rounded-xl border border-amber-500/25">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase flex items-center space-x-1">
                      <Award className="w-4 h-4 text-amber-500 mr-1" />
                      VIP (CIP) Yo&apos;lak
                    </span>
                    <span className="bg-amber-500/10 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border border-amber-500/20">
                      {vipQueue.length} navbatda
                    </span>
                  </div>

                  {vipQueue.length === 0 ? (
                    <div className="text-center py-10 bg-slate-950/20 rounded-xl border border-dashed border-slate-850">
                      <p className="text-xs text-slate-500 font-mono">VIP kutilayotganlar yo&apos;q</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
                      {vipQueue.map((p, i) => (
                        <div key={p.id} className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex justify-between items-center shadow-sm transition duration-150 hover:bg-amber-500/10">
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-bold text-amber-400">{p.name}</span>
                              <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-300 font-mono font-bold">#{p.queueNumber}</span>
                            </div>
                            <div className="flex gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                              <span>Reys: <strong className="text-slate-250">{p.flightNumber}</strong></span>
                              <span>Bax: <strong className="text-slate-250">{p.baggageWeight}kg</strong></span>
                            </div>
                            <span className="text-[10px] block mt-0.5 text-amber-500/80 font-medium font-sans">
                              Soliq: {p.vipReason}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[10px] font-mono font-bold bg-slate-950 text-amber-500 border border-amber-500/10 px-1.5 py-0.5 rounded block">
                              ⏳ {p.waitTime} min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Regular economy Pending Queue Block */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2.5 bg-blue-500/5 rounded-xl border border-blue-500/20">
                    <span className="text-[11px] font-bold text-blue-400 font-mono uppercase flex items-center space-x-1">
                      <Users className="w-4 h-4 text-blue-400 mr-1" />
                      Ekonom Yo&apos;lak
                    </span>
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border border-blue-500/10">
                      {regularQueue.length} navbatda
                    </span>
                  </div>

                  {regularQueue.length === 0 ? (
                    <div className="text-center py-10 bg-slate-950/20 rounded-xl border border-dashed border-slate-850">
                      <p className="text-xs text-slate-500 font-mono">Ekonom kutilayotganlar yo&apos;q</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
                      {regularQueue.map((p, i) => (
                        <div key={p.id} className="p-3 bg-slate-900/30 border border-slate-800 rounded-xl flex justify-between items-center shadow-sm transition duration-150 hover:bg-slate-800/40">
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-bold text-slate-200">{p.name}</span>
                              <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400 font-mono font-bold">#{p.queueNumber}</span>
                            </div>
                            <div className="flex gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                              <span>Reys: <strong className="text-slate-200">{p.flightNumber}</strong></span>
                              <span>Bax: <strong className="text-slate-200">{p.baggageWeight}kg</strong></span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[10px] font-mono font-bold bg-slate-950 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded block">
                              ⏳ {p.waitTime} min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Boarding history log & printed passes list */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider font-mono">Muvaffaqiyatli Check-in qilinganlar (Boarding Tickets)</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Soni: {history.length}
                </span>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs font-mono">
                  Hali hech kim check-in qilmadi. Darchalarda &quot;Yakunlash&quot; tugmasini bosing!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.map((p) => (
                    <div key={p.id} className="border border-slate-800 rounded-xl overflow-hidden shadow-md relative bg-slate-950 flex flex-col font-mono text-[11px] text-slate-300">
                      {/* Segment header */}
                      <div className={`p-2.5 flex justify-between items-center text-white ${p.class === 'VIP' ? 'bg-amber-500/10 border-b border-amber-500/20 text-amber-400 font-bold' : 'bg-slate-900 border-b border-slate-800 text-slate-300 font-bold'}`}>
                        <span className="font-bold tracking-wider text-[10px]">BOARDING PASS / CHIPTA</span>
                        <span className={`font-bold text-[10px] px-2 py-0.5 rounded ${p.class === 'VIP' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                          {p.class === 'VIP' ? '👑 VIP' : '✈️ COACH'}
                        </span>
                      </div>

                      {/* Ticket body */}
                      <div className="p-3.5 space-y-2.5 bg-slate-900/30">
                        <div className="flex justify-between">
                           <div>
                            <span className="text-[9px] text-slate-500 block uppercase">Yo&apos;lovchi (Passenger)</span>
                            <span className="text-xs font-bold text-slate-200 font-sans">{p.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 block uppercase">Navbat ID</span>
                            <span className="text-xs font-bold font-mono text-slate-200">{p.queueNumber}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-1.5 border-y border-dashed border-slate-800 text-center">
                          <div>
                            <span className="text-[8px] text-slate-500 block uppercase font-sans">Reys</span>
                            <span className="font-bold text-slate-200">{p.flightNumber}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-500 block uppercase font-sans">Joy (Seat)</span>
                            <span className="font-bold text-emerald-400">{p.seatAssignment}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-500 block uppercase font-sans">Bagaj (KG)</span>
                            <span className="font-bold text-slate-200">{p.baggageWeight} kg</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[8px] text-slate-500 block">MANZIL (DEST)</span>
                            <span className="font-bold text-[10px] text-slate-300 font-sans">{p.destination}</span>
                          </div>
                          <div className="px-2 py-1 bg-emerald-500/10 text-[9px] text-emerald-400 rounded-lg font-bold border border-emerald-500/20">
                            BOARDING OK
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Column 2: Dashboard Sidebar elements (Register, Flight list, and AI Chatbot) */}
          <div className="space-y-6">
            
            {/* Form */}
            <PassengerForm
              flights={flights}
              onAddPassenger={handleAddPassenger}
              onSimulateBulk={handleSimulateBulk}
              isLoading={isLoading}
            />

            {/* Flight Departure Monitor Board */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-lg p-5">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center">
                  <Plane className="w-4 h-4 mr-1.5 text-amber-500 animate-pulse" />
                  Departure Board (Uchish Lavhasi)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Tashkent TAS</span>
              </div>

              <div className="space-y-3">
                {flights.map((f) => (
                  <div key={f.flightNumber} className="flex justify-between items-center text-xs pb-2 border-b border-slate-800/40 last:border-0 last:pb-0">
                    <div>
                      <div className="font-mono font-bold text-slate-200 tracking-tight flex items-center space-x-1.5">
                        <span className="text-blue-400">{f.flightNumber}</span>
                        <span className="text-slate-400 text-[10px] font-sans">to</span>
                        <span className="text-slate-100 font-sans">{f.destination}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Dep: {f.departureTime} | Gate: {f.gate}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      f.status === 'On-Time' ? 'bg-slate-850 text-slate-400' : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Gemini AI Chatbox */}
            <StaffChat stats={stats} />

          </div>

        </div>

      </main>
    </div>
  );
}
