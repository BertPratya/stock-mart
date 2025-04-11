using api.Dtos;
using api.Dtos.StockQuoteDto;
using api.Dtos.CreateStockQuoteDto;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Dtos.StockQuote;

namespace api.Controller
{
    [Route("api/stockquote")]
    [ApiController]
    [Authorize]
    public class StockQuoteController(IStockQuoteRepository stockQuoteRepo) : ControllerBase
    {
        private readonly IStockQuoteRepository _stockQuoteRepo = stockQuoteRepo;

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateStockQuoteDto createStockQuoteDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var stockQuote = await _stockQuoteRepo.CreateAsync(
                    createStockQuoteDto.StockId,
                    createStockQuoteDto.AvailableShares,
                    createStockQuoteDto.CurrentPrice
                );

                var stockQuoteDto = new StockQuoteDto
                {
                    StockQuoteId = stockQuote.StockQuoteId,
                    StockId = stockQuote.StockId,
                    CurrentPrice = stockQuote.CurrentPrice,
                    AvailableShares = stockQuote.AvailableShares,
                    LastUpdated = stockQuote.LastUpdated
                };

                return CreatedAtAction(nameof(GetById), new { id = stockQuoteDto.StockQuoteId }, stockQuoteDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var stockQuote = await _stockQuoteRepo.GetByQuoteIdAsync(id);

            if (stockQuote == null)
            {
                return NotFound(new { message = "StockQuote not found" });
            }

            var stockQuoteDto = new StockQuoteDto
            {
                StockQuoteId = stockQuote.StockQuoteId,
                StockId = stockQuote.StockId,
                CurrentPrice = stockQuote.CurrentPrice,
                AvailableShares = stockQuote.AvailableShares,
                LastUpdated = stockQuote.LastUpdated
            };

            return Ok(stockQuoteDto);
        }

        [HttpPut("update-price/{id}")]
        public async Task<IActionResult> UpdatePrice(int id, [FromBody] UpdateCurrencePriceRequestDto updatePriceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedStockQuote = await _stockQuoteRepo.UpdatePriceAsync(id, updatePriceDto.NewPrice);

                var stockQuoteDto = new StockQuoteDto
                {
                    StockQuoteId = updatedStockQuote.StockQuoteId,
                    StockId = updatedStockQuote.StockId,
                    CurrentPrice = updatedStockQuote.CurrentPrice,
                    AvailableShares = updatedStockQuote.AvailableShares,
                    LastUpdated = updatedStockQuote.LastUpdated
                };

                return Ok(stockQuoteDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("update-available-shares/{id}")]
        public async Task<IActionResult> UpdateAvailableShares(int id, [FromBody] UpdateAvailableShare updateAvailableShareDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedStockQuote = await _stockQuoteRepo.UpdateAvailableSharesAsynce(id, updateAvailableShareDto.NewAvailableShares);

                var stockQuoteDto = new StockQuoteDto
                {
                    StockQuoteId = updatedStockQuote.StockQuoteId,
                    StockId = updatedStockQuote.StockId,
                    CurrentPrice = updatedStockQuote.CurrentPrice,
                    AvailableShares = updatedStockQuote.AvailableShares,
                    LastUpdated = updatedStockQuote.LastUpdated
                };

                return Ok(stockQuoteDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}
