using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using System.Text.Json;

public class RabbitMQConfig : IDisposable
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public RabbitMQConfig(string hostName)
    {
        var factory = new ConnectionFactory { HostName = hostName };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
    }

    public void PublishMessage(string queue, object message)
    {
        _channel.QueueDeclare(queue: queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        _channel.BasicPublish(exchange: "", routingKey: queue, basicProperties: null, body: body);
    }

    public void ConsumeMessage(string queue, Action<object> handler, Type eventType)
    {
        _channel.QueueDeclare(queue: queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var @event = JsonSerializer.Deserialize(message, eventType);
            handler(@event);
        };
        _channel.BasicConsume(queue: queue, autoAck: true, consumer: consumer);
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}
