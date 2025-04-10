using Microsoft.AspNetCore.Identity;
namespace api.Models
{
    public class AppUser : IdentityUser
    {
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public Wallet? Wallet { get; set; } = null;

        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
