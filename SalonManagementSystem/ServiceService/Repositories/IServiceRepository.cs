using SalonManagementSystem.Shared.Models;

namespace ServiceService.Repositories
{
    public interface IServiceRepository
    {
        Service GetService(int id);
        void AddService(Service service);
        void UpdateService(Service service);
    }
}
