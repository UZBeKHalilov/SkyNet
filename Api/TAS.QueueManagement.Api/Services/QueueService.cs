using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using TAS.QueueManagement.Api.Models;

namespace TAS.QueueManagement.Api.Services
{
    public interface IQueueService
    {
        QueueStateResponse GetState();
        Passenger AddPassenger(AddPassengerRequest req);
        int SimulateBulk();
        (bool Success, string Message, CheckInDesk? Desk) CallNextPassenger(int deskId);
        (bool Success, string Message, Passenger? Passenger, CheckInDesk? Desk) CompletePassenger(int deskId);
        CheckInDesk ToggleDesk(int deskId);
        void ResetQueue();
    }

    public class QueueService : IQueueService
    {
        private readonly object _lock = new();
        private List<Passenger> _vipQueue = new();
        private List<Passenger> _regularQueue = new();
        private List<Passenger> _doneHistory = new();
        private List<CheckInDesk> _desks = new();
        private int _nextTicketNumber = 101;
        private Timer? _timer;

        private static readonly List<FlightInfo> FlightList = new()
        {
            new() { FlightNumber = "HY-101", Destination = "New York (JFK)", DepartureTime = "13:45", Status = "Check-in Open", Gate = "B3" },
            new() { FlightNumber = "HY-273", Destination = "Istanbul (IST)", DepartureTime = "14:20", Status = "Check-in Open", Gate = "A1" },
            new() { FlightNumber = "HY-513", Destination = "Seoul (ICN)", DepartureTime = "16:00", Status = "Check-in Open", Gate = "A8" },
            new() { FlightNumber = "HY-331", Destination = "London (LHR)", DepartureTime = "17:15", Status = "On-Time", Gate = "B1" },
            new() { FlightNumber = "HY-771", Destination = "Dubai (DXB)", DepartureTime = "18:50", Status = "On-Time", Gate = "A5" },
            new() { FlightNumber = "HY-601", Destination = "Moscow (DME)", DepartureTime = "19:30", Status = "On-Time", Gate = "B5" }
        };

        public QueueService()
        {
            SeedDesks();
            ResetQueue();

            // Start a timer that runs every 15 seconds to simulate passing time and increment WaitTimes
            _timer = new Timer(UpdateWaitTimes, null, TimeSpan.FromSeconds(15), TimeSpan.FromSeconds(15));
        }

        private void SeedDesks()
        {
            _desks = new List<CheckInDesk>
            {
                new() { Id = 1, Name = "VIP Terminal Counter 1 (CIP)", Type = "VIP", Status = "Open", CurrentPassenger = null, ProcessedCount = 0, AverageProcessingTime = 0 },
                new() { Id = 2, Name = "Priority Counter 2 (Business Class)", Type = "Priority", Status = "Open", CurrentPassenger = null, ProcessedCount = 0, AverageProcessingTime = 0 },
                new() { Id = 3, Name = "Economy Counter 3 (Uzbekistan Airways)", Type = "Regular", Status = "Open", CurrentPassenger = null, ProcessedCount = 0, AverageProcessingTime = 0 },
                new() { Id = 4, Name = "Economy Counter 4 (Luggage Baggage Drop)", Type = "Regular", Status = "Open", CurrentPassenger = null, ProcessedCount = 0, AverageProcessingTime = 0 },
                new() { Id = 5, Name = "Economy Counter 5 (Group & Promo)", Type = "Regular", Status = "Closed", CurrentPassenger = null, ProcessedCount = 0, AverageProcessingTime = 0 },
                new() { Id = 6, Name = "Fast-Track Passport Corridor Counter 6", Type = "Priority", Status = "Closed", CurrentPassenger = null, ProcessedCount = 0, AverageProcessingTime = 0 }
            };
        }

        public void ResetQueue()
        {
            lock (_lock)
            {
                _nextTicketNumber = 101;
                _doneHistory.Clear();

                foreach (var desk in _desks)
                {
                    desk.CurrentPassenger = null;
                    desk.ProcessedCount = 0;
                    desk.AverageProcessingTime = 0;
                }

                _desks[0].Status = "Open";
                _desks[1].Status = "Open";
                _desks[2].Status = "Open";
                _desks[3].Status = "Open";
                _desks[4].Status = "Closed";
                _desks[5].Status = "Closed";

                // Seed initial waiting VIP passengers
                _vipQueue = new List<Passenger>
                {
                    new()
                    {
                        Id = "PAS-VIP-001",
                        Name = "Abdulla Qodiriy",
                        PassportNumber = "KA729182",
                        FlightNumber = "HY-101",
                        Destination = "New York (JFK)",
                        Class = PassengerClass.VIP,
                        VipReason = "Business Class",
                        Status = "Waiting",
                        ArrivalTime = DateTime.UtcNow.AddMinutes(-12),
                        WaitTime = 12,
                        BaggageWeight = 31,
                        QueueNumber = "VIP-001"
                    },
                    new()
                    {
                        Id = "PAS-VIP-002",
                        Name = "Gulnora Karimova",
                        PassportNumber = "KA501405",
                        FlightNumber = "HY-771",
                        Destination = "Dubai (DXB)",
                        Class = PassengerClass.VIP,
                        VipReason = "CIP Lounge Guest",
                        Status = "Waiting",
                        ArrivalTime = DateTime.UtcNow.AddMinutes(-5),
                        WaitTime = 5,
                        BaggageWeight = 14,
                        QueueNumber = "VIP-002"
                    }
                };

                // Seed initial waiting Regular passengers
                _regularQueue = new List<Passenger>
                {
                    new()
                    {
                        Id = "PAS-REG-001",
                        Name = "Jasur Umarov",
                        PassportNumber = "AA451122",
                        FlightNumber = "HY-273",
                        Destination = "Istanbul (IST)",
                        Class = PassengerClass.Regular,
                        Status = "Waiting",
                        ArrivalTime = DateTime.UtcNow.AddMinutes(-25),
                        WaitTime = 25,
                        BaggageWeight = 22,
                        QueueNumber = "REG-101"
                    },
                    new()
                    {
                        Id = "PAS-REG-002",
                        Name = "Sayyora Ergasheva",
                        PassportNumber = "AB012354",
                        FlightNumber = "HY-513",
                        Destination = "Seoul (ICN)",
                        Class = PassengerClass.Regular,
                        Status = "Waiting",
                        ArrivalTime = DateTime.UtcNow.AddMinutes(-18),
                        WaitTime = 18,
                        BaggageWeight = 23,
                        QueueNumber = "REG-102"
                    },
                    new()
                    {
                        Id = "PAS-REG-003",
                        Name = "Sherzod Alimov",
                        PassportNumber = "AC901140",
                        FlightNumber = "HY-601",
                        Destination = "Moscow (DME)",
                        Class = PassengerClass.Regular,
                        Status = "Waiting",
                        ArrivalTime = DateTime.UtcNow.AddMinutes(-10),
                        WaitTime = 10,
                        BaggageWeight = 18,
                        QueueNumber = "REG-103"
                    },
                    new()
                    {
                        Id = "PAS-REG-004",
                        Name = "Dora Abdullayeva",
                        PassportNumber = "AB762145",
                        FlightNumber = "HY-273",
                        Destination = "Istanbul (IST)",
                        Class = PassengerClass.Regular,
                        Status = "Waiting",
                        ArrivalTime = DateTime.UtcNow.AddMinutes(-2),
                        WaitTime = 2,
                        BaggageWeight = 8,
                        QueueNumber = "REG-104"
                    }
                };
            }
        }

        private void UpdateWaitTimes(object? state)
        {
            lock (_lock)
            {
                foreach (var p in _vipQueue)
                {
                    p.WaitTime = (int)Math.Max(0, (DateTime.UtcNow - p.ArrivalTime).TotalMinutes);
                }
                foreach (var p in _regularQueue)
                {
                    p.WaitTime = (int)Math.Max(0, (DateTime.UtcNow - p.ArrivalTime).TotalMinutes);
                }
            }
        }

        public QueueStateResponse GetState()
        {
            lock (_lock)
            {
                return new QueueStateResponse
                {
                    Desks = _desks.Select(CloneHelp.CloneDesk).ToList(),
                    VipQueue = _vipQueue.Select(CloneHelp.ClonePassenger).ToList(),
                    RegularQueue = _regularQueue.Select(CloneHelp.ClonePassenger).ToList(),
                    History = _doneHistory.AsEnumerable().Reverse().Take(10).Select(CloneHelp.ClonePassenger).ToList(),
                    Flights = FlightList,
                    Stats = GetStatsInternal()
                };
            }
        }

        private QueueStats GetStatsInternal()
        {
            int activeCount = _desks.Count(d => d.Status != "Closed");
            int totalProcessed = _doneHistory.Count;

            double totalBaggage = _doneHistory.Sum(p => p.BaggageWeight) +
                                 _vipQueue.Sum(p => p.BaggageWeight) +
                                 _regularQueue.Sum(p => p.BaggageWeight);
            int passengerCount = _doneHistory.Count + _vipQueue.Count + _regularQueue.Count;
            if (passengerCount == 0) passengerCount = 1;

            var doneVip = _doneHistory.Where(p => p.Class == PassengerClass.VIP).ToList();
            var doneRegular = _doneHistory.Where(p => p.Class == PassengerClass.Regular).ToList();

            int avgWaitVip = doneVip.Any() 
                ? (int)Math.Round(doneVip.Average(p => p.WaitTime))
                : (_vipQueue.Any() ? (int)Math.Round(_vipQueue.Average(p => p.WaitTime)) : 4);

            int avgWaitRegular = doneRegular.Any() 
                ? (int)Math.Round(doneRegular.Average(p => p.WaitTime))
                : (_regularQueue.Any() ? (int)Math.Round(_regularQueue.Average(p => p.WaitTime)) : 12);

            return new QueueStats
            {
                TotalWaitingVIP = _vipQueue.Count,
                TotalWaitingRegular = _regularQueue.Count,
                TotalProcessedCount = totalProcessed,
                AverageWaitTimeVIP = avgWaitVip,
                AverageWaitTimeRegular = avgWaitRegular,
                AverageBaggageWeight = Math.Round(totalBaggage / passengerCount, 1),
                ActiveDesksCount = activeCount
            };
        }

        public Passenger AddPassenger(AddPassengerRequest req)
        {
            lock (_lock)
            {
                bool isVip = req.Class.Equals("VIP", StringComparison.OrdinalIgnoreCase);
                string prefix = isVip ? "VIP" : "REG";
                int passportRand = new Random().Next(100000, 999999);

                string ticketId = isVip
                    ? $"VIP-{(_vipQueue.Count + 1):D3}"
                    : $"REG-{_nextTicketNumber++}";

                var p = new Passenger
                {
                    Id = $"PAS-{prefix}-{new Random().Next(1000, 9999)}",
                    Name = req.Name.Trim(),
                    PassportNumber = $"KA{passportRand}",
                    FlightNumber = req.FlightNumber,
                    Destination = string.IsNullOrEmpty(req.Destination) ? "Istanbul (IST)" : req.Destination,
                    Class = isVip ? PassengerClass.VIP : PassengerClass.Regular,
                    VipReason = isVip ? req.VipReason : "None",
                    Status = "Waiting",
                    ArrivalTime = DateTime.UtcNow,
                    WaitTime = 0,
                    BaggageWeight = req.BaggageWeight <= 0 ? 12 : req.BaggageWeight,
                    QueueNumber = ticketId
                };

                if (isVip)
                {
                    _vipQueue.Add(p);
                }
                else
                {
                    _regularQueue.Add(p);
                }

                return p;
            }
        }

        public int SimulateBulk()
        {
            lock (_lock)
            {
                string[] firstNames = { "Aliyor", "Malika", "Dilshod", "Sardor", "Nigora", "Shokhrukh", "Farrukh", "Feruza", "Davron", "Zukhra", "Jahongir", "Otabek" };
                string[] lastNames = { "Karimov", "Rakhimov", "Umarov", "Sodiqov", "Khusanov", "Alimov", "Tashpulatov", "Yunusov", "Abduvakhitov", "Rustamov" };
                string[] reasons = { "Business Class", "First Class", "Premium Loyalty", "CIP Lounge Guest", "Diplomacy/Gov" };

                var rand = new Random();
                int countAdded = 0;

                for (int i = 0; i < 5; i++)
                {
                    bool isVip = rand.NextDouble() < 0.4; // 40% chance of VIP
                    string name = $"{firstNames[rand.Next(firstNames.Length)]} {lastNames[rand.Next(lastNames.Length)]}";
                    var flight = FlightList[rand.Next(FlightList.Count)];
                    int passportRand = rand.Next(100000, 999999);
                    int baggage = rand.Next(5, 40);

                    string queueNum = isVip
                        ? $"VIP-{(_vipQueue.Count + 1):D3}"
                        : $"REG-{_nextTicketNumber++}";

                    var p = new Passenger
                    {
                        Id = $"PAS-{(isVip ? "VIP" : "REG")}-{rand.Next(1000, 9999)}",
                        Name = name,
                        PassportNumber = $"KA{passportRand}",
                        FlightNumber = flight.FlightNumber,
                        Destination = flight.Destination,
                        Class = isVip ? PassengerClass.VIP : PassengerClass.Regular,
                        VipReason = isVip ? reasons[rand.Next(reasons.Length)] : "None",
                        Status = "Waiting",
                        ArrivalTime = DateTime.UtcNow.AddMinutes(-rand.Next(2, 15)),
                        WaitTime = rand.Next(2, 15),
                        BaggageWeight = baggage,
                        QueueNumber = queueNum
                    };

                    if (isVip)
                    {
                        _vipQueue.Add(p);
                    }
                    else
                    {
                        _regularQueue.Add(p);
                    }
                    countAdded++;
                }

                return countAdded;
            }
        }

        public (bool Success, string Message, CheckInDesk? Desk) CallNextPassenger(int deskId)
        {
            lock (_lock)
            {
                var desk = _desks.FirstOrDefault(d => d.Id == deskId);
                if (desk == null)
                {
                    return (false, "Desk selection not found.", null);
                }

                if (desk.Status == "Closed")
                {
                    return (false, "Cannot assign to a closed counter.", null);
                }

                if (desk.CurrentPassenger != null)
                {
                    return (false, "Desk is currently busy processing another passenger. Please complete existing check-in first.", null);
                }

                Passenger? selectedPassenger = null;

                if (desk.Type == "VIP")
                {
                    if (_vipQueue.Any())
                    {
                        selectedPassenger = _vipQueue[0];
                        _vipQueue.RemoveAt(0);
                    }
                    else
                    {
                        return (false, "VIP queue is empty. This CIP/VIP desk remains on high alert exclusively for VIP arrivals.", null);
                    }
                }
                else if (desk.Type == "Priority")
                {
                    if (_vipQueue.Any())
                    {
                        selectedPassenger = _vipQueue[0];
                        _vipQueue.RemoveAt(0);
                    }
                    else if (_regularQueue.Any())
                    {
                        selectedPassenger = _regularQueue[0];
                        _regularQueue.RemoveAt(0);
                    }
                    else
                    {
                        return (false, "All queues are fully cleared. Counter standing idle.", null);
                    }
                }
                else // Regular
                {
                    if (_regularQueue.Any())
                    {
                        selectedPassenger = _regularQueue[0];
                        _regularQueue.RemoveAt(0);
                    }
                    else if (_vipQueue.Count > 3)
                    {
                        // Cross-flow dispatching for severe VIP congestion
                        selectedPassenger = _vipQueue[0];
                        _vipQueue.RemoveAt(0);
                    }
                    else
                    {
                        return (false, "Regular queues are clear.", null);
                    }
                }

                if (selectedPassenger != null)
                {
                    var rand = new Random();
                    selectedPassenger.Status = "In-Service";
                    selectedPassenger.ServiceTime = DateTime.UtcNow;

                    int seatRow = selectedPassenger.Class == PassengerClass.VIP ? rand.Next(1, 5) : rand.Next(6, 40);
                    string seatLetter = new[] { "A", "C", "D", "F" }[rand.Next(4)];
                    selectedPassenger.SeatAssignment = $"{seatRow}{seatLetter}";

                    desk.CurrentPassenger = selectedPassenger;
                    desk.Status = "Processing";

                    return (true, "Passenger successfully called.", desk);
                }

                return (false, "No passenger available.", null);
            }
        }

        public (bool Success, string Message, Passenger? Passenger, CheckInDesk? Desk) CompletePassenger(int deskId)
        {
            lock (_lock)
            {
                var desk = _desks.FirstOrDefault(d => d.Id == deskId);
                if (desk == null)
                {
                    return (false, "Desk not found.", null, null);
                }

                if (desk.CurrentPassenger == null)
                {
                    return (false, "This desk does not have an active passenger.", null, null);
                }

                var completedPassenger = desk.CurrentPassenger;
                completedPassenger.Status = "Done";

                _doneHistory.Add(completedPassenger);
                desk.ProcessedCount++;

                var rand = new Random();
                int serviceSimTime = desk.ProcessedCount * 120 + rand.Next(1, 60);
                desk.AverageProcessingTime = (int)Math.Round((double)serviceSimTime / desk.ProcessedCount);

                desk.CurrentPassenger = null;
                desk.Status = "Idle";

                return (true, "Check-in completed.", completedPassenger, desk);
            }
        }

        public CheckInDesk ToggleDesk(int deskId)
        {
            lock (_lock)
            {
                var desk = _desks.FirstOrDefault(d => d.Id == deskId);
                if (desk == null)
                {
                    throw new KeyNotFoundException("Desk check-in counter not found.");
                }

                if (desk.Status == "Closed")
                {
                    desk.Status = "Idle";
                }
                else
                {
                    if (desk.CurrentPassenger != null)
                    {
                        var p = desk.CurrentPassenger;
                        p.Status = "Waiting";
                        if (p.Class == PassengerClass.VIP)
                        {
                            _vipQueue.Insert(0, p);
                        }
                        else
                        {
                            _regularQueue.Insert(0, p);
                        }
                        desk.CurrentPassenger = null;
                    }
                    desk.Status = "Closed";
                }

                return desk;
            }
        }
    }

    internal static class CloneHelp
    {
        public static Passenger ClonePassenger(Passenger src)
        {
            return new Passenger
            {
                Id = src.Id,
                Name = src.Name,
                PassportNumber = src.PassportNumber,
                FlightNumber = src.FlightNumber,
                Destination = src.Destination,
                Class = src.Class,
                VipReason = src.VipReason,
                Status = src.Status,
                ArrivalTime = src.ArrivalTime,
                ServiceTime = src.ServiceTime,
                WaitTime = src.WaitTime,
                BaggageWeight = src.BaggageWeight,
                SeatAssignment = src.SeatAssignment,
                QueueNumber = src.QueueNumber
            };
        }

        public static CheckInDesk CloneDesk(CheckInDesk src)
        {
            return new CheckInDesk
            {
                Id = src.Id,
                Name = src.Name,
                Type = src.Type,
                Status = src.Status,
                CurrentPassenger = src.CurrentPassenger != null ? ClonePassenger(src.CurrentPassenger) : null,
                ProcessedCount = src.ProcessedCount,
                AverageProcessingTime = src.AverageProcessingTime
            };
        }
    }
}
