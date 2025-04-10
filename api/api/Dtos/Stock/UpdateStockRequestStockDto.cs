using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Stock
{
    public class UpdateStockRequestStockDto
    {
        public required int Id { get; set; }
        public required string Symbol { get; set; }
        public required string CompanyName { get; set; }
        public required string Industry { get; set; }
        public required string Exchange { get; set; }
        public string? Description { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "TotalShares must be greater or equal than 0.")]
        public required int TotalShare { get; set; }
    }
}
