using api.Data;
using api.Dtos.Stock;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace api.Repositories
{
    public class StockModelRepository(ApplicationDBContext context) : IStockModelRepository
    {
        private readonly ApplicationDBContext _context = context;

        public async Task<StockModel> CreateAsync(StockModel stockModel)
        {
            await _context.AddAsync(stockModel);
            await _context.SaveChangesAsync();
            return stockModel;
        }

        public async Task<StockModel?> DeleteAsync(int id)
        {
            var stockModel = await _context.StockModels
                .Include(s => s.StockQuote) // Include StockQuote
                .FirstOrDefaultAsync(x => x.Id == id);

            if (stockModel == null)
            {
                return null;
            }

            _context.StockModels.Remove(stockModel);
            await _context.SaveChangesAsync();
            return stockModel;
        }

        public async Task<List<StockModel>> GetAllAsync(StockModelQueryObject stockModelQueryObject)
        {
            var stocks = _context.StockModels
                .Include(s => s.StockQuote) // Include StockQuote
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(stockModelQueryObject.Symbol))
            {
                stocks = stocks.Where(s => s.Symbol.ToLower().Contains(stockModelQueryObject.Symbol.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(stockModelQueryObject.CompanyName))
            {
                stocks = stocks.Where(s => s.CompanyName.ToLower().Contains(stockModelQueryObject.CompanyName.ToLower()));
            }

            if (stockModelQueryObject.SortBy != null)
            {
                switch (stockModelQueryObject.SortBy)
                {
                    case StockSortBy.Symbol:
                        stocks = stockModelQueryObject.IsDecsending
                            ? stocks.OrderByDescending(s => s.Symbol.ToLower())
                            : stocks.OrderBy(s => s.Symbol.ToLower());
                        break;

                    case StockSortBy.CompanyName:
                        stocks = stockModelQueryObject.IsDecsending
                            ? stocks.OrderByDescending(s => s.CompanyName.ToLower())
                            : stocks.OrderBy(s => s.CompanyName.ToLower());
                        break;

                    default:
                        stocks = stockModelQueryObject.IsDecsending
                            ? stocks.OrderByDescending(s => s.CompanyName.ToLower())
                            : stocks.OrderBy(s => s.CompanyName.ToLower());
                        break;
                }
            }

            var skipNumber = (stockModelQueryObject.PageNumber - 1) * stockModelQueryObject.PageSize;
            return await stocks.Skip(skipNumber).Take(stockModelQueryObject.PageSize).ToListAsync();
        }

        public async Task<StockModel?> GetByIdAsync(int id)
        {
            var stockModel = await _context.StockModels
                .Include(s => s.StockQuote) // Include StockQuote
                .FirstOrDefaultAsync(x => x.Id == id);

            if (stockModel == null)
            {
                return null;
            }

            return stockModel;
        }

        public async Task<StockModel?> GetBySymbolAsync(string symbol)
        {
            var stockModel = await _context.StockModels
                .Include(s => s.StockQuote) // Include StockQuote
                .FirstOrDefaultAsync(x => x.Symbol.ToLower() == symbol.ToLower());

            if (stockModel == null)
            {
                return null;
            }

            return stockModel;
        }

        public async Task<bool> IsExistsAsync(int id)
        {
            return await _context.StockModels.AnyAsync(x => x.Id == id);
        }

        public async Task<StockModel> UpdateStockModel(int id, UpdateStockRequestStockDto updateStockRequestStockDto)
        {
            var stockModel = await _context.StockModels
                .Include(s => s.StockQuote) // Include StockQuote
                .FirstOrDefaultAsync(s => s.Id == id);

            if (stockModel == null)
            {
                throw new Exception("Stock not found.");
            }

            stockModel.Symbol = updateStockRequestStockDto.Symbol;
            stockModel.CompanyName = updateStockRequestStockDto.CompanyName;
            stockModel.Industry = updateStockRequestStockDto.Industry;
            stockModel.Exchange = updateStockRequestStockDto.Exchange;
            stockModel.Description = updateStockRequestStockDto.Description;
            stockModel.TotalShares = updateStockRequestStockDto.TotalShare;

            _context.StockModels.Update(stockModel);
            await _context.SaveChangesAsync();

            return stockModel;
        }
    }
}
