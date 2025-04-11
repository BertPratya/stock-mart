using System;

namespace api.Models
{
    public class StockQuote
    {
        public int StockQuoteId { get; set; }
        public int StockId { get; set; }
        public StockModel StockModel { get; set; }
        public decimal CurrentPrice { get; set; }
        public int AvailableShares { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    }
}
