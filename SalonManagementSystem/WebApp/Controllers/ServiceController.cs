using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class ServiceController : Controller
    {
        private readonly IApiService _apiService;

        public ServiceController(IApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<IActionResult> Index()
        {
            var services = await _apiService.GetServicesAsync();
            return View(services);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Service service)
        {
            if (ModelState.IsValid)
            {
                await _apiService.CreateServiceAsync(service);
                return RedirectToAction("Index");
            }
            return View(service);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var service = await _apiService.GetServiceAsync(id);
            return View(service);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, Service service)
        {
            if (ModelState.IsValid)
            {
                await _apiService.UpdateServiceAsync(id, service);
                return RedirectToAction("Index");
            }
            return View(service);
        }

        public async Task<IActionResult> Details(int id)
        {
            var service = await _apiService.GetServiceAsync(id);
            return View(service);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var service = await _apiService.GetServiceAsync(id);
            return View(service);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _apiService.DeleteServiceAsync(id);
            return RedirectToAction("Index");
        }
    }
}