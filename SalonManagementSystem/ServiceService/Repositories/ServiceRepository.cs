using SalonManagementSystem.Shared.Models;
using ServiceService.Data;

namespace ServiceService.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ApplicationDbContext _context;

        public ServiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Service GetService(int id)
        {
            var service = _context.Services.Find(id);
            if (service == null)
            {
                throw new KeyNotFoundException($"Service with id {id} not found.");
            }
            return service;
        }

        public void AddService(Service service)
        {
            _context.Services.Add(service);
            _context.SaveChanges();
        }

        public void UpdateService(Service service)
        {
            _context.Services.Update(service);
            _context.SaveChanges();
        }
    }
}
