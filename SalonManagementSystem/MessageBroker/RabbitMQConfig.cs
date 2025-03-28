using Microsoft.Extensions.Configuration;

namespace MessageBroker
{
    public class RabbitMQConfig
    {
        public string HostName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }

        public RabbitMQConfig(IConfiguration configuration)
        {
            HostName = configuration["RabbitMQ:HostName"] ?? string.Empty;
            UserName = configuration["RabbitMQ:UserName"] ?? string.Empty;
            Password = configuration["RabbitMQ:Password"] ?? string.Empty;
        }
    }
}
