using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.EventHandlers
{
    public class StaffScheduleUpdatedHandler
    {
        public void Handle(StaffScheduleUpdatedEvent @event)
        {
            // Thông báo cho các dịch vụ liên quan
            Console.WriteLine($"Staff schedule updated for staff {@event.StaffId} on {@event.NewScheduleDate}");
        }
    }

}
