namespace api.Dtos.StockQuoteDto
{
    public class StockQuoteDto
    {
        public int StockQuoteId { get; set; }
        public int StockId { get; set; }
        public decimal CurrentPrice { get; set; }
        public int AvailableShares { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
