// RabbitMQ Configuration
using RabbitMQ.Client;
using System;
using System.Text;

namespace MessageBroker
{
    public class RabbitMqConfig
    {
        public static IConnection GetConnection()
        {
            var factory = new ConnectionFactory
            {
                HostName = "localhost", // Địa chỉ RabbitMQ
                UserName = "guest",     // Tài khoản mặc định
                Password = "guest"      // Mật khẩu mặc định
            };
            return factory.CreateConnection(); // Phương thức CreateConnection() có sẵn trong RabbitMQ.Client phiên bản 7.x
        }
    }

    public class RabbitMqPublisher
    {
        public static void PublishMessage(string queueName, string message)
        {
            using (var connection = RabbitMqConfig.GetConnection())
            using (var channel = connection.CreateModel())
            {
                // Khai báo queue nếu chưa tồn tại
                channel.QueueDeclare(queue: queueName,
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                var body = Encoding.UTF8.GetBytes(message);

                // Gửi message đến queue
                channel.BasicPublish(exchange: "",
                                     routingKey: queueName,
                                     basicProperties: null,
                                     body: body);

                Console.WriteLine($"[x] Sent: {message}");
            }
        }
    }
}
