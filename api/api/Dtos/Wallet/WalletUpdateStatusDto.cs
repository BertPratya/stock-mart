namespace api.Dtos.Wallet
{
    public class WalletUpdateStatusDto
    {
        public required string WalletId { get; set; }
        public required string Status { get; set; }
    }
}