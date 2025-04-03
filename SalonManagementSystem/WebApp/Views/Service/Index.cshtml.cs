using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SalonManagementSystem.Shared.Models;
using WebApp.Services;

namespace WebApp.Pages.Service
{
    public class IndexModel : PageModel
    {
        private readonly IApiService _apiService;

        public IndexModel(IApiService apiService)
        {
            _apiService = apiService;
        }

        public List<SalonManagementSystem.Shared.Models.Service> Services { get; set; } = new List<SalonManagementSystem.Shared.Models.Service>();

        public async Task OnGetAsync()
        {
            try
            {
                Services = await _apiService.GetServicesAsync();
            }
            catch (Exception ex)
            {
                Services = new List<SalonManagementSystem.Shared.Models.Service>();
                TempData["Error"] = $"Lỗi: {ex.Message}";
            }
        }
    }
}