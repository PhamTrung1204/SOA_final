using SalonManagementSystem.Shared.Models;
using StaffService.Data;

namespace StaffService.Repositories
{
    public class StaffRepository : IStaffRepository
    {
        private readonly ApplicationDbContext _context;

        public StaffRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Staff GetStaff(int id)
        {
            var staff = _context.Staffs.Find(id);
            if (staff == null)
            {
                // Xử lý trường hợp không tìm thấy, ví dụ ném ngoại lệ
                throw new KeyNotFoundException($"Staff with id {id} not found.");
            }

            return staff;
        }

        public void AddStaff(Staff staff)
        {
            _context.Staffs.Add(staff);
            _context.SaveChanges();
        }

        public void UpdateStaff(Staff staff)
        {
            _context.Staffs.Update(staff);
            _context.SaveChanges();
        }
    }
}
