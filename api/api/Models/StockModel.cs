
namespace api.Models
{
    public class StockModel
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Exchange { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public string Description { get; set; } = string.Empty;
        public int TotalShares { get; set; }
        public int StockQuoteId { get; set; }
        public StockQuote StockQuote { get; set; }
    }
}

