using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class cambioNombreFechaAceptadaAFechaRevisada : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FechaAceptada",
                table: "SolicitudServicio",
                newName: "FechaRevisada");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FechaRevisada",
                table: "SolicitudServicio",
                newName: "FechaAceptada");
        }
    }
}
