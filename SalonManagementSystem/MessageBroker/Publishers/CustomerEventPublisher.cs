using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Publishers
{
    public class CustomerEventPublisher
    {
        private readonly RabbitMQConfig _rabbitMQConfig;

        public CustomerEventPublisher(RabbitMQConfig rabbitMQConfig)
        {
            _rabbitMQConfig = rabbitMQConfig;
        }

        public void PublishCustomerRegisteredEvent(CustomerRegisteredEvent @event)
        {
            _rabbitMQConfig.PublishMessage("customer_registered", @event);
        }
    }

}
