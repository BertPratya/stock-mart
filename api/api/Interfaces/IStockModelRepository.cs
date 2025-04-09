using api.Helpers;
using api.Models;
using api.Repositories;
using System.Runtime.CompilerServices;

namespace api.Interfaces
{
    public interface IStockModelRepository
    {
        Task<List<StockModel>> GetAllAsync(StockModelQueryObject stockModelRepostockModelQueryObject);
        Task<StockModel> CreateAsync(StockModel stockModel);
        Task<StockModel?> DeleteAsync(int id);
        Task<StockModel> GetByIdAsync(int id);
        Task<StockModel> GetBySymbolAsync(String symbol);
        Task<bool> IsExistsAsync(int id);

    }
}
