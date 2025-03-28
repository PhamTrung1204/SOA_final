using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace ServiceDiscovery
{
    public class ConsulService
    {
        private readonly ConsulConfig _consulConfig;

        public ConsulService(IConfiguration configuration)
        {
            _consulConfig = new ConsulConfig(configuration);
        }

        //public async Task RegisterAsync(string serviceName, string serviceId, string host, int port)
        //{
        //    await _consulConfig.RegisterServiceAsync(serviceName, serviceId, host, port);
        //}

        public async Task DeregisterAsync(string serviceId)
        {
            await _consulConfig.DeregisterServiceAsync(serviceId);
        }

        public async Task<Uri> DiscoverServiceAsync(string serviceName)
        {
            return await _consulConfig.GetServiceUriAsync(serviceName);
        }
    }
}