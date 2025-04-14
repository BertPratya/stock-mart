namespace api.BackgroundServices.Simulators
{
    public static class DataGenerator
    {
        private static readonly Random _random = new Random();

        private static readonly decimal Mu = 0.01m;     
        private static readonly decimal Sigma = 0.2m;  
        private static readonly decimal Dt = 1.0m / 252m; 

        public static decimal SimulateNextPrice(decimal currentPrice)
        {
            double u1 = 1.0 - _random.NextDouble();
            double u2 = 1.0 - _random.NextDouble();
            double z = Math.Sqrt(-2.0 * Math.Log(u1)) * Math.Cos(2.0 * Math.PI * u2);

            double drift = (double)(Mu - 0.5m * Sigma * Sigma) * (double)Dt;
            double diffusion = (double)Sigma * Math.Sqrt((double)Dt) * z;

            decimal priceFactor = (decimal)Math.Exp(drift + diffusion);
            decimal newPrice = currentPrice * priceFactor;

            return Math.Max(newPrice, 0.01m);
        }
    }
}
