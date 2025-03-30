using MessageBroker.EventHandlers;
using MessageBroker.Events;
using Microsoft.Extensions.DependencyInjection;
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
        private readonly IServiceProvider _serviceProvider;

        public AppointmentBookedConsumer(RabbitMQConfig rabbitMQConfig, IServiceProvider serviceProvider)
        {
            _rabbitMQConfig = rabbitMQConfig;
            _serviceProvider = serviceProvider;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _rabbitMQConfig.ConsumeMessage("appointment_booked", @event =>
            {
                // Tạo scope mới cho mỗi message
                using (var scope = _serviceProvider.CreateScope())
                {
                    var handler = scope.ServiceProvider.GetRequiredService<AppointmentBookedHandler>();
                    var appointmentEvent = (AppointmentBookedEvent)@event;
                    handler.Handle(appointmentEvent);
                }
            }, typeof(AppointmentBookedEvent));

            return Task.CompletedTask;
        }
    }

}
