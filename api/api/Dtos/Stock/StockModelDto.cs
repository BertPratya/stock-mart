namespace api.Dtos.Stock
{
    public class StockModelDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Exchange { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int TotalShares { get; set; }
    }
}
