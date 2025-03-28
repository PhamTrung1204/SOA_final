using Microsoft.EntityFrameworkCore;
using SalonManagementSystem.Shared.Models;
using System.Collections.Generic;

namespace FeedbackService.Data
{
    public class FeedbackContext : DbContext
    {
        public FeedbackContext(DbContextOptions<FeedbackContext> options) : base(options) { }
        public DbSet<Feedback> Feedbacks { get; set; }
    }
}