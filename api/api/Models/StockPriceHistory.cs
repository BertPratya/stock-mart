using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class StockPriceHistory
    {
        [Key, Column(Order = 0)]
        public int StockId { get; set; }

        [Key, Column(Order = 1)]
        public DateTime TimeStamp { get; set; }
        public decimal Open { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }
        public decimal Close { get; set; }
        public StockModel StockModel { get; set; }
    }
}
