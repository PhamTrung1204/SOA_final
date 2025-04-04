using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalonManagementSystem.Shared.Models
{
    public class ChangePasswordModel
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự")]
        public string NewPassword { get; set; }
    }
}
