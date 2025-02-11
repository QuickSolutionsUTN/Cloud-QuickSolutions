using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class CambiosMantenimientos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "TipoMantenimiento",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<int>(
                name: "IdTipoProducto",
                table: "TipoMantenimiento",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "TipoMantenimiento",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TipoMantenimiento_IdTipoProducto",
                table: "TipoMantenimiento",
                column: "IdTipoProducto");

            migrationBuilder.AddForeignKey(
                name: "FK_TipoMantenimiento_TipoProducto_IdTipoProducto",
                table: "TipoMantenimiento",
                column: "IdTipoProducto",
                principalTable: "TipoProducto",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TipoMantenimiento_TipoProducto_IdTipoProducto",
                table: "TipoMantenimiento");

            migrationBuilder.DropIndex(
                name: "IX_TipoMantenimiento_IdTipoProducto",
                table: "TipoMantenimiento");

            migrationBuilder.DropColumn(
                name: "IdTipoProducto",
                table: "TipoMantenimiento");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "TipoMantenimiento");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "TipoMantenimiento",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(250)",
                oldMaxLength: 250);
        }
    }
}
