using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class CorrecionFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SolicitudServicio_TipoMantenimiento_IdTipoMantenimiento",
                table: "SolicitudServicio");

            migrationBuilder.AlterColumn<int>(
                name: "IdTipoMantenimiento",
                table: "SolicitudServicio",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_SolicitudServicio_TipoMantenimiento_IdTipoMantenimiento",
                table: "SolicitudServicio",
                column: "IdTipoMantenimiento",
                principalTable: "TipoMantenimiento",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SolicitudServicio_TipoMantenimiento_IdTipoMantenimiento",
                table: "SolicitudServicio");

            migrationBuilder.AlterColumn<int>(
                name: "IdTipoMantenimiento",
                table: "SolicitudServicio",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SolicitudServicio_TipoMantenimiento_IdTipoMantenimiento",
                table: "SolicitudServicio",
                column: "IdTipoMantenimiento",
                principalTable: "TipoMantenimiento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
