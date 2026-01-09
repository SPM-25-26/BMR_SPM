using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eppoi.Models.Migrations
{
    /// <inheritdoc />
    public partial class Preferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Preferences");

            migrationBuilder.AddColumn<int>(
                name: "Preferences",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Preferences",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "Preferences",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ArtCultures = table.Column<int>(type: "int", nullable: false),
                    Articles = table.Column<int>(type: "int", nullable: false),
                    Entertainments = table.Column<int>(type: "int", nullable: false),
                    Events = table.Column<int>(type: "int", nullable: false),
                    Natures = table.Column<int>(type: "int", nullable: false),
                    Organizations = table.Column<int>(type: "int", nullable: false),
                    Restaurants = table.Column<int>(type: "int", nullable: false),
                    Routes = table.Column<int>(type: "int", nullable: false),
                    Shoppings = table.Column<int>(type: "int", nullable: false),
                    Sleeps = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Preferences", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Preferences_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
