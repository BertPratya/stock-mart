namespace api.Models
{
    public enum WalletStatus
    {
        Active,
        Inactive,
        Suspended,
        Closed
    }

    public class Wallet
    {
        public required string WalletId { get; set; }
        public decimal Balance { get; set; }
        public string UserId { get; set; } = string.Empty;
        public required AppUser AppUser { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdate { get; set; } = DateTime.UtcNow;
        public string Currency { get; set; } = "USD";
        public WalletStatus Status { get; set; } = WalletStatus.Active;
    }
}
