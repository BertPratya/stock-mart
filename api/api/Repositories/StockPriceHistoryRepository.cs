using api.Interfaces;
using api.Models;
using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Helpers;

namespace api.Repositories
{
    public class StockPriceHistoryRepository(ApplicationDBContext context) : IStockPriceHistoryRepository
    {
        private readonly ApplicationDBContext _context = context;

        public async Task<StockPriceHistory> CreateAsync(int stockId, decimal open, decimal high, decimal low, decimal close, DateTime timeStamp)
        {
            var stockPriceHistory = new StockPriceHistory
            {
                StockId = stockId,
                TimeStamp = timeStamp,
                Open = open,
                High = high,
                Low = low,
                Close = close
            };

            _context.StockPriceHistories.Add(stockPriceHistory);
            await _context.SaveChangesAsync();

            return stockPriceHistory;
        }

        public async Task<List<StockPriceHistory>> GetByStockIdAsync(int stockId, StockPriceHistoryQueryObject queryObject)
        {
            var query = _context.StockPriceHistories
                .Where(history => history.StockId == stockId);

            if (queryObject.start != default && queryObject.end != default)
            {
                query = query.Where(history => history.TimeStamp >= queryObject.start && history.TimeStamp <= queryObject.end);
            }
            else if (queryObject.start != default)
            {
                query = query.Where(history => history.TimeStamp >= queryObject.start);
            }
            else if (queryObject.end != default)
            {
                query = query.Where(history => history.TimeStamp <= queryObject.end);
            }
            return await query
                .OrderBy(history => history.TimeStamp)
                .ToListAsync();
        }

    }
}
