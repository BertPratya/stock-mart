using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Stock
{
    public class CreateStockRequestDto
    {
        [Required]
        public string StockId { get; set; } = string.Empty;
        [Required]
        public string Symbol { get; set; } = string.Empty;
        [Required]
        public string CompanyName { get; set; } = string.Empty;
        [Required]
        public string Industry { get; set; } = string.Empty;
        [Required]
        public string Exchange { get; set; } = string.Empty;
        public string Descriptipn { get; set; } = string.Empty;
    }
}
