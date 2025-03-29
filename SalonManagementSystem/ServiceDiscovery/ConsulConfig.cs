using Consul;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ServiceDiscovery
{
    public class ConsulConfig
    {
        private readonly IConsulClient _consulClient;
        private readonly IConfiguration _configuration;

        public ConsulConfig(IConfiguration configuration)
        {
            _configuration = configuration;

            // Lấy giá trị từ biến môi trường "CONSUL_HOST"
            var consulHostEnv = Environment.GetEnvironmentVariable("CONSUL_HOST");

            // Nếu có biến môi trường, xây dựng URL theo format "http://{consulHostEnv}:8500"
            // Nếu không, lấy cấu hình từ _configuration["Consul:Address"] hoặc mặc định "http://localhost:8500"
            string consulUrl = !string.IsNullOrEmpty(consulHostEnv)
                ? $"http://{consulHostEnv}:8500"
                : (_configuration["Consul:Address"] ?? "http://localhost:8500");

            _consulClient = new ConsulClient(cfg =>
            {
                cfg.Address = new Uri(consulUrl);
            });
        }


        public async Task RegisterServiceAsync(string serviceName, string serviceId, string host, int port)
        {
            var registration = new AgentServiceRegistration
            {
                ID = serviceId,
                Name = serviceName,
                Address = host,
                Port = port,
                Check = new AgentServiceCheck
                {
                    DeregisterCriticalServiceAfter = TimeSpan.FromMinutes(1),
                    Interval = TimeSpan.FromSeconds(10),
                    HTTP = $"http://{host}:{port}/health",
                    Timeout = TimeSpan.FromSeconds(5)
                }
            };

            await _consulClient.Agent.ServiceRegister(registration);
            Console.WriteLine($"Service {serviceName} registered with Consul.");
        }

        public async Task DeregisterServiceAsync(string serviceId)
        {
            await _consulClient.Agent.ServiceDeregister(serviceId);
            Console.WriteLine($"Service {serviceId} deregistered from Consul.");
        }

        public async Task<Uri> GetServiceUriAsync(string serviceName)
        {
            var queryResult = await _consulClient.Health.Service(serviceName, "", true);
            var services = queryResult.Response.Select(r => r.Service).ToArray();
            if (services.Length == 0)
                throw new Exception($"No healthy instances found for {serviceName}");

            var service = services[0]; // Có thể thêm logic chọn ngẫu nhiên hoặc load balancing
            return new Uri($"http://{service.Address}:{service.Port}");
        }
    }
}