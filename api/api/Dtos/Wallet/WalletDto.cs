namespace api.Dtos.Wallet
{
    public class WalletDto
    {
        public string WalletId { get; set; }
        public decimal Balance { get; set; } 
        public string UserId { get; set; }
        public string Currency { get; set; } 
        public DateTime CreatedOn { get; set; } 
        public DateTime LastUpdate { get; set; } 
        public string Status { get; set; }
    }
}

