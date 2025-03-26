using Microsoft.AspNetCore.Mvc;

namespace CustomerService.Controllers
{
    public class CustomerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
