using MessageBroker.EventHandlers;
using MessageBroker.Events;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Consumers
{
    public class FeedbackSubmittedConsumer : BackgroundService
    {
        private readonly RabbitMQConfig _rabbitMQConfig;
        private readonly FeedbackSubmittedHandler _handler;

        public FeedbackSubmittedConsumer(RabbitMQConfig rabbitMQConfig, FeedbackSubmittedHandler handler)
        {
            _rabbitMQConfig = rabbitMQConfig;
            _handler = handler;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _rabbitMQConfig.ConsumeMessage("feedback_submitted", @event =>
            {
                var feedbackEvent = (FeedbackSubmittedEvent)@event;
                _handler.Handle(feedbackEvent);
            }, typeof(FeedbackSubmittedEvent));
            return Task.CompletedTask;
        }
    }

}
