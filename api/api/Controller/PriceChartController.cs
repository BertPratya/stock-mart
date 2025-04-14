using Microsoft.AspNetCore.Mvc;
using api.Interfaces;
using api.Models;
using api.Helpers;
using Microsoft.AspNetCore.SignalR;
using api.Hubs;

namespace api.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PriceChartController : ControllerBase
    {
        private readonly IStockPriceHistoryRepository _stockPriceHistoryRepository;
        private readonly IHubContext<DataHub> _hub;
        public PriceChartController(IStockPriceHistoryRepository stockPriceHistoryRepository, IHubContext<DataHub> hub)
        {
            _stockPriceHistoryRepository = stockPriceHistoryRepository;
            _hub = hub;
        }

        [HttpGet("stock/{stockId}")]
        public async Task<IActionResult> GetPriceHistoryByStockId(int stockId, [FromQuery] StockPriceHistoryQueryObject queryObject)
        {
            var priceHistory = await _stockPriceHistoryRepository.GetByStockIdAsync(stockId, queryObject);

            if (priceHistory == null || !priceHistory.Any())
            {
                return NotFound(new { Message = "No price history found for the given stock ID." });
            }

            return Ok(priceHistory);
        }

        

    }
}
