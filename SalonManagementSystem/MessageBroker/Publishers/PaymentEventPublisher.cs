using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Publishers
{
    public class PaymentEventPublisher
    {
        private readonly RabbitMQConfig _rabbitMQConfig;

        public PaymentEventPublisher(RabbitMQConfig rabbitMQConfig)
        {
            _rabbitMQConfig = rabbitMQConfig;
        }

        public void PublishPaymentProcessedEvent(PaymentProcessedEvent @event)
        {
            _rabbitMQConfig.PublishMessage("payment_processed", @event);
        }
    }

}
