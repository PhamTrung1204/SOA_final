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
    public class PaymentProcessedConsumer : BackgroundService
    {
        private readonly RabbitMQConfig _rabbitMQConfig;
        private readonly PaymentProcessedHandler _handler;

        public PaymentProcessedConsumer(RabbitMQConfig rabbitMQConfig, PaymentProcessedHandler handler)
        {
            _rabbitMQConfig = rabbitMQConfig;
            _handler = handler;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _rabbitMQConfig.ConsumeMessage("payment_processed", @event =>
            {
                var paymentEvent = (PaymentProcessedEvent)@event;
                _handler.Handle(paymentEvent);
            }, typeof(PaymentProcessedEvent));
            return Task.CompletedTask;
        }
    }

}
