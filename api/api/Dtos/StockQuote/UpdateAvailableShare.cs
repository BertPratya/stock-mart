using System.ComponentModel.DataAnnotations;

namespace api.Dtos.StockQuote
{
    public class UpdateAvailableShare
    {

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Available shares must be greater or equal than 0.")]
        public int NewAvailableShares { get; set; }
    }
}
