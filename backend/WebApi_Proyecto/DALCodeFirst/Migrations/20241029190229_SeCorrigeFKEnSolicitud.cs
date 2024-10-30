using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class SeCorrigeFKEnSolicitud : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SolicitudServicio_SolicitudServicioEstado_IdSolicitudAlquil~",
                table: "SolicitudServicio");

            migrationBuilder.DropIndex(
                name: "IX_SolicitudServicio_IdSolicitudAlquilerEstado",
                table: "SolicitudServicio");

            migrationBuilder.DropColumn(
                name: "IdSolicitudAlquilerEstado",
                table: "SolicitudServicio");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudServicio_IdSolicitudServicioEstado",
                table: "SolicitudServicio",
                column: "IdSolicitudServicioEstado");

            migrationBuilder.AddForeignKey(
                name: "FK_SolicitudServicio_SolicitudServicioEstado_IdSolicitudServic~",
                table: "SolicitudServicio",
                column: "IdSolicitudServicioEstado",
                principalTable: "SolicitudServicioEstado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SolicitudServicio_SolicitudServicioEstado_IdSolicitudServic~",
                table: "SolicitudServicio");

            migrationBuilder.DropIndex(
                name: "IX_SolicitudServicio_IdSolicitudServicioEstado",
                table: "SolicitudServicio");

            migrationBuilder.AddColumn<int>(
                name: "IdSolicitudAlquilerEstado",
                table: "SolicitudServicio",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudServicio_IdSolicitudAlquilerEstado",
                table: "SolicitudServicio",
                column: "IdSolicitudAlquilerEstado");

            migrationBuilder.AddForeignKey(
                name: "FK_SolicitudServicio_SolicitudServicioEstado_IdSolicitudAlquil~",
                table: "SolicitudServicio",
                column: "IdSolicitudAlquilerEstado",
                principalTable: "SolicitudServicioEstado",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
