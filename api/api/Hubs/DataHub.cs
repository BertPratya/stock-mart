using api.Trackers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
namespace api.Hubs
{
    public class DataHub : Hub
    {
        private readonly ILogger<DataHub> _logger;
        private readonly SubscriptionTracker _subscriptionTracker;


        public DataHub(ILogger<DataHub> logger, SubscriptionTracker subscriptionTracker)
        {
            _logger = logger;
            _subscriptionTracker = subscriptionTracker;

        }

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"Client connected: {Context.ConnectionId}");
            await Clients.Caller.SendAsync("ReceiveData", "You are ready to receive real time data");
            await base.OnConnectedAsync();
        }

        public async Task SubscribeToStock(int stockId)
        {
            string connectionId = Context.ConnectionId;
            _subscriptionTracker.AddSubscription(connectionId, stockId);
            await Clients.Caller.SendAsync("Subsribed to: ", stockId);
        }

        public async Task UnsubscribeFromStock(int stockId)
        {
            string connectionId = Context.ConnectionId;
            _subscriptionTracker.RemoveSubscription(connectionId, stockId);
            await Clients.Caller.SendAsync("Unsubscribe from: ", stockId);
        }

        public async Task Signout()
        {
            string connectionId = Context.ConnectionId;
            _subscriptionTracker.RemoveUser(connectionId);
            await Clients.Caller.SendAsync("Remove you from subscribers");
        }



    }
}
