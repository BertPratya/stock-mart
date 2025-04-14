using System.Linq;
using System.Runtime.CompilerServices;


namespace api.Trackers
{
    public class SubscriptionTracker
    {
        private readonly Dictionary<String, HashSet<int>> _clientSubscriptions = new();

        public void AddSubscription(string connectionId, int stockId)
        {
            if (!_clientSubscriptions.ContainsKey(connectionId)) _clientSubscriptions[connectionId] = new HashSet<int>();
            _clientSubscriptions[connectionId].Add(stockId);
        }

        public void RemoveSubscription(string connectionId, int stockId)
        {
            if (_clientSubscriptions.TryGetValue(connectionId, out var stockIds))
            {
                _clientSubscriptions[connectionId].Remove(stockId);
            }
        }

        public void RemoveUser(string connectionId)
        {
            if (_clientSubscriptions.Remove(connectionId))
            {
                Console.WriteLine($"Removed all subscriptions for ConnectionId={connectionId}");
            }
        }


        public IEnumerable<string> GetSubscribedConnections(int stockId)
        {
            foreach (var (connId, stockIds) in _clientSubscriptions)
                if (stockIds.Contains(stockId)) 
                    yield return connId;
        }



    }
}
