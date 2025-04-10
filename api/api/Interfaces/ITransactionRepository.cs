using api.Dtos.Stock;
using api.Dtos.Transaction;
using api.Models;
namespace api.Interfaces
{
    public interface ITransactionRepository
    {
        Task<Transaction> CreateAsync(Transaction transaction);
        Task<Transaction> GetByIdAsync(int id);
        Task<List<Transaction>> GetAllForUserAsync(string userId);
        Task<Transaction> UpdateAsync(int id, UpdateTransactionRequestDto updateTranscationRequestDto);

    }
}
