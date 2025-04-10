using api.Dtos.Transaction;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly IStockModelRepository _stockRepo;
        private readonly ITransactionRepository _transactionRepo;

        public TransactionController(ITransactionRepository transactionRepo, IStockModelRepository stockRepo)
        {
            _transactionRepo = transactionRepo;
            _stockRepo = stockRepo;
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateRequestTransactionDto createRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check if the StockId exists
                var stockExists = await _stockRepo.IsExistsAsync(createRequest.StockId);
                if (!stockExists)
                {
                    return NotFound($"Stock with ID {createRequest.StockId} does not exist.");
                }

                var transaction = new Transaction
                {
                    UserId = createRequest.UserId,
                    StockId = createRequest.StockId,
                    Price = createRequest.Price,
                    Quantity = createRequest.Quantity,
                    TransactionType = createRequest.TransactionType,
                    CreatedOn = DateTime.UtcNow,
                    Status = TransactionStatus.Pending,
                    LastUpdate = DateTime.UtcNow
                };

                var createdTransaction = await _transactionRepo.CreateAsync(transaction);
                return CreatedAtAction(nameof(GetTransactionById), new { id = createdTransaction.TransactionId }, createdTransaction);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactionById(int id)
        {
            var transaction = await _transactionRepo.GetByIdAsync(id);
            if (transaction == null)
            {
                return NotFound($"Transaction with ID {id} not found.");
            }

            return Ok(transaction);
        }

        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, [FromBody] UpdateTransactionRequestDto updateRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedTransaction = await _transactionRepo.UpdateAsync(id, updateRequest);
                return Ok(updatedTransaction);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllTransactionsForUser(string userId)
        {
            try
            {
                var transactions = await _transactionRepo.GetAllForUserAsync(userId);
                return Ok(transactions ?? new List<Transaction>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
