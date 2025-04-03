using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SalonManagementSystem.Shared.Models;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace WebApp.Pages.Service
{
    public class EditModel : PageModel
    {
        private readonly HttpClient _httpClient;

        public EditModel(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [BindProperty]
        public SalonManagementSystem.Shared.Models.Service Service { get; set; }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            var response = await _httpClient.GetAsync($"http://localhost:5000/api/services/{id}");
            if (!response.IsSuccessStatusCode) return NotFound();

            Service = await response.Content.ReadFromJsonAsync<SalonManagementSystem.Shared.Models.Service>();
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var response = await _httpClient.PutAsJsonAsync($"http://localhost:5000/api/services/{Service.ServiceId}", Service);
            if (!response.IsSuccessStatusCode) return BadRequest();

            return RedirectToPage("/Service/Index"); // hoặc bất kỳ trang nào bạn muốn quay lại
        }
    }
}
