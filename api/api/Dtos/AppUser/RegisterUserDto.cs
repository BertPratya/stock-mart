using System.ComponentModel.DataAnnotations;

namespace api.Dtos.AppUser
{
    public class RegisterUserDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [EmailAddress]
        public string ?Email { get; set; }
        [Required]
        public string ?Password { get; set; }


    }
}
