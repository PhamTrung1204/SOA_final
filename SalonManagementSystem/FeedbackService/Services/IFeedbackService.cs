using FeedbackService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FeedbackService.Services
{
    public interface IFeedbackService
    {
        Task<IEnumerable<Feedback>> GetAllFeedbacks();
        Task<Feedback> GetFeedbackById(int id);
        Task CreateFeedback(Feedback feedback);
        Task UpdateFeedback(int id, Feedback feedback);
        Task DeleteFeedback(int id);
    }
}