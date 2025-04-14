using api.Helpers;
using api.Models;

namespace api.Interfaces
{
    public interface IStockPriceHistoryRepository
    {
        Task<StockPriceHistory> CreateAsync(int stockId, decimal open, decimal high, decimal low, decimal close, DateTime timeStamp);
        Task<List<StockPriceHistory>> GetByStockIdAsync(int stockId, StockPriceHistoryQueryObject queryObject);


    }
}
