using System.Security.Principal;

namespace api.Models
{
    public class Stock
    {
        public string StockId { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Exchange { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;


    }
}
