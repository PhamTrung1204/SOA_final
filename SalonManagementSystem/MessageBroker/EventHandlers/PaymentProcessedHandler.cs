using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.EventHandlers
{
    public class PaymentProcessedHandler
    {
        public void Handle(PaymentProcessedEvent @event)
        {
            // Cập nhật trạng thái thanh toán trong cơ sở dữ liệu
            Console.WriteLine($"Payment {@event.PaymentId} processed for appointment {@event.AppointmentId}");
        }
    }

}
