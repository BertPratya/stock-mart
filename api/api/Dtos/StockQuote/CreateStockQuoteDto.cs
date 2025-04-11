using System.ComponentModel.DataAnnotations;

namespace api.Dtos.CreateStockQuoteDto
{
    public class CreateStockQuoteDto
    {
        [Required]
        public int StockId { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Available shares must be greater or equal than 0.")]
        public int AvailableShares { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Current price must be greater or equal than 0.")]
        public decimal CurrentPrice { get; set; }
    }
}
