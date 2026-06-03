using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TAS.QueueManagement.Api.Models;

namespace TAS.QueueManagement.Api.Controllers
{
    [ApiController]
    [Route("api/api-assistant")]
    public class ChatController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public ChatController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("answer")]
        public async Task<IActionResult> GetAssistantAnswer([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { error = "Suriya (Message) bo'sh bo'lishi mumkin emas." });
            }

            string? apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
            if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "MY_GEMINI_API_KEY")
            {
                // Trigger offline fallback
                var offlineResponse = GetOfflineAnswer(request.Message);
                return Ok(offlineResponse);
            }

            try
            {
                var responseText = await CallGeminiApiAsync(request.Message, request.ContextState, apiKey);
                return Ok(new ChatResponse
                {
                    Text = responseText,
                    Source = "server_gemini_api"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gemini API error: {ex.Message}");
                // Gracefully fallback instead of crashing
                var fallback = GetOfflineAnswer(request.Message);
                fallback.Source = "client_fallback_due_to_error";
                return Ok(fallback);
            }
        }

        private ChatResponse GetOfflineAnswer(string message)
        {
            string lowerMsg = message.ToLower();
            string text = "";

            if (lowerMsg.Contains("vip") || lowerMsg.Contains("cip") || lowerMsg.Contains("farq"))
            {
                text = @"Toshkent Xalqaro Aeroportida (TAS) VIP/CIP yo'lovchilar va oddiy yo'lovchilar quyidagi qat'iy mezonlar asosida ajratiladi:

1. **Chipta toifasi (Business/First Class)**: Birinchi toifa va Biznes klass chiptalariga ega barcha yo'lovchilar avtomatik ravishda VIP maqomiga ega bo'ladilar.
2. **Loylallik Dasturi (Frequent Flyer)**: Uzbekistan Airways ""UzAirPlus"" Premium (Gold/Silver) yoki tegishli SkyTeam hamkorlari yuqori darajadagi loyihalariga ega yo'lovchilar.
3. **CIP Hall/Lounge Vouchers**: Maxsus pullik CIP (""Comfort and Information Point"") xizmatlaridan foydalanish vaucheriga ega mehmonlar.
4. **Diplomatik va Davlat delegatsiyasi**: Maxsus diplomatik pasport va rasmiy doiradagi yo'lovchilar.

**Ularga ko'rsatiladigan boshqaruv ustunliklari:**
- **Maxsus Yo'lak**: CIP/VIP yo'lovchilar umuman alohida terminal yoki ""Counter 1 & 2"" kabi tezkor yo'laklar orqali navbatsiz kiradilar.
- **Bortga chiqish (Priority Boarding)**: Maxsus transfer mikroavtobusi va birinchi navbatda samolyotga yo'naltirish.
- **Bagashe (Priority Tag)**: Yuklariga yorqin to'q-sariq ""PRIORITY"" teglari yopishtirilib, birinchi navbatda yetkazib beriladi.";
            }
            else if (lowerMsg.Contains("bagaj") || lowerMsg.Contains("chamadon") || lowerMsg.Contains("vazn") || lowerMsg.Contains("og'irlik"))
            {
                text = @"Toshkent aeroportida Uzbekistan Airways uchun standart bagaj mezonlari:
- **Ekonom klass (Regular)**: 1 dona 23 kg gacha bepul yuk + 8 kg qo'l yuki.
- **Biznes klass (VIP)**: 2 dona 32 kg gacha bepul yuk + 10 kg qo'l yuki.
Ortiqcha vazn uchun CIP zallarida ham qo'shimcha to'lov tariflari qo'llaniladi. Sizning yukingizni Counter 4 (Luggage Drop) darchasida o'lchatishingiz mumkin!";
            }
            else if (lowerMsg.Contains("ny") || lowerMsg.Contains("new york") || lowerMsg.Contains("hy-101"))
            {
                text = @"HY-101 reysi Toshkentdan Nyu-Yorkka (JFK) soat 13:45 da jo'nab ketadi. 
Check-in B3 darvozasi terminali yaqinida va hozirda ochiq. VIP yo'lovchilar avtomatik ravishda fast-track CIP xizmati bilan ""Counter 1"" dan tezkor ro'yxatdan o'tishadi.";
            }
            else
            {
                text = @"Assalomu alaykum! Toshkent Xalqaro Aeroporti (TAS - Terminal 2) Aqlli Navbat Tizimi bo'yicha yordamchingizman. 
Sizga check-in navbati, VIP/CIP koridorlari, pasport nazorati va bagaj qoidalari bo'yicha o'zbek yoki ingliz tilida ma'lumot berishim mumkin. 
Savolingizni yo'llang, masalan: ""Tizimda VIP va oddiy yo'lovchilar qanday ajratiladi?""";
            }

            return new ChatResponse
            {
                Text = text,
                Source = "offline_local_expert"
            };
        }

        private async Task<string> CallGeminiApiAsync(string message, ChatContextState? context, string apiKey)
        {
            var httpClient = _httpClientFactory.CreateClient();
            string endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

            int vipCount = context?.Stats?.TotalWaitingVIP ?? 0;
            int regularCount = context?.Stats?.TotalWaitingRegular ?? 0;
            int activeCounters = context?.Stats?.ActiveDesksCount ?? 4;
            int waitVip = context?.Stats?.AverageWaitTimeVIP ?? 3;
            int waitReg = context?.Stats?.AverageWaitTimeRegular ?? 14;

            var SystemInstruction = "You are the Tashkent International Airport VIP Operations manager. Keep answers structured, highly accurate regarding flight HY operations, and hospitable.";
            
            var prompt = $@"You are the Official Tashkent International Airport (TAS) AI Terminal Operations Assistant.
Your audience are passengers, airport dispatch staff, and border security officers standing in Tashkent Terminal 2.
Answer questions professionally, warmly, and in detail in Uzbek (preferred) or beautifully in English based on client input.

The current system queue state context is:
- VIP pending queue size: {vipCount}
- Regular pending queue size: {regularCount}
- Active check-in counters: {activeCounters}
- Average waiting time for VIP is {waitVip} mins, Regular is {waitReg} mins.

User Question: ""{message}""

Formulate a helpful, comprehensive airport expert response. If asked about how VIP and Regular passengers are separated (""VIP va oddiy yo'lovchilarni qanday ajratasiz?""), explain the separation strategy at Tashkent Airport clearly (dedicated VIP/CIP desks vs economy, ticket boarding classes, UzAirPlus gold status, priority baggage tagging as priority orange, VIP Fast-track corridors). Use concise list formatting.";

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                },
                systemInstruction = new
                {
                    parts = new[] { new { text = SystemInstruction } }
                }
            };

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, endpoint)
            {
                Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
            };

            var httpResponse = await httpClient.SendAsync(requestMessage);
            httpResponse.EnsureSuccessStatusCode();

            string resJson = await httpResponse.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(resJson);
            
            // Navigate JSON response: candidates[0].content.parts[0].text
            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return text ?? "Unable to formulate a response.";
        }
    }
}
