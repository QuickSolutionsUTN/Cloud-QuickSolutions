using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class modificandoSolicitud : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiagnosticoTecnico",
                table: "SolicitudServicio",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaAprobada",
                table: "SolicitudServicio",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaFinalizada",
                table: "SolicitudServicio",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaPresupuestada",
                table: "SolicitudServicio",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiagnosticoTecnico",
                table: "SolicitudServicio");

            migrationBuilder.DropColumn(
                name: "FechaAprobada",
                table: "SolicitudServicio");

            migrationBuilder.DropColumn(
                name: "FechaFinalizada",
                table: "SolicitudServicio");

            migrationBuilder.DropColumn(
                name: "FechaPresupuestada",
                table: "SolicitudServicio");
        }
    }
}
