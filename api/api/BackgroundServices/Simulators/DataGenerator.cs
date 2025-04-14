using System;

namespace api.BackgroundServices.Simulators
{
    public static class DataGenerator
    {
        private static readonly Random _random = new Random();


        public static decimal SimulateNextPrice(decimal currentPrice, decimal maxPercentChange = 0.05m)
        {
            double percentChange = (2 * _random.NextDouble() - 1) * (double)maxPercentChange;

            decimal newPrice = currentPrice * (decimal)(1 + percentChange);

            return Math.Max(newPrice, 0.01m);
        }
    }
}
