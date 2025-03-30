using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class StaffController : Controller
    {
        private readonly IApiService _apiService;

        public StaffController(IApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<IActionResult> Index()
        {
            var staff = await _apiService.GetStaffAsync();
            return View(staff);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Staff staff)
        {
            if (ModelState.IsValid)
            {
                await _apiService.CreateStaffAsync(staff);
                return RedirectToAction("Index");
            }
            return View(staff);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var staff = await _apiService.GetStaffAsync(id);
            return View(staff);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, Staff staff)
        {
            if (ModelState.IsValid)
            {
                await _apiService.UpdateStaffAsync(id, staff);
                return RedirectToAction("Index");
            }
            return View(staff);
        }

        public async Task<IActionResult> Details(int id)
        {
            var staff = await _apiService.GetStaffAsync(id);
            return View(staff);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var staff = await _apiService.GetStaffAsync(id);
            return View(staff);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _apiService.DeleteStaffAsync(id);
            return RedirectToAction("Index");
        }
    }
}