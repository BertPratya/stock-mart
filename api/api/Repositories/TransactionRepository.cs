using api.Data;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Dtos.Stock;
using api.Dtos.Transaction;
namespace api.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly ApplicationDBContext _context;

        public TransactionRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Transaction> CreateAsync(Transaction transaction)
        {
            var stockExists = await _context.StockModels.AnyAsync(s => s.Id == transaction.StockId);
            if (!stockExists)
            {
                throw new KeyNotFoundException($"Stock with ID {transaction.StockId} does not exist.");
            }

            await _context.Transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<List<Transaction>> GetAllForUserAsync(string userId)
        {
            return await _context.Transactions
                .Where(t => t.UserId == userId)
                .Include(t => t.StockModel)
                .ToListAsync();
        }

        public async Task<Transaction> GetByIdAsync(int id)
        {
            return await _context.Transactions
                .Include(t => t.StockModel)
                .FirstOrDefaultAsync(t => t.TransactionId == id);
        }

        public async Task<Transaction> UpdateAsync(int id, UpdateTransactionRequestDto updateTransactionRequestDto)
            {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                throw new KeyNotFoundException($"Transaction with ID {id} not found.");
            }

            transaction.Status = updateTransactionRequestDto.Status;
            transaction.LastUpdate = DateTime.UtcNow;
            transaction.Quantity = updateTransactionRequestDto.Quantity;

            _context.Transactions.Update(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

    }
}
