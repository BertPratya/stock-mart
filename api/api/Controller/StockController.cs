using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Dtos;



using api.Dtos.Stock;
using Microsoft.AspNetCore.Http.HttpResults;
using api.Models;
using api.Helpers;
namespace api.Controller
{
    [Route("api/stock")]
    [ApiController]
    public class StockController(IStockModelRepository stockRepo) : ControllerBase
    {
        private readonly IStockModelRepository _stockRepo = stockRepo;

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] StockModelQueryObject queryObject)
        {
            var allStock = await _stockRepo.GetAllAsync(queryObject);

            var stockDtos = allStock.Select(stock => new StockModelDto
            {
                Id = stock.Id,
                Symbol = stock.Symbol,
                CompanyName = stock.CompanyName,
                Industry = stock.Industry,
                Exchange = stock.Exchange,
                Description = stock.Description
            }).ToList();

            return Ok(stockDtos);
        }


        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var stock = await _stockRepo.GetByIdAsync(id);

            if (stock == null) return NotFound(new { message = "Stock not found" });
            var stockDto = new StockModelDto
            {
                Id = stock.Id,
                Symbol = stock.Symbol,
                CompanyName = stock.CompanyName,
                Industry = stock.Industry,
                Exchange = stock.Exchange,
                Description = stock.Description
            };
            return Ok(stockDto);
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
                Symbol =stockDto.Symbol
            };
            await _stockRepo.CreateAsync(stockModel);
            return CreatedAtAction(nameof(GetById), new { id = stockModel.Id }, new StockModelDto
            {
                Id = stockModel.Id,
                Symbol = stockModel.Symbol,
                CompanyName = stockModel.CompanyName,
                Industry = stockModel.Industry,
                Exchange = stockModel.Exchange,
                Description = stockModel.Description
            });
        }

        [HttpGet("symbol/{symbol}")]
        [Authorize]
        public async Task<IActionResult> GetBySymbol(string symbol)
        {
            var stock = await _stockRepo.GetBySymbolAsync(symbol);

            if (stock == null) return NotFound(new { message = "Stock not found" });

            var stockDto = new StockModelDto
            {
                Id = stock.Id,
                Symbol = stock.Symbol,
                CompanyName = stock.CompanyName,
                Industry = stock.Industry,
                Exchange = stock.Exchange,
                Description = stock.Description
            };

            return Ok(stockDto);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var deletedStock = await _stockRepo.DeleteAsync(id);

            if (deletedStock == null) return NotFound(new { message = "Stock not found" });

            return Ok(new StockModelDto
            {
                Id = deletedStock.Id,
                Symbol = deletedStock.Symbol,
                CompanyName = deletedStock.CompanyName,
                Industry = deletedStock.Industry,
                Exchange = deletedStock.Exchange,
                Description = deletedStock.Description
            });
        }










    }




}
