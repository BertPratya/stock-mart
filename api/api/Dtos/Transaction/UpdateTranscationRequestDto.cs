using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.Dtos.Transaction
{
    public class UpdateTransactionRequestDto
    {

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "TotalAmount must be greater than 0.")]

        public int Quantity { get; set; }

        [Required]
        public TransactionStatus Status { get; set; }
    }
}
