using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Dtos.StockQuoteDto;
using api.Dtos.Stock;
using api.Models;
using api.Helpers;
using api.Dtos.StockQuoteDto;

namespace api.Controller
{
    [Route("api/stock")]
    [ApiController]
    public class StockController(IStockModelRepository stockRepo, IStockQuoteRepository stockQuoteRepo) : ControllerBase
    {
        private readonly IStockQuoteRepository _stockQuoteRepo = stockQuoteRepo;
        private readonly IStockModelRepository _stockRepo = stockRepo;

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] StockModelQueryObject queryObject)
        {
            var allStock = await _stockRepo.GetAllAsync(queryObject);

            var stockDtos = allStock.Select(stock => new
            {
                Stock = new StockModelDto
                {
                    Id = stock.Id,
                    Symbol = stock.Symbol,
                    CompanyName = stock.CompanyName,
                    Industry = stock.Industry,
                    Exchange = stock.Exchange,
                    Description = stock.Description,
                    TotalShares = stock.TotalShares
                },
                StockQuote = stock.StockQuote != null ? new StockQuoteDto
                {
                    StockQuoteId = stock.StockQuote.StockQuoteId,
                    StockId = stock.StockQuote.StockId,
                    CurrentPrice = stock.StockQuote.CurrentPrice,
                    AvailableShares = stock.StockQuote.AvailableShares,
                    LastUpdated = stock.StockQuote.LastUpdated
                } : null
            }).ToList();

            return Ok(stockDtos);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var stock = await _stockRepo.GetByIdAsync(id);

            if (stock == null) return NotFound(new { message = "Stock not found" });

            var result = new
            {
                Stock = new StockModelDto
                {
                    Id = stock.Id,
                    Symbol = stock.Symbol,
                    CompanyName = stock.CompanyName,
                    Industry = stock.Industry,
                    Exchange = stock.Exchange,
                    Description = stock.Description,
                    TotalShares = stock.TotalShares
                },
                StockQuote = stock.StockQuote != null ? new StockQuoteDto
                {
                    StockQuoteId = stock.StockQuote.StockQuoteId,
                    StockId = stock.StockQuote.StockId,
                    CurrentPrice = stock.StockQuote.CurrentPrice,
                    AvailableShares = stock.StockQuote.AvailableShares,
                    LastUpdated = stock.StockQuote.LastUpdated
                } : null
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] StockModelDto stockDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var stockModel = new StockModel
            {
                CompanyName = stockDto.CompanyName,
                CreatedOn = DateTime.UtcNow,
                Description = stockDto.Description,
                Exchange = stockDto.Exchange,
                Industry = stockDto.Industry,
                Symbol = stockDto.Symbol,
                TotalShares = stockDto.TotalShares
            };

            await _stockRepo.CreateAsync(stockModel);

            var stockQuote = await _stockQuoteRepo.CreateAsync(
                stockModel.Id, 
                stockModel.TotalShares, 
                0 
            );

            return CreatedAtAction(nameof(GetById), new { id = stockModel.Id }, new
            {
                Stock = new StockModelDto
                {
                    Id = stockModel.Id,
                    Symbol = stockModel.Symbol,
                    CompanyName = stockModel.CompanyName,
                    Industry = stockModel.Industry,
                    Exchange = stockModel.Exchange,
                    Description = stockModel.Description,
                    TotalShares = stockModel.TotalShares
                },
                StockQuote = new StockQuoteDto
                {
                    StockQuoteId = stockQuote.StockQuoteId,
                    StockId = stockQuote.StockId,
                    AvailableShares = stockQuote.AvailableShares,
                    CurrentPrice = stockQuote.CurrentPrice,
                    LastUpdated = stockQuote.LastUpdated
                }
            });
        }

        [HttpGet("symbol/{symbol}")]
        [Authorize]
        public async Task<IActionResult> GetBySymbol(string symbol)
        {
            var stock = await _stockRepo.GetBySymbolAsync(symbol);

            if (stock == null) return NotFound(new { message = "Stock not found" });

            var result = new
            {
                Stock = new StockModelDto
                {
                    Id = stock.Id,
                    Symbol = stock.Symbol,
                    CompanyName = stock.CompanyName,
                    Industry = stock.Industry,
                    Exchange = stock.Exchange,
                    Description = stock.Description,
                    TotalShares = stock.TotalShares
                },
                StockQuote = stock.StockQuote != null ? new StockQuoteDto
                {
                    StockQuoteId = stock.StockQuote.StockQuoteId,
                    StockId = stock.StockQuote.StockId,
                    CurrentPrice = stock.StockQuote.CurrentPrice,
                    AvailableShares = stock.StockQuote.AvailableShares,
                    LastUpdated = stock.StockQuote.LastUpdated
                } : null
            };

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var deletedStock = await _stockRepo.DeleteAsync(id);

            if (deletedStock == null) return NotFound(new { message = "Stock not found" });

            return Ok(new
            {
                Stock = new StockModelDto
                {
                    Id = deletedStock.Id,
                    Symbol = deletedStock.Symbol,
                    CompanyName = deletedStock.CompanyName,
                    Industry = deletedStock.Industry,
                    Exchange = deletedStock.Exchange,
                    Description = deletedStock.Description,
                    TotalShares = deletedStock.TotalShares
                },
                StockQuote = deletedStock.StockQuote != null ? new StockQuoteDto
                {
                    StockQuoteId = deletedStock.StockQuote.StockQuoteId,
                    StockId = deletedStock.StockQuote.StockId,
                    CurrentPrice = deletedStock.StockQuote.CurrentPrice,
                    AvailableShares = deletedStock.StockQuote.AvailableShares,
                    LastUpdated = deletedStock.StockQuote.LastUpdated
                } : null
            });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateStockRequestStockDto updateDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            try
            {
                var updatedStock = await _stockRepo.UpdateStockModel(id, updateDto);
                return Ok(new
                {
                    Stock = new StockModelDto
                    {
                        Id = updatedStock.Id,
                        Symbol = updatedStock.Symbol,
                        CompanyName = updatedStock.CompanyName,
                        Industry = updatedStock.Industry,
                        Exchange = updatedStock.Exchange,
                        Description = updatedStock.Description,
                        TotalShares = updatedStock.TotalShares
                    },
                    StockQuote = updatedStock.StockQuote != null ? new StockQuoteDto
                    {
                        StockQuoteId = updatedStock.StockQuote.StockQuoteId,
                        StockId = updatedStock.StockQuote.StockId,
                        CurrentPrice = updatedStock.StockQuote.CurrentPrice,
                        AvailableShares = updatedStock.StockQuote.AvailableShares,
                        LastUpdated = updatedStock.StockQuote.LastUpdated
                    } : null
                });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
