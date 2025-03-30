using MessageBroker.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Publishers
{
    public class FeedbackEventPublisher
    {
        private readonly RabbitMQConfig _rabbitMQConfig;

        public FeedbackEventPublisher(RabbitMQConfig rabbitMQConfig)
        {
            _rabbitMQConfig = rabbitMQConfig;
        }

        public void PublishFeedbackSubmittedEvent(FeedbackSubmittedEvent @event)
        {
            _rabbitMQConfig.PublishMessage("feedback_submitted", @event);
        }
    }

}
