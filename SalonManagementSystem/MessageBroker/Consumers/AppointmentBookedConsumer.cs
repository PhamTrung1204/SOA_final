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
    public class AppointmentBookedConsumer : BackgroundService
    {
        private readonly RabbitMQConfig _rabbitMQConfig;
        private readonly AppointmentBookedHandler _handler;

        public AppointmentBookedConsumer(RabbitMQConfig rabbitMQConfig, AppointmentBookedHandler handler)
        {
            _rabbitMQConfig = rabbitMQConfig;
            _handler = handler;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _rabbitMQConfig.ConsumeMessage("appointment_booked", @event =>
            {
                var appointmentEvent = (AppointmentBookedEvent)@event;
                _handler.Handle(appointmentEvent);
            }, typeof(AppointmentBookedEvent));
            return Task.CompletedTask;
        }
    }

}
