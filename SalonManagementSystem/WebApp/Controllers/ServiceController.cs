using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SalonManagementSystem.Shared.Models;
using System.Collections.Generic;

namespace WebApp.Controllers
{
    public class ServiceController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly string baseUrl = "http://apigateway:8080/api/service";

        public ServiceController(IHttpClientFactory factory)
        {
            _httpClient = factory.CreateClient();
        }

        public async Task<IActionResult> Index()
        {
            var response = await _httpClient.GetAsync(baseUrl);
            if (!response.IsSuccessStatusCode) return View(new List<Service>());
            var data = await response.Content.ReadAsStringAsync();
            var services = JsonConvert.DeserializeObject<List<Service>>(data);
            return View(services);
        }

        public IActionResult Create() => View();

        [HttpPost]
        public async Task<IActionResult> Create(Service service)
        {
            var content = new StringContent(JsonConvert.SerializeObject(service), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(baseUrl, content);
            if (!response.IsSuccessStatusCode) return View(service);
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Edit(int id)
        {
            var response = await _httpClient.GetAsync($"{baseUrl}/{id}");
            if (!response.IsSuccessStatusCode) return NotFound();
            var data = await response.Content.ReadAsStringAsync();
            var service = JsonConvert.DeserializeObject<Service>(data);
            return View(service);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Service service)
        {
            var content = new StringContent(JsonConvert.SerializeObject(service), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"{baseUrl}/{service.ServiceId}", content);
            if (!response.IsSuccessStatusCode) return View(service);
            return RedirectToAction("Index");
        }
    }
}