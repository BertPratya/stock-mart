using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class resolveStockQuote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockModels_StockQuotes_StockQuoteId",
                table: "StockModels");

            migrationBuilder.DropIndex(
                name: "IX_StockModels_StockQuoteId",
                table: "StockModels");

            migrationBuilder.CreateIndex(
                name: "IX_StockQuotes_StockId",
                table: "StockQuotes",
                column: "StockId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StockQuotes_StockModels_StockId",
                table: "StockQuotes",
                column: "StockId",
                principalTable: "StockModels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockQuotes_StockModels_StockId",
                table: "StockQuotes");

            migrationBuilder.DropIndex(
                name: "IX_StockQuotes_StockId",
                table: "StockQuotes");

            migrationBuilder.CreateIndex(
                name: "IX_StockModels_StockQuoteId",
                table: "StockModels",
                column: "StockQuoteId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StockModels_StockQuotes_StockQuoteId",
                table: "StockModels",
                column: "StockQuoteId",
                principalTable: "StockQuotes",
                principalColumn: "StockQuoteId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
