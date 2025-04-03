using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SalonManagementSystem.Shared.Models;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace WebApp.Pages.Service
{
    public class DetailsModel : PageModel
    {
        private readonly HttpClient _httpClient;

        public DetailsModel(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public SalonManagementSystem.Shared.Models.Service Service { get; set; }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            var response = await _httpClient.GetAsync($"http://localhost:5000/api/services/{id}");
            if (!response.IsSuccessStatusCode) return NotFound();

            Service = await response.Content.ReadFromJsonAsync<SalonManagementSystem.Shared.Models.Service>();
            return Page();
        }
    }
}
