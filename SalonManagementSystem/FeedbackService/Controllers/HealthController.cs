using Microsoft.AspNetCore.Mvc;

namespace FeedbackService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HealthController : Controller
    {
        [HttpGet]
        public IActionResult Get() => Ok("healthy");
    }
}
