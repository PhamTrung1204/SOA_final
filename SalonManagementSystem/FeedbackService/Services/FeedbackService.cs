using FeedbackService.Repositories;
using MessageBroker.Events;
using MessageBroker.Publishers;
using SalonManagementSystem.Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FeedbackService.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly FeedbackEventPublisher _eventPublisher;
        private readonly IFeedbackRepository _repository;

        public FeedbackService(FeedbackEventPublisher eventPublisher, IFeedbackRepository repository)
        {
            _eventPublisher = eventPublisher;
            _repository = repository;
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedbacks()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Feedback> GetFeedbackById(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task CreateFeedback(Feedback feedback)
        {
            await _repository.AddAsync(feedback);
            await _repository.SaveChangesAsync();
        }

        public async Task UpdateFeedback(int id, Feedback feedback)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Feedback not found");

            existing.Comment = feedback.Comment;
            existing.Rating = feedback.Rating;

            await _repository.UpdateAsync(existing);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteFeedback(int id)
        {
            var feedback = await _repository.GetByIdAsync(id);
            if (feedback == null) throw new Exception("Feedback not found");

            await _repository.DeleteAsync(id);
            await _repository.SaveChangesAsync();
        }

        public async Task SubmitFeedback(Feedback feedback)
        {
            await _repository.AddAsync(feedback);
            await _repository.SaveChangesAsync();

            var @event = new FeedbackSubmittedEvent
            {
                FeedbackId = feedback.FeedbackId,
                AppointmentId = feedback.AppointmentId,
                Rating = feedback.Rating,
                Comment = feedback.Comment
            };
            _eventPublisher.PublishFeedbackSubmittedEvent(@event);
        }
    }
}