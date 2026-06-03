using System;
using System.Text.Json.Serialization;

namespace TAS.QueueManagement.Api.Models
{
    public class Passenger
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string PassportNumber { get; set; } = string.Empty;
        public string FlightNumber { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PassengerClass Class { get; set; } // VIP, Regular
        public string VipReason { get; set; } = "None"; // Business Class, CIP Lounge Guest, Premium Loyalty etc.
        public string Status { get; set; } = "Waiting"; // Waiting, In-Service, Done
        public DateTime ArrivalTime { get; set; }
        public DateTime? ServiceTime { get; set; }
        public int WaitTime { get; set; } // simulated minutes waited
        public int BaggageWeight { get; set; } // in kg
        public string? SeatAssignment { get; set; }
        public string QueueNumber { get; set; } = string.Empty;
    }

    public enum PassengerClass
    {
        VIP,
        Regular
    }

    public class CheckInDesk
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // VIP, Priority, Regular
        public string Status { get; set; } = "Closed"; // Open, Closed, Idle, Processing
        public Passenger? CurrentPassenger { get; set; }
        public int ProcessedCount { get; set; }
        public int AverageProcessingTime { get; set; } // in sec
    }

    public class QueueStats
    {
        public int TotalWaitingVIP { get; set; }
        public int TotalWaitingRegular { get; set; }
        public int TotalProcessedCount { get; set; }
        public int AverageWaitTimeVIP { get; set; }
        public int AverageWaitTimeRegular { get; set; }
        public double AverageBaggageWeight { get; set; }
        public int ActiveDesksCount { get; set; }
    }

    public class FlightInfo
    {
        public string FlightNumber { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string DepartureTime { get; set; } = string.Empty;
        public string Status { get; set; } = "On-Time"; // On-Time, Boarding, Delayed, Check-in Open
        public string Gate { get; set; } = string.Empty;
    }

    public class ChatMessage
    {
        public string Sender { get; set; } = "user"; // "user" or "ai"
        public string Text { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
    }

    // Requests
    public class AddPassengerRequest
    {
        public string Name { get; set; } = string.Empty;
        public string FlightNumber { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string Class { get; set; } = "Regular"; // "VIP", "Regular"
        public string VipReason { get; set; } = "None";
        public int BaggageWeight { get; set; }
    }

    public class ToggleDeskRequest
    {
        public int DeskId { get; set; }
    }

    public class CallPassengerRequest
    {
        public int DeskId { get; set; }
    }

    public class CompletePassengerRequest
    {
        public int DeskId { get; set; }
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
        public ChatContextState? ContextState { get; set; }
    }

    public class ChatContextState
    {
        public QueueStats? Stats { get; set; }
    }

    public class ChatResponse
    {
        public string Text { get; set; } = string.Empty;
        public string Source { get; set; } = "offline_local_expert";
    }

    public class QueueStateResponse
    {
        public List<CheckInDesk> Desks { get; set; } = new();
        public List<Passenger> VipQueue { get; set; } = new();
        public List<Passenger> RegularQueue { get; set; } = new();
        public QueueStats Stats { get; set; } = new();
        public List<Passenger> History { get; set; } = new();
        public List<FlightInfo> Flights { get; set; } = new();
    }
}
