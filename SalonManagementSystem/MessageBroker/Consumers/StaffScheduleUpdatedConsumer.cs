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
    public class StaffScheduleUpdatedConsumer : BackgroundService
    {
        private readonly RabbitMQConfig _rabbitMQConfig;
        private readonly StaffScheduleUpdatedHandler _handler;

        public StaffScheduleUpdatedConsumer(RabbitMQConfig rabbitMQConfig, StaffScheduleUpdatedHandler handler)
        {
            _rabbitMQConfig = rabbitMQConfig;
            _handler = handler;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _rabbitMQConfig.ConsumeMessage("staff_schedule_updated", @event =>
            {
                var staffEvent = (StaffScheduleUpdatedEvent)@event;
                _handler.Handle(staffEvent);
            }, typeof(StaffScheduleUpdatedEvent));
            return Task.CompletedTask;
        }
    }

}
