namespace api.Models
{
    public class Transaction
    {
        public int TransactionId { get; set; }
        public string UserId { get; set; }
        public AppUser AppUser { get; set; }
        public int StockId { get; set; }
        public StockModel StockModel { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount => Price * Quantity;
        public TransactionType TransactionType { get; set; }
        public TransactionStatus Status { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public DateTime LastUpdate { get; set; } = DateTime.UtcNow;
    }
    public enum TransactionType
    {
        Buy,
        Sell
    }
    public enum TransactionStatus
    {
        Pending,
        Completed,
        Cancelled
    }
}
