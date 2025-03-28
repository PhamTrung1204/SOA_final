using Microsoft.EntityFrameworkCore;
using FeedbackService.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using SalonManagementSystem.Shared.Models;

namespace FeedbackService.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly FeedbackContext _context;

        public FeedbackRepository(FeedbackContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Feedback>> GetAllAsync()
        {
            return await _context.Feedbacks.ToListAsync();
        }

        public async Task<Feedback> GetByIdAsync(int id)
        {
            return await _context.Feedbacks.FindAsync(id);
        }

        public async Task AddAsync(Feedback feedback)
        {
            await _context.Feedbacks.AddAsync(feedback);
        }

        public async Task UpdateAsync(Feedback feedback)
        {
            _context.Feedbacks.Update(feedback);
        }

        public async Task DeleteAsync(int id)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);
            if (feedback != null) _context.Feedbacks.Remove(feedback);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}