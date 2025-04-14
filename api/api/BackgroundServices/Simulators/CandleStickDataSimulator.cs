using api.BackgroundServices.Simulators;
using api.Hubs;
using api.Interfaces;
using api.Trackers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

public class CandleStickBackGroundService : BackgroundService
{
    private readonly IStockQuoteRepository _stockQuoteRepo;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<CandleStickBackGroundService> _logger;
    private readonly IStockModelRepository _stockRepo;
    private readonly IStockPriceHistoryRepository _stockPriceRepo;
    private readonly IHubContext<DataHub> _hubContext;
    private readonly Dictionary<int, CandleStick> candleSticks = new();
    private readonly Dictionary<int, decimal> currentPrices = new();
    private DateTime currentTimeStamp;
    private bool isNewPeriod = true;
    private readonly SubscriptionTracker _subscriptionTracker;

    public CandleStickBackGroundService(IServiceScopeFactory scopeFactory, ILogger<CandleStickBackGroundService> logger, IHubContext<DataHub> hubContext, SubscriptionTracker subscriptionTracker)
    {
        _hubContext = hubContext;
        _scopeFactory = scopeFactory;
        _logger = logger;
        _subscriptionTracker = subscriptionTracker;

        using (var scope = _scopeFactory.CreateScope())
        {
            currentTimeStamp = GetAlignedTimestamp(DateTime.UtcNow);

            var stockRepository = scope.ServiceProvider.GetRequiredService<IStockModelRepository>();
            var stockPriceRepo = scope.ServiceProvider.GetRequiredService<IStockPriceHistoryRepository>();
            _stockPriceRepo = stockPriceRepo;
            _stockRepo = stockRepository;

            var stockSymbols = new List<string> { "MSFT", "AAPL" };
            foreach (var symbol in stockSymbols)
            {
                var stockTask = stockRepository.GetBySymbolAsync(symbol);
                var stock = stockTask.Result;

                if (stock != null)
                {
                    currentPrices[stock.Id] = stock.StockQuote.CurrentPrice;
                    candleSticks[stock.Id] = new CandleStick
                    {
                        Close = stock.StockQuote.CurrentPrice,
                        High = stock.StockQuote.CurrentPrice,
                        Low = stock.StockQuote.CurrentPrice,
                        Open = stock.StockQuote.CurrentPrice,
                        TimeStamp = currentTimeStamp
                    };
                }
                else
                {
                    _logger.LogWarning($"Stock with symbol {symbol} not found.");
                }
            }
        }

    }

    private DateTime GetAlignedTimestamp(DateTime timestamp)
    {
        int adjustedSeconds = (timestamp.Second / 5) * 5;
        return new DateTime(
            timestamp.Year,
            timestamp.Month,
            timestamp.Day,
            timestamp.Hour,
            timestamp.Minute,
            adjustedSeconds,
            timestamp.Kind
        );
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var stockPriceRepo = scope.ServiceProvider.GetRequiredService<IStockPriceHistoryRepository>();
                var stockQuoteRepo = scope.ServiceProvider.GetRequiredService<IStockQuoteRepository>();

                DateTime now = DateTime.UtcNow;
                DateTime alignedNow = GetAlignedTimestamp(now);

                bool startNewPeriod = alignedNow != currentTimeStamp;
                decimal currenceVariance = 0.04m;
                if (startNewPeriod)
                {
                    foreach (var stockId in candleSticks.Keys)
                    {
                        var candleStick = candleSticks[stockId];

                        await stockPriceRepo.CreateAsync(
                            stockId,
                            candleStick.Open,
                            candleStick.High,
                            candleStick.Low,
                            candleStick.Close,
                            candleStick.TimeStamp
                        );

                        await stockQuoteRepo.UpdateByStockIdAsync(stockId, candleStick.Close);
                    }

                    currentTimeStamp = alignedNow;
                    isNewPeriod = true;
                }

                foreach (var stockId in currentPrices.Keys.ToList())
                {
                    currentPrices[stockId] = DataGenerator.SimulateNextPrice(currentPrices[stockId]);

                    if (isNewPeriod)
                    {
                        candleSticks[stockId] = new CandleStick
                        {
                            Open = currentPrices[stockId],
                            High = currentPrices[stockId],
                            Low = currentPrices[stockId],
                            Close = currentPrices[stockId],
                            TimeStamp = currentTimeStamp
                        };
                    }
                    else
                    {
                        var existingCandleStick = candleSticks[stockId];
                        existingCandleStick.Close = currentPrices[stockId];
                        existingCandleStick.Low = Math.Min(currentPrices[stockId], existingCandleStick.Low);
                        existingCandleStick.High = Math.Max(currentPrices[stockId], existingCandleStick.High);
                    }

                    var updatedCandleStick = candleSticks[stockId];

                    var subscribedConnections = _subscriptionTracker.GetSubscribedConnections(stockId);

                    foreach (var connId in subscribedConnections)
                    {
                        await _hubContext.Clients.Client(connId).SendAsync("ReceivePriceUpdate", stockId, updatedCandleStick.Open, updatedCandleStick.Close, updatedCandleStick.Low, updatedCandleStick.High, updatedCandleStick.TimeStamp);
                    }
                }

                if (isNewPeriod)
                {
                    isNewPeriod = false;
                }

                await Task.Delay(100, stoppingToken);
            }
        }
    }


}