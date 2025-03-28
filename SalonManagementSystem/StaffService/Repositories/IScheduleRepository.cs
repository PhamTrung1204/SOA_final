using SalonManagementSystem.Shared.Models;

namespace StaffService.Repositories
{
    public interface IScheduleRepository
    {
        List<Schedule> GetSchedulesForStaff(int staffId);
        void AddSchedule(Schedule schedule);
    }
}
