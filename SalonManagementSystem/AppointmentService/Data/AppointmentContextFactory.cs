using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace AppointmentService.Data
{
    public class AppointmentContextFactory : IDesignTimeDbContextFactory<AppointmentContext>
    {
        public AppointmentContext CreateDbContext(string[] args)
        {
            // Đảm bảo lấy đúng đường dẫn cho file appsettings.json
            var currentDirectory = Directory.GetCurrentDirectory();
            var configuration = new ConfigurationBuilder()
                .SetBasePath(currentDirectory) // Đảm bảo là thư mục chính xác
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true) // Đọc tệp cấu hình
                .Build();

            // Kiểm tra chuỗi kết nối
            var connectionString = configuration.GetConnectionString("AppointmentDb");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string 'AppointmentDb' not found in appsettings.json.");
            }

            // Cấu hình DbContext
            var optionsBuilder = new DbContextOptionsBuilder<AppointmentContext>();
            optionsBuilder.UseNpgsql(connectionString); // Sử dụng SQL Server với chuỗi kết nối

            return new AppointmentContext(optionsBuilder.Options);
        }
    }
}
