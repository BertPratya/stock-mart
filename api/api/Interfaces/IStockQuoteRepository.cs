using api.Models;

namespace api.Interfaces
{
    public interface IStockQuoteRepository 
    {
        Task<StockQuote> CreateAsync(int stockId, int availableShares, decimal currencePrice);
        Task<StockQuote> UpdatePriceAsync(int stockQuoteId, decimal currencePrice);
        Task<StockQuote> UpdateAvailableSharesAsynce(int stockQuoteId, int availableShares);

        Task<StockQuote> GetByStockIdAsync(int stockId);
        Task<StockQuote> GetByQuoteIdAsync(int quoteId);
    }
}
