using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Publishers
{
    public class StaffEventPublisher
    {
        private readonly RabbitMQConfig _rabbitMQConfig;

        public StaffEventPublisher(RabbitMQConfig rabbitMQConfig)
        {
            _rabbitMQConfig = rabbitMQConfig;
        }

        public void PublishStaffScheduleUpdatedEvent(StaffScheduleUpdatedEvent @event)
        {
            _rabbitMQConfig.PublishMessage("staff_schedule_updated", @event);
        }
    }

}
