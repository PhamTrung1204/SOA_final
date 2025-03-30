using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class CustomerController : Controller
    {
        private readonly IApiService _apiService;

        public CustomerController(IApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<IActionResult> Index()
        {
            var customers = await _apiService.GetCustomersAsync();
            return View(customers);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Customer customer)
        {
            if (ModelState.IsValid)
            {
                await _apiService.CreateCustomerAsync(customer);
                return RedirectToAction("Index");
            }
            return View(customer);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var customer = await _apiService.GetCustomerAsync(id);
            return View(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, Customer customer)
        {
            if (ModelState.IsValid)
            {
                await _apiService.UpdateCustomerAsync(id, customer);
                return RedirectToAction("Index");
            }
            return View(customer);
        }

        public async Task<IActionResult> Details(int id)
        {
            var customer = await _apiService.GetCustomerAsync(id);
            return View(customer);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _apiService.GetCustomerAsync(id);
            return View(customer);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _apiService.DeleteCustomerAsync(id);
            return RedirectToAction("Index");
        }
    }
}