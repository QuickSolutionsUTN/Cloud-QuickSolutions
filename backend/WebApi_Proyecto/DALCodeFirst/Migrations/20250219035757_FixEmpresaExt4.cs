using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class FixEmpresaExt4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdSolicitudExterna",
                table: "ReparacionExterna",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdSolicitudExterna",
                table: "ReparacionExterna");
        }
    }
}
