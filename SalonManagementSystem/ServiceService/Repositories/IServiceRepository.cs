using SalonManagementSystem.Shared.Models;

namespace ServiceService.Repositories
{
    public interface IServiceRepository
    {
        IEnumerable<Service> GetServices();
        Service GetService(int id);
        void AddService(Service service);
        void UpdateService(Service service);
    }
}
