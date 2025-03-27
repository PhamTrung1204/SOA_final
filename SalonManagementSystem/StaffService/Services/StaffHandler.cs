using SalonManagementSystem.Shared.Models;
using StaffService.Repositories;

namespace StaffService.Services
{
    public class StaffHandler
    {
        private readonly IStaffRepository _staffRepo;
        private readonly IScheduleRepository _scheduleRepo;

        public StaffHandler(IStaffRepository staffRepo, IScheduleRepository scheduleRepo)
        {
            _staffRepo = staffRepo;
            _scheduleRepo = scheduleRepo;
        }

        public Staff GetStaff(int id) => _staffRepo.GetStaff(id);

        public void CreateStaff(Staff staff) => _staffRepo.AddStaff(staff);

        public List<Schedule> GetSchedulesForStaff(int staffId) => _scheduleRepo.GetSchedulesForStaff(staffId);

        public void AddSchedule(Schedule schedule) => _scheduleRepo.AddSchedule(schedule);
    }
}
