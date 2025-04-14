using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeStockPriceIncludeCandleStick : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "StockPriceHistories",
                newName: "Open");

            migrationBuilder.RenameColumn(
                name: "RecordedAt",
                table: "StockPriceHistories",
                newName: "TimeStamp");

            migrationBuilder.RenameIndex(
                name: "IX_StockPriceHistories_StockId_RecordedAt",
                table: "StockPriceHistories",
                newName: "IX_StockPriceHistories_StockId_TimeStamp");

            migrationBuilder.AddColumn<decimal>(
                name: "Close",
                table: "StockPriceHistories",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "High",
                table: "StockPriceHistories",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Low",
                table: "StockPriceHistories",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Close",
                table: "StockPriceHistories");

            migrationBuilder.DropColumn(
                name: "High",
                table: "StockPriceHistories");

            migrationBuilder.DropColumn(
                name: "Low",
                table: "StockPriceHistories");

            migrationBuilder.RenameColumn(
                name: "Open",
                table: "StockPriceHistories",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "TimeStamp",
                table: "StockPriceHistories",
                newName: "RecordedAt");

            migrationBuilder.RenameIndex(
                name: "IX_StockPriceHistories_StockId_TimeStamp",
                table: "StockPriceHistories",
                newName: "IX_StockPriceHistories_StockId_RecordedAt");
        }
    }
}
