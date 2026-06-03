/**
 * Types for Tashkent Airport VIP & Business Check-in Queue Management System
 */

export interface Passenger {
  id: string; // e.g. TAS-VIP-001, TAS-REG-105
  name: string;
  passportNumber: string; // e.g. AA******9
  flightNumber: string; // e.g. HY-101 (New York), HY-273 (Istanbul)
  destination: string; // Tashkent to X
  class: 'VIP' | 'Regular';
  vipReason?: 'Business Class' | 'First Class' | 'Premium Loyalty' | 'CIP Lounge Guest' | 'Diplomacy/Gov' | 'None';
  status: 'Waiting' | 'In-Service' | 'Done';
  arrivalTime: string; // ISO string or timestamp
  serviceTime?: string; // ISO string when server pulled them
  waitTime: number; // simulated minutes waited
  baggageWeight: number; // in kg
  seatAssignment?: string;
  queueNumber: string; // e.g. V01, R12
}

export interface CheckInDesk {
  id: number;
  name: string;
  type: 'VIP' | 'Priority' | 'Regular'; // VIP serves only VIP; Priority serves VIP first, then Regular; Regular serves Regular and overflows if VIP is empty.
  status: 'Open' | 'Closed' | 'Idle' | 'Processing';
  currentPassenger: Passenger | null;
  processedCount: number;
  averageProcessingTime: number; // in sec
}

export interface QueueStats {
  totalWaitingVIP: number;
  totalWaitingRegular: number;
  totalProcessedCount: number;
  averageWaitTimeVIP: number; // mins
  averageWaitTimeRegular: number; // mins
  averageBaggageWeight: number; // kg
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
