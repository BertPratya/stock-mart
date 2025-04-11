using System.ComponentModel.DataAnnotations;

namespace api.Dtos.StockQuote
{
    public class UpdateCurrencePriceRequestDto
    {

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Current price must be greater or equal than 0.")]
        public decimal NewPrice { get; set; }
    }
}