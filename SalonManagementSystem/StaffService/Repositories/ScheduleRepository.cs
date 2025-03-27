using SalonManagementSystem.Shared.Models;
using StaffService.Data;

namespace StaffService.Repositories
{
    public class ScheduleRepository : IScheduleRepository
    {
        private readonly ApplicationDbContext _context;

        public ScheduleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Schedule> GetSchedulesForStaff(int staffId)
        {
            return _context.Schedules.Where(s => s.StaffId == staffId).ToList();
        }

        public void AddSchedule(Schedule schedule)
        {
            _context.Schedules.Add(schedule);
            _context.SaveChanges();
        }
    }
}
