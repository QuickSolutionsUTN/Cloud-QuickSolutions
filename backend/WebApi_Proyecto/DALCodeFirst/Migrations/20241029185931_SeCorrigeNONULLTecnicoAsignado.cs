using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class SeCorrigeNONULLTecnicoAsignado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SolicitudServicio_Usuarios_IdTecnicoAsignado",
                table: "SolicitudServicio");

            migrationBuilder.AlterColumn<string>(
                name: "IdTecnicoAsignado",
                table: "SolicitudServicio",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_SolicitudServicio_Usuarios_IdTecnicoAsignado",
                table: "SolicitudServicio",
                column: "IdTecnicoAsignado",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SolicitudServicio_Usuarios_IdTecnicoAsignado",
                table: "SolicitudServicio");

            migrationBuilder.AlterColumn<string>(
                name: "IdTecnicoAsignado",
                table: "SolicitudServicio",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SolicitudServicio_Usuarios_IdTecnicoAsignado",
                table: "SolicitudServicio",
                column: "IdTecnicoAsignado",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
