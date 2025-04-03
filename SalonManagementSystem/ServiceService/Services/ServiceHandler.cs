using SalonManagementSystem.Shared.Models;
using ServiceService.Repositories;

namespace ServiceService.Services
{
    public class ServiceHandler
    {
        private readonly IServiceRepository _repository;

        public ServiceHandler(IServiceRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Service> GetServices()
        {
            return _repository.GetServices(); // Cần thêm phương thức GetServices trong IServiceRepository
        }

        public Service GetService(int id) => _repository.GetService(id);
        public void CreateService(Service service) => _repository.AddService(service);
        public void UpdateService(Service service) => _repository.UpdateService(service);
    }
}
