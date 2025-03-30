using MessageBroker.EventHandlers;
using MessageBroker.Events;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Consumers
{
    public class CustomerRegisteredConsumer : BackgroundService
    {
        private readonly RabbitMQConfig _rabbitMQConfig;
        private readonly CustomerRegisteredHandler _handler;

        public CustomerRegisteredConsumer(RabbitMQConfig rabbitMQConfig, CustomerRegisteredHandler handler)
        {
            _rabbitMQConfig = rabbitMQConfig;
            _handler = handler;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _rabbitMQConfig.ConsumeMessage("customer_registered", @event =>
            {
                var customerEvent = (CustomerRegisteredEvent)@event;
                _handler.Handle(customerEvent);
            }, typeof(CustomerRegisteredEvent));
            return Task.CompletedTask;
        }
    }

}
