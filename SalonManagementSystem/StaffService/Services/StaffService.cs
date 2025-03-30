using MessageBroker.Publishers;
using SalonManagementSystem.Shared.Models;
using StaffService.Repositories;

namespace StaffService.Services
{
    public class StaffService
    {
        private readonly IStaffRepository _staffRepo;
        private readonly IScheduleRepository _scheduleRepo;
        private readonly StaffEventPublisher _eventPublisher;

        public StaffService(IStaffRepository staffRepo, IScheduleRepository scheduleRepo, StaffEventPublisher eventPublisher)
        {
            _staffRepo = staffRepo;
            _scheduleRepo = scheduleRepo;
            _eventPublisher = eventPublisher;
        }

        public Staff GetStaff(int id) => _staffRepo.GetStaff(id);

        public void CreateStaff(Staff staff) => _staffRepo.AddStaff(staff);

        public List<Schedule> GetSchedulesForStaff(int staffId) => _scheduleRepo.GetSchedulesForStaff(staffId);

        public void AddSchedule(Schedule schedule) => _scheduleRepo.AddSchedule(schedule);

        public interface IStaffService
        {
            Task UpdateStaffSchedule(int staffId, DateTime newScheduleDate);
        }


    }
}
