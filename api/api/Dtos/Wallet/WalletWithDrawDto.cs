using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Wallet
{
    public class WalletWithDrawDto
    {
        [Required]
        public string WalletId { get; set; }
        [Required]
        public decimal Amount { get; set; } 
    }
}
