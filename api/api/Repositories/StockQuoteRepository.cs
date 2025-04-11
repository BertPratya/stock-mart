using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class StockQuoteRepository(ApplicationDBContext context) : IStockQuoteRepository
    {
        private readonly ApplicationDBContext _context = context;

        public async Task<StockQuote> CreateAsync(int stockId, int availableShares, decimal currencePrice)
        {
            var stockExists = await _context.StockModels.AnyAsync(s => s.Id == stockId);
            if (!stockExists)
            {
                throw new KeyNotFoundException($"Stock with ID {stockId} does not exist.");
            }

            var stockQuote = new StockQuote
            {
                StockId = stockId,
                AvailableShares = availableShares,
                CurrentPrice = currencePrice,
                LastUpdated = DateTime.UtcNow
            };

            await _context.StockQuotes.AddAsync(stockQuote);
            await _context.SaveChangesAsync();
            return stockQuote;
        }



        public async Task<StockQuote> GetByQuoteIdAsync(int quoteId)
        {
            return await _context.StockQuotes
                .Include(sq => sq.StockModel)
                .ThenInclude(sm => sm.StockQuote) 
                .FirstOrDefaultAsync(sq => sq.StockQuoteId == quoteId);
        }

        public async Task<StockQuote> GetByStockIdAsync(int stockId)
        {
            return await _context.StockQuotes
                .Include(sq => sq.StockModel) 
                .ThenInclude(sm => sm.StockQuote) 
                .FirstOrDefaultAsync(sq => sq.StockId == stockId);
        }

        public async Task<StockQuote> UpdateAvailableSharesAsynce(int stockQuoteId, int availableShares)
        {
            if (availableShares < 0)
            {
                throw new ArgumentException("Available shares cannot be negative.", nameof(availableShares));
            }

            var stockQuote = await _context.StockQuotes
                .Include(sq => sq.StockModel)
                .FirstOrDefaultAsync(sq => sq.StockQuoteId == stockQuoteId);

            if (stockQuote == null)
            {
                throw new KeyNotFoundException($"StockQuote with ID {stockQuoteId} not found.");
            }

            stockQuote.AvailableShares = availableShares;
            stockQuote.LastUpdated = DateTime.UtcNow;

            _context.StockQuotes.Update(stockQuote);
            await _context.SaveChangesAsync();
            return stockQuote;
        }

        public async Task<StockQuote> UpdatePriceAsync(int stockQuoteId, decimal currencePrice)
        {
            if (currencePrice <= 0)
            {
                throw new ArgumentException("Current price must be greater than zero.", nameof(currencePrice));
            }

            var stockQuote = await _context.StockQuotes
                .Include(sq => sq.StockModel)
                .FirstOrDefaultAsync(sq => sq.StockQuoteId == stockQuoteId);

            if (stockQuote == null)
            {
                throw new KeyNotFoundException($"StockQuote with ID {stockQuoteId} not found.");
            }

            stockQuote.CurrentPrice = currencePrice;
            stockQuote.LastUpdated = DateTime.UtcNow;

            _context.StockQuotes.Update(stockQuote);
            await _context.SaveChangesAsync();
            return stockQuote;
        }






    }
}
