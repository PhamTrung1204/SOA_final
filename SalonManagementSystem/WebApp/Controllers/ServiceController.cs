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
        // Sử dụng URL của API Gateway theo cấu hình Ocelot
        private readonly string baseUrl = "http://localhost:5000/api/services";

        public ServiceController(IHttpClientFactory factory)
        {
            _httpClient = factory.CreateClient();
        }

        // Lấy danh sách các dịch vụ
        public async Task<IActionResult> Index()
        {
            var response = await _httpClient.GetAsync(baseUrl);
            if (!response.IsSuccessStatusCode) return View(new List<Service>());
            var data = await response.Content.ReadAsStringAsync();
            var services = JsonConvert.DeserializeObject<List<Service>>(data);
            return View(services);
        }

        // View Create
        public IActionResult Create() => View();

        // Tạo mới dịch vụ
        [HttpPost]
        public async Task<IActionResult> Create(Service service)
        {
            var content = new StringContent(JsonConvert.SerializeObject(service), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(baseUrl, content);
            if (!response.IsSuccessStatusCode)
            {
                // Có thể xử lý lỗi và hiển thị thông báo ở đây
                return View(service);
            }
            return RedirectToAction("Index");
        }

        // Lấy thông tin chi tiết dịch vụ cần chỉnh sửa
        public async Task<IActionResult> Edit(int id)
        {
            var response = await _httpClient.GetAsync($"{baseUrl}/{id}");
            if (!response.IsSuccessStatusCode) return NotFound();
            var data = await response.Content.ReadAsStringAsync();
            var service = JsonConvert.DeserializeObject<Service>(data);
            return View(service);
        }

        // Cập nhật thông tin dịch vụ
        [HttpPost]
        public async Task<IActionResult> Edit(Service service)
        {
            var content = new StringContent(JsonConvert.SerializeObject(service), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"{baseUrl}/{service.ServiceId}", content);
            if (!response.IsSuccessStatusCode)
            {
                // Xử lý lỗi nếu cập nhật thất bại
                return View(service);
            }
            return RedirectToAction("Index");
        }

        // Xóa dịch vụ
        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _httpClient.DeleteAsync($"{baseUrl}/{id}");
            if (!response.IsSuccessStatusCode)
            {
                // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi hoặc log lại
                return RedirectToAction("Index");
            }
            return RedirectToAction("Index");
        }
    }
}
