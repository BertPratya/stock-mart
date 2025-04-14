using api.Models;

namespace api.Interfaces
{
    public interface IStockQuoteRepository
    {
        Task<StockQuote> CreateAsync(int stockId, int availableShares, decimal currencePrice);
        Task<StockQuote> GetByQuoteIdAsync(int quoteId);
        Task<StockQuote> GetByStockIdAsync(int stockId);
        Task<StockQuote> UpdateAvailableSharesAsynce(int stockQuoteId, int availableShares);
        Task<StockQuote> UpdatePriceAsync(int stockQuoteId, decimal currencePrice);
        Task<StockQuote> UpdateByStockIdAsync(int stockId, decimal currentPrice);

    }

}
