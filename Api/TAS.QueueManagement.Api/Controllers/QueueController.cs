using Microsoft.AspNetCore.Mvc;
using TAS.QueueManagement.Api.Models;
using TAS.QueueManagement.Api.Services;

namespace TAS.QueueManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QueueController : ControllerBase
    {
        private readonly IQueueService _queueService;

        public QueueController(IQueueService queueService)
        {
            _queueService = queueService;
        }

        // GET: api/queue/state
        [HttpGet("state")]
        public IActionResult GetState()
        {
            var state = _queueService.GetState();
            return Ok(state);
        }

        // POST: api/queue/passenger/add
        [HttpPost("passenger/add")]
        public IActionResult AddPassenger([FromBody] AddPassengerRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.FlightNumber))
            {
                return BadRequest(new { error = "Name and Flight Number are required fields." });
            }

            var passenger = _queueService.AddPassenger(request);
            var state = _queueService.GetState();
            return Ok(new { success = true, passenger, stats = state.Stats });
        }

        // POST: api/queue/passenger/simulate-bulk
        [HttpPost("passenger/simulate-bulk")]
        public IActionResult SimulateBulk()
        {
            int addedCount = _queueService.SimulateBulk();
            var state = _queueService.GetState();
            return Ok(new { success = true, count = addedCount, stats = state.Stats });
        }

        // POST: api/queue/desk/process
        [HttpPost("desk/process")]
        public IActionResult CallPassenger([FromBody] CallPassengerRequest request)
        {
            var result = _queueService.CallNextPassenger(request.DeskId);
            var state = _queueService.GetState();

            if (!result.Success)
            {
                // Return 200 with success = false as per original node API contract
                return Ok(new { success = false, message = result.Message, stats = state.Stats });
            }

            return Ok(new { success = true, desk = result.Desk, stats = state.Stats });
        }

        // POST: api/queue/desk/complete
        [HttpPost("desk/complete")]
        public IActionResult CompletePassenger([FromBody] CompletePassengerRequest request)
        {
            var result = _queueService.CompletePassenger(request.DeskId);
            var state = _queueService.GetState();

            if (!result.Success)
            {
                return BadRequest(new { error = result.Message });
            }

            return Ok(new { success = true, passenger = result.Passenger, desk = result.Desk, stats = state.Stats });
        }

        // POST: api/queue/desk/toggle
        [HttpPost("desk/toggle")]
        public IActionResult ToggleDesk([FromBody] ToggleDeskRequest request)
        {
            try
            {
                var desk = _queueService.ToggleDesk(request.DeskId);
                var state = _queueService.GetState();
                return Ok(new { success = true, desk, stats = state.Stats });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        // POST: api/queue/reset
        [HttpPost("reset")]
        public IActionResult ResetQueue()
        {
            _queueService.ResetQueue();
            var state = _queueService.GetState();
            return Ok(new { success = true, desks = state.Desks, vipQueue = state.VipQueue, regularQueue = state.RegularQueue, stats = state.Stats });
        }
    }
}
