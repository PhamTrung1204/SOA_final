using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.EventHandlers
{
    public class CustomerRegisteredHandler
    {
        public void Handle(CustomerRegisteredEvent @event)
        {
            // Gửi email chào mừng
            Console.WriteLine($"Sending welcome email to customer {@event.CustomerId}");
        }
    }

}
