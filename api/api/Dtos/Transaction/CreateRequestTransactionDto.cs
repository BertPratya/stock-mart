using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.Dtos.Transaction
{
    public class CreateRequestTransactionDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public int StockId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }



        [Required]
        public TransactionType TransactionType { get; set; }
    }
}
