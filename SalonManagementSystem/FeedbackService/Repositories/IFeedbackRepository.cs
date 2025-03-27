using FeedbackService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FeedbackService.Repositories
{
    public interface IFeedbackRepository
    {
        Task<IEnumerable<Feedback>> GetAllAsync();
        Task<Feedback> GetByIdAsync(int id);
        Task AddAsync(Feedback feedback);
        Task UpdateAsync(Feedback feedback);
        Task DeleteAsync(int id);
        Task SaveChangesAsync();
    }
}