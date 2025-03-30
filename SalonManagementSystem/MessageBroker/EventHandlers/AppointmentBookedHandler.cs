using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.EventHandlers
{
    public class AppointmentBookedHandler
    {
        public void Handle(AppointmentBookedEvent @event)
        {
            // Gửi email xác nhận lịch hẹn
            Console.WriteLine($"Sending confirmation email for appointment {@event.AppointmentId}");
        }
    }
}
