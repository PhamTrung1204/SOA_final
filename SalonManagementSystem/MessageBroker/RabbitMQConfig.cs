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
            HostName = configuration["RabbitMQ:HostName"];
            UserName = configuration["RabbitMQ:UserName"];
            Password = configuration["RabbitMQ:Password"];
        }
    }
}
