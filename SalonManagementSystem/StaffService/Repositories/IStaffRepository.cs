using SalonManagementSystem.Shared.Models;

namespace StaffService.Repositories
{
    public interface IStaffRepository
    {
        Staff GetStaff(int id);
        void AddStaff(Staff staff);
        void UpdateStaff(Staff staff);
    }
}
