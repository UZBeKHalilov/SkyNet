export interface Passenger {
  id: string;
  name: string;
  passportNumber: string;
  flightNumber: string;
  destination: string;
  class: 'VIP' | 'Regular';
  vipReason?: string;
  status: 'Waiting' | 'In-Service' | 'Done';
  arrivalTime: string;
  serviceTime?: string;
  waitTime: number;
  baggageWeight: number;
  seatAssignment?: string;
  queueNumber: string;
}

export interface CheckInDesk {
  id: number;
  name: string;
  type: 'VIP' | 'Priority' | 'Regular';
  status: 'Open' | 'Closed' | 'Idle' | 'Processing';
  currentPassenger: Passenger | null;
  processedCount: number;
  averageProcessingTime: number;
}

export interface QueueStats {
  totalWaitingVIP: number;
  totalWaitingRegular: number;
  totalProcessedCount: number;
  averageWaitTimeVIP: number;
  averageWaitTimeRegular: number;
  averageBaggageWeight: number;
  activeDesksCount: number;
}

export interface FlightInfo {
  flightNumber: string;
  destination: string;
  departureTime: string;
  status: 'On-Time' | 'Boarding' | 'Delayed' | 'Check-in Open';
  gate: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AddPassengerRequest {
  name: string;
  flightNumber: string;
  destination: string;
  class: 'VIP' | 'Regular';
  vipReason: string;
  baggageWeight: number;
}
