using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeExpenses.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaDataTransacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Data",
                table: "TabelaTransacao",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data",
                table: "TabelaTransacao");
        }
    }
}
