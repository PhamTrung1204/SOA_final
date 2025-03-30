using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.EventHandlers
{
    public class FeedbackSubmittedHandler
    {
        public void Handle(FeedbackSubmittedEvent @event)
        {
            // Gửi thông báo cho quản lý
            Console.WriteLine($"New feedback submitted for appointment {@event.AppointmentId} with rating {@event.Rating}");
        }
    }

}
