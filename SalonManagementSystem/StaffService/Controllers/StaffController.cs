using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using StaffService.Services;

namespace StaffService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly StaffHandler _staffService;

        public StaffController(StaffHandler staffService)
        {
            _staffService = staffService;
        }

        [HttpGet("{id}")]
        public ActionResult<Staff> GetStaff(int id)
        {
            var staff = _staffService.GetStaff(id);
            return staff == null ? NotFound() : Ok(staff);
        }

        [HttpPost]
        public IActionResult PostStaff([FromBody] Staff staff)
        {
            _staffService.CreateStaff(staff);
            return CreatedAtAction(nameof(GetStaff), new { id = staff.StaffId }, staff);
        }

        [HttpGet("{id}/schedules")]
        public ActionResult<List<Schedule>> GetSchedules(int id)
        {
            var schedules = _staffService.GetSchedulesForStaff(id);
            return Ok(schedules);
        }

        [HttpPost("schedule")]
        public IActionResult PostSchedule([FromBody] Schedule schedule)
        {
            _staffService.AddSchedule(schedule);
            return Ok(schedule);
        }
    }
}
