import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { Passenger, CheckInDesk, QueueStats, FlightInfo } from './src/types.js';

// Setup Express
const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Simulation State
let vipQueue: Passenger[] = [];
let regularQueue: Passenger[] = [];
let doneHistory: Passenger[] = [];
let nextTicketNumber = 101;

const FLIGHTS: FlightInfo[] = [
  { flightNumber: 'HY-101', destination: 'New York (JFK)', departureTime: '13:45', status: 'Check-in Open', gate: 'B3' },
  { flightNumber: 'HY-273', destination: 'Istanbul (IST)', departureTime: '14:20', status: 'Check-in Open', gate: 'A1' },
  { flightNumber: 'HY-513', destination: 'Seoul (ICN)', departureTime: '16:00', status: 'Check-in Open', gate: 'A8' },
  { flightNumber: 'HY-331', destination: 'London (LHR)', departureTime: '17:15', status: 'On-Time', gate: 'B1' },
  { flightNumber: 'HY-771', destination: 'Dubai (DXB)', departureTime: '18:50', status: 'On-Time', gate: 'A5' },
  { flightNumber: 'HY-601', destination: 'Moscow (DME)', departureTime: '19:30', status: 'On-Time', gate: 'B5' }
];

let desks: CheckInDesk[] = [
  { id: 1, name: 'VIP Terminal Counter 1 (CIP)', type: 'VIP', status: 'Open', currentPassenger: null, processedCount: 0, averageProcessingTime: 0 },
  { id: 2, name: 'Priority Counter 2 (Business Class)', type: 'Priority', status: 'Open', currentPassenger: null, processedCount: 0, averageProcessingTime: 0 },
  { id: 3, name: 'Economy Counter 3 (Uzbekistan Airways)', type: 'Regular', status: 'Open', currentPassenger: null, processedCount: 0, averageProcessingTime: 0 },
  { id: 4, name: 'Economy Counter 4 (Luggage Baggage Drop)', type: 'Regular', status: 'Open', currentPassenger: null, processedCount: 0, averageProcessingTime: 0 },
  { id: 5, name: 'Economy Counter 5 (Group & Promo)', type: 'Regular', status: 'Closed', currentPassenger: null, processedCount: 0, averageProcessingTime: 0 },
  { id: 6, name: 'Fast-Track Passport Corridor Counter 6', type: 'Priority', status: 'Closed', currentPassenger: null, processedCount: 0, averageProcessingTime: 0 }
];

// Seed initial queue state for interactive realism
function resetSimulation() {
  nextTicketNumber = 101;
  doneHistory = [];
  
  desks.forEach(d => {
    d.currentPassenger = null;
    d.processedCount = 0;
    d.averageProcessingTime = 0;
  });
  desks[0].status = 'Open';
  desks[1].status = 'Open';
  desks[2].status = 'Open';
  desks[3].status = 'Open';
  desks[4].status = 'Closed';
  desks[5].status = 'Closed';

  // Seed VIP passengers
  vipQueue = [
    {
      id: 'PAS-VIP-001',
      name: 'Abdulla Qodiriy',
      passportNumber: 'KA*****82',
      flightNumber: 'HY-101',
      destination: 'New York (JFK)',
      class: 'VIP',
      vipReason: 'Business Class',
      status: 'Waiting',
      arrivalTime: new Date(Date.now() - 12 * 60000).toISOString(),
      waitTime: 12,
      baggageWeight: 31,
      queueNumber: 'VIP-001'
    },
    {
      id: 'PAS-VIP-002',
      name: 'Gulnora Karimova',
      passportNumber: 'KA*****05',
      flightNumber: 'HY-771',
      destination: 'Dubai (DXB)',
      class: 'VIP',
      vipReason: 'CIP Lounge Guest',
      status: 'Waiting',
      arrivalTime: new Date(Date.now() - 5 * 60000).toISOString(),
      waitTime: 5,
      baggageWeight: 14,
      queueNumber: 'VIP-002'
    }
  ];

  // Seed Regular passengers
  regularQueue = [
    {
      id: 'PAS-REG-001',
      name: 'Jasur Umarov',
      passportNumber: 'AA*****45',
      flightNumber: 'HY-273',
      destination: 'Istanbul (IST)',
      class: 'Regular',
      status: 'Waiting',
      arrivalTime: new Date(Date.now() - 25 * 60000).toISOString(),
      waitTime: 25,
      baggageWeight: 22,
      queueNumber: 'REG-101'
    },
    {
      id: 'PAS-REG-002',
      name: 'Sayyora Ergasheva',
      passportNumber: 'AB*****12',
      flightNumber: 'HY-513',
      destination: 'Seoul (ICN)',
      class: 'Regular',
      status: 'Waiting',
      arrivalTime: new Date(Date.now() - 18 * 60000).toISOString(),
      waitTime: 18,
      baggageWeight: 23,
      queueNumber: 'REG-102'
    },
    {
      id: 'PAS-REG-003',
      name: 'Sherzod Alimov',
      passportNumber: 'AC*****90',
      flightNumber: 'HY-601',
      destination: 'Moscow (DME)',
      class: 'Regular',
      status: 'Waiting',
      arrivalTime: new Date(Date.now() - 10 * 60000).toISOString(),
      waitTime: 10,
      baggageWeight: 18,
      queueNumber: 'REG-103'
    },
    {
      id: 'PAS-REG-004',
      name: 'Dora Abdullayeva',
      passportNumber: 'AB*****76',
      flightNumber: 'HY-273',
      destination: 'Istanbul (IST)',
      class: 'Regular',
      status: 'Waiting',
      arrivalTime: new Date(Date.now() - 2 * 60000).toISOString(),
      waitTime: 2,
      baggageWeight: 8,
      queueNumber: 'REG-104'
    }
  ];
}

resetSimulation();

// Clean up wait time tracking on server ticks (simulating actual run time)
setInterval(() => {
  const incrementWaitTime = (p: Passenger) => {
    const minDiff = Math.floor((Date.now() - new Date(p.arrivalTime).getTime()) / 60000);
    p.waitTime = Math.max(0, minDiff);
  };
  vipQueue.forEach(incrementWaitTime);
  regularQueue.forEach(incrementWaitTime);
}, 15000);

// Lazy Initialize Gemini API Client
let geminiClientCache: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClientCache) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      try {
        geminiClientCache = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (err) {
        console.error("Gemini API initialization failed:", err);
      }
    }
  }
  return geminiClientCache;
}

// Get stats
function getStats(): QueueStats {
  const activeCount = desks.filter(d => d.status !== 'Closed').length;
  const totalProcessed = doneHistory.length;
  
  // Averages calculations
  const totalBaggage = doneHistory.reduce((sum, p) => sum + p.baggageWeight, 0) + 
                       vipQueue.reduce((sum, p) => sum + p.baggageWeight, 0) + 
                       regularQueue.reduce((sum, p) => sum + p.baggageWeight, 0);
  const passengerCount = (doneHistory.length + vipQueue.length + regularQueue.length) || 1;

  // Wait times
  const doneVIP = doneHistory.filter(p => p.class === 'VIP');
  const doneRegular = doneHistory.filter(p => p.class === 'Regular');
  
  const avgWaitVIP = doneVIP.length 
    ? Math.round(doneVIP.reduce((s, p) => s + p.waitTime, 0) / doneVIP.length)
    : (vipQueue.length ? Math.round(vipQueue.reduce((s, p) => s + p.waitTime, 0) / vipQueue.length) : 0);

  const avgWaitReg = doneRegular.length 
    ? Math.round(doneRegular.reduce((s, p) => s + p.waitTime, 0) / doneRegular.length)
    : (regularQueue.length ? Math.round(regularQueue.reduce((s, p) => s + p.waitTime, 0) / regularQueue.length) : 0);

  return {
    totalWaitingVIP: vipQueue.length,
    totalWaitingRegular: regularQueue.length,
    totalProcessedCount: totalProcessed,
    averageWaitTimeVIP: avgWaitVIP || 4,
    averageWaitTimeRegular: avgWaitReg || 12,
    averageBaggageWeight: Math.round(totalBaggage / passengerCount),
    activeDesksCount: activeCount
  };
}

// REST Api endpoints

// 1. Get entire state
app.get('/api/queue/state', (req, res) => {
  res.json({
    desks,
    vipQueue,
    regularQueue,
    stats: getStats(),
    history: doneHistory.slice(-10), // return last 10 processed
    flights: FLIGHTS
  });
});

// 2. Add custom passenger
app.post('/api/queue/passenger/add', (req, res) => {
  const { name, flightNumber, destination, class: passengerClass, vipReason, baggageWeight } = req.body;
  if (!name || !flightNumber) {
    return res.status(400).json({ error: 'Name and Flight Number are required fields.' });
  }

  const isVIP = passengerClass === 'VIP';
  const prefix = isVIP ? 'VIP' : 'REG';
  const passportRand = Math.floor(100000 + Math.random() * 900000);
  
  const ticketId = isVIP 
    ? `VIP-${String(vipQueue.length + 1).padStart(3, '0')}` 
    : `REG-${nextTicketNumber++}`;

  const passenger: Passenger = {
    id: `PAS-${prefix}-${Math.floor(Math.random() * 10000)}`,
    name: name.trim(),
    passportNumber: `KA${passportRand}`,
    flightNumber,
    destination: destination || 'Istanbul (IST)',
    class: passengerClass,
    vipReason: isVIP ? (vipReason || 'Business Class') : 'None',
    status: 'Waiting',
    arrivalTime: new Date().toISOString(),
    waitTime: 0,
    baggageWeight: Number(baggageWeight) || 12,
    queueNumber: ticketId
  };

  if (isVIP) {
    vipQueue.push(passenger);
  } else {
    regularQueue.push(passenger);
  }

  res.json({ success: true, passenger, stats: getStats() });
});

// 3. Simulate bulk passengers
app.post('/api/queue/passenger/simulate-bulk', (req, res) => {
  const firstNamesUZ = ['Aliyor', 'Malika', 'Dilshod', 'Sardor', 'Nigora', 'Shokhrukh', 'Farrukh', 'Feruza', 'Davron', 'Zukhra', 'Jahongir', 'Otabek'];
  const lastNamesUZ = ['Karimov', 'Rakhimov', 'Umarov', 'Sodiqov', 'Khusanov', 'Alimov', 'Tashpulatov', 'Yunusov', 'Abduvakhitov', 'Rustamov'];
  
  const reasons: ('Business Class' | 'First Class' | 'Premium Loyalty' | 'CIP Lounge Guest' | 'Diplomacy/Gov')[] = 
    ['Business Class', 'First Class', 'Premium Loyalty', 'CIP Lounge Guest', 'Diplomacy/Gov'];

  const simulated: Passenger[] = [];

  for (let i = 0; i < 5; i++) {
    const isVIP = Math.random() < 0.4; // 40% chance of VIP simulator passenger
    const name = `${firstNamesUZ[Math.floor(Math.random() * firstNamesUZ.length)]} ${lastNamesUZ[Math.floor(Math.random() * lastNamesUZ.length)]}`;
    const fl = FLIGHTS[Math.floor(Math.random() * FLIGHTS.length)];
    const passportRand = Math.floor(100000 + Math.random() * 900000);
    const baggage = Math.floor(5 + Math.random() * 35);
    
    const prefix = isVIP ? 'VIP' : 'REG';
    const queueNum = isVIP 
      ? `VIP-${String(vipQueue.length + simulated.filter(p => p.class === 'VIP').length + 1).padStart(3, '0')}` 
      : `REG-${nextTicketNumber++}`;

    const p: Passenger = {
      id: `PAS-${prefix}-${Math.floor(Math.random() * 10000)}`,
      name,
      passportNumber: `KA${passportRand}`,
      flightNumber: fl.flightNumber,
      destination: fl.destination,
      class: isVIP ? 'VIP' : 'Regular',
      vipReason: isVIP ? reasons[Math.floor(Math.random() * reasons.length)] : 'None',
      status: 'Waiting',
      arrivalTime: new Date(Date.now() - Math.floor(Math.random() * 15) * 60000).toISOString(),
      waitTime: Math.floor(Math.random() * 15),
      baggageWeight: baggage,
      queueNumber: queueNum
    };

    if (isVIP) {
      vipQueue.push(p);
    } else {
      regularQueue.push(p);
    }
    simulated.push(p);
  }

  res.json({ success: true, count: simulated.length, stats: getStats() });
});

// 4. Pull passenger to specific desk (Automatic & Manual priority dispatching)
app.post('/api/queue/desk/process', (req, res) => {
  const { deskId } = req.body;
  const deskIndex = desks.findIndex(d => d.id === Number(deskId));
  
  if (deskIndex === -1) {
    return res.status(404).json({ error: 'Desk selection not found.' });
  }

  const desk = desks[deskIndex];
  if (desk.status === 'Closed') {
    return res.status(400).json({ error: 'Cannot assign to a closed counter.' });
  }

  if (desk.currentPassenger) {
    return res.status(400).json({ error: 'Desk is currently busy processing another passenger. Please complete existing check-in first.' });
  }

  let selectedPassenger: Passenger | null = null;

  // Business Dispatching Rule Segregation
  if (desk.type === 'VIP') {
    // Escalate VIPs only
    if (vipQueue.length > 0) {
      selectedPassenger = vipQueue.shift() || null;
    } else {
      return res.status(200).json({ success: false, message: 'VIP queue is empty. This CIP/VIP desk remains on high alert exclusively for VIP arrivals.' });
    }
  } else if (desk.type === 'Priority') {
    // Serves VIP queue first, falls back to highest waiting Regular passenger if empty.
    if (vipQueue.length > 0) {
      selectedPassenger = vipQueue.shift() || null;
    } else if (regularQueue.length > 0) {
      selectedPassenger = regularQueue.shift() || null;
    } else {
      return res.status(200).json({ success: false, message: 'All queues are fully cleared. Counter standing idle.' });
    }
  } else {
    // Regular economy counters serve the Regular queue first, or if VIP is severely congested (>3 waiting) and Regular is cleared, VIP is assisted.
    if (regularQueue.length > 0) {
      selectedPassenger = regularQueue.shift() || null;
    } else if (vipQueue.length > 3) {
      selectedPassenger = vipQueue.shift() || null; // dynamic cross-flow help!
    } else {
      return res.status(200).json({ success: false, message: 'Regular queues are clear.' });
    }
  }

  if (selectedPassenger) {
    selectedPassenger.status = 'In-Service';
    selectedPassenger.serviceTime = new Date().toISOString();
    // Assign seat
    const seatRow = selectedPassenger.class === 'VIP' ? Math.floor(1 + Math.random() * 5) : Math.floor(6 + Math.random() * 35);
    const seatLetter = ['A', 'C', 'D', 'F'][Math.floor(Math.random() * 4)];
    selectedPassenger.seatAssignment = `${seatRow}${seatLetter}`;

    desk.currentPassenger = selectedPassenger;
    desk.status = 'Processing';
  }

  res.json({ success: true, desk, stats: getStats() });
});

// 5. Complete service at a desk
app.post('/api/queue/desk/complete', (req, res) => {
  const { deskId } = req.body;
  const deskIndex = desks.findIndex(d => d.id === Number(deskId));

  if (deskIndex === -1) {
    return res.status(404).json({ error: 'Desk not found.' });
  }

  const desk = desks[deskIndex];
  if (!desk.currentPassenger) {
    return res.status(400).json({ error: 'This desk does not have an active passenger.' });
  }

  const completedPassenger = desk.currentPassenger;
  completedPassenger.status = 'Done';
  
  // Save check-in statistics
  doneHistory.push(completedPassenger);
  desk.processedCount += 1;
  
  // Accumulate average wait & service calculations
  const totalWeight = desk.processedCount * 120 + Math.floor(Math.random() * 60);
  desk.averageProcessingTime = Math.round(totalWeight / desk.processedCount);

  // Free desk
  desk.currentPassenger = null;
  desk.status = 'Idle';

  res.json({ success: true, passenger: completedPassenger, desk, stats: getStats() });
});

// 6. Toggle desk Open/Closed
app.post('/api/queue/desk/toggle', (req, res) => {
  const { deskId } = req.body;
  const deskIndex = desks.findIndex(d => d.id === Number(deskId));

  if (deskIndex === -1) {
    return res.status(404).json({ error: 'Desk not found.' });
  }

  const desk = desks[deskIndex];
  if (desk.status === 'Closed') {
    desk.status = 'Idle';
  } else {
    // If has passenger, push them back to front of respective queue
    if (desk.currentPassenger) {
      const p = desk.currentPassenger;
      p.status = 'Waiting';
      if (p.class === 'VIP') {
        vipQueue.unshift(p);
      } else {
        regularQueue.unshift(p);
      }
      desk.currentPassenger = null;
    }
    desk.status = 'Closed';
  }

  res.json({ success: true, desk, stats: getStats() });
});

// 7. Reset queue
app.post('/api/queue/reset', (req, res) => {
  resetSimulation();
  res.json({ success: true, desks, vipQueue, regularQueue, stats: getStats() });
});

// 8. Dynamic Gemini Agent Integration for priority inquiries
app.post('/api/api-assistant/answer', async (req, res) => {
  const { message, contextState } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Suriya (Message) bo\'sh bo\'lishi mumkin emas.' });
  }

  const aiClient = getGeminiClient();

  if (!aiClient) {
    // Friendly, beautiful Mock Response system in Uzbek in case API key is missing
    const userMsgLower = message.toLowerCase();
    let responseText = '';

    if (userMsgLower.includes('vip') || userMsgLower.includes('cip') || userMsgLower.includes('farq')) {
      responseText = `Toshkent Xalqaro Aeroportida (TAS) VIP/CIP yo'lovchilar va oddiy yo'lovchilar quyidagi qat'iy mezonlar asosida ajratiladi:

1. **Chipta toifasi (Business/First Class)**: Birinchi toifa va Biznes klass chiptalariga ega barcha yo'lovchilar avtomatik ravishda VIP maqomiga ega bo'ladilar.
2. **Loylallik Dasturi (Frequent Flyer)**: Uzbekistan Airways "UzAirPlus" Premium (Gold/Silver) yoki tegishli SkyTeam hamkorlari yuqori darajadagi loyihalariga ega yo'lovchilar.
3. **CIP Hall/Lounge Vouchers**: Maxsus pullik CIP ("Comfort and Information Point") xizmatlaridan foydalanish vaucheriga ega mehmonlar.
4. **Diplomatik va Davlat delegatsiyasi**: Maxsus diplomatik pasport va rasmiy doiradagi yo'lovchilar.

**Ularga ko'rsatiladigan boshqaruv ustunliklari:**
- **Maxsus Yo'lak**: CIP/VIP yo'lovchilar umuman alohida terminal yoki "Counter 1 & 2" kabi tezkor yo'laklar orqali navbatsiz kiradilar.
- **Bortga chiqish (Priority Boarding)**: Maxsus transfer mikroavtobusi va birinchi navbatda samolyotga yo'naltirish.
- **Bagashe (Priority Tag)**: Yuklariga yorqin to'q-sariq "PRIORITY" teglari yopishtirilib, birinchi navbatda yetkazib beriladi.`;
    } else if (userMsgLower.includes('bagaj') || userMsgLower.includes('chamadon') || userMsgLower.includes('vazn')) {
      responseText = `Toshkent aeroportida Uzbekistan Airways uchun standart bagaj mezonlari:
- **Ekonom klass (Regular)**: 1 dona 23 kg gacha bepul yuk + 8 kg qo'l yuki.
- **Biznes klass (VIP)**: 2 dona 32 kg gacha bepul yuk + 10 kg qo'l yuki.
Ortiqcha vazn uchun CIP zallarida ham qo'shimcha to'lov tariflari qo'llaniladi. Sizning yukingizni Counter 4 (Luggage Drop) darchasida o'lchatishingiz mumkin!`;
    } else if (userMsgLower.includes('ny') || userMsgLower.includes('new york') || userMsgLower.includes('hy-101')) {
      responseText = `HY-101 reysi Toshkentdan Nyu-Yorkka (JFK) soat 13:45 da jo'nab ketadi. 
Check-in B3 darvozasi terminali yaqinida va hozirda ochiq. VIP yo'lovchilar avtomatik ravishda fast-track CIP xizmati bilan "Counter 1" dan tezkor ro'yxatdan o'tishadi.`;
    } else {
      responseText = `Assalomu alaykum! Toshkent Xalqaro Aeroporti (TAS - Terminal 2) Aqlli Navbat Tizimi bo'yicha yordamchingizman. 
Sizga check-in navbati, VIP/CIP koridorlari, pasport nazorati va bagaj qoidalari bo'yicha o'zbek yoki ingliz tilida ma'lumot berishim mumkin. 
Savolingizni yo'llang, masalan: "Tizimda VIP va oddiy yo'lovchilar qanday ajratiladi?" `;
    }

    return res.json({ text: responseText, source: 'offline_local_expert' });
  }

  // Real Gemini execution
  try {
    const prompt = `You are the Official Tashkent International Airport (TAS) AI Terminal Operations Assistant.
Your audience are passengers, airport dispatch staff, and border security officers standing in Tashkent Terminal 2.
Answer questions professionally, warmly, and in detail in Uzbek (preferred) or beautifully in English based on client input.

The current system queue state context is:
- VIP pending queue size: ${contextState?.stats?.totalWaitingVIP || 0}
- Regular pending queue size: ${contextState?.stats?.totalWaitingRegular || 0}
- Active check-in counters: ${contextState?.stats?.activeDesksCount || 4}
- Average waiting time for VIP is ${contextState?.stats?.averageWaitTimeVIP || 3} mins, Regular is ${contextState?.stats?.averageWaitTimeRegular || 14} mins.

User Question: "${message}"

Formulate a helpful, comprehensive airport expert response. If asked about how VIP and Regular passengers are separated ("VIP va oddiy yo'lovchilarni qanday ajratasiz?"), explain the separation strategy at Tashkent Airport clearly (dedicated VIP/CIP desks vs economy, ticket boarding classes, UzAirPlus gold status, priority baggage tagging as priority orange, VIP Fast-track corridors). Use concise list formatting.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are the Tashkent International Airport VIP Operations manager. Keep answers structured, highly accurate regarding flight HY operations, and hospitable."
      }
    });

    res.json({ text: response.text, source: 'server_gemini_api' });
  } catch (error: any) {
    console.error("Gemini call error:", error);
    res.status(500).json({ error: "Gemini server terminal assistant can't answer right now. Offline mode will backup soon." });
  }
});

async function startServer() {
  // Vite Middleware for Full Stack React setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Port bind to 3000 as per environment rules
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TAS Queue Server successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
