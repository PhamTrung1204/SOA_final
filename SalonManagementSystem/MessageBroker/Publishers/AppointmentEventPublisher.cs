using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Publishers
{
    public class AppointmentEventPublisher
    {
        private readonly RabbitMQConfig _rabbitMQConfig;

        public AppointmentEventPublisher(RabbitMQConfig rabbitMQConfig)
        {
            _rabbitMQConfig = rabbitMQConfig;
        }

        public void PublishAppointmentBookedEvent(AppointmentBookedEvent @event)
        {
            _rabbitMQConfig.PublishMessage("appointment_booked", @event);
        }
    }

}
