
using System.Text.Json.Serialization;


namespace api.Helpers
{

    public class StockModelQueryObject
    {
        public String? Query { get; set; } = null;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public StockSortBy SortBy { get; set; } = StockSortBy.Symbol;

        public bool IsDecsending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;



    }
    public enum StockSortBy
    {
        Symbol,
        Price
    }
}
