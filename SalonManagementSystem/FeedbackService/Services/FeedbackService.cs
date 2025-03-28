using FeedbackService.Repositories;
using SalonManagementSystem.Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FeedbackService.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IFeedbackRepository _repository;

        public FeedbackService(IFeedbackRepository repository)
        {
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
    }
}