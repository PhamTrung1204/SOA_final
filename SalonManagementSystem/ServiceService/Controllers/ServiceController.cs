using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using ServiceService.Services;

namespace ServiceService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly ServiceHandler _service;

        public ServiceController(ServiceHandler service)
        {
            _service = service;
        }

        // GET: api/Service/5
        [HttpGet("{id}")]
        public ActionResult<Service> GetService(int id)
        {
            var result = _service.GetService(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // POST: api/Service
        [HttpPost]
        public ActionResult<Service> PostService([FromBody] Service service)
        {
            _service.CreateService(service);
            return CreatedAtAction(nameof(GetService), new { id = service.ServiceId }, service);
        }


        // PUT: api/Service/5
        [HttpPut("{id}")]
        public IActionResult PutService(int id, [FromBody] Service service)
        {
            if (id != service.ServiceId)
                return BadRequest("ID mismatch");

            _service.UpdateService(service);
            return NoContent();
        }
    }
}
