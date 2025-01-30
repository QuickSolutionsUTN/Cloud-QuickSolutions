using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class Correccion_SolicitudServicio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReparacionLocal",
                table: "SolicitudServicio",
                newName: "Tercearizado");

            // Agregar la columna IdTipoMantenimiento
            migrationBuilder.AddColumn<int>(
                name: "IdTipoMantenimiento",
                table: "SolicitudServicio",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "FechaDeNacimiento",
                table: "Usuarios",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "SolicitudServicio",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<bool>(
                name: "ConLogistica",
                table: "SolicitudServicio",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaEstimada",
                table: "SolicitudServicio",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Monto",
                table: "SolicitudServicio",
                type: "real",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TipoMantenimiento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoMantenimiento", x => x.Id);
                });

            // Restaurar la clave foránea para IdTipoMantenimiento
            migrationBuilder.AddForeignKey(
                name: "FK_SolicitudServicio_TipoMantenimiento_IdTipoMantenimiento",
                table: "SolicitudServicio",
                column: "IdTipoMantenimiento",
                principalTable: "TipoMantenimiento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SolicitudServicio_TipoMantenimiento_IdTipoMantenimiento",
                table: "SolicitudServicio");

            migrationBuilder.DropTable(
                name: "TipoMantenimiento");

            migrationBuilder.DropColumn(
                name: "IdTipoMantenimiento",
                table: "SolicitudServicio");

            migrationBuilder.DropColumn(
                name: "ConLogistica",
                table: "SolicitudServicio");

            migrationBuilder.DropColumn(
                name: "FechaEstimada",
                table: "SolicitudServicio");

            migrationBuilder.DropColumn(
                name: "Monto",
                table: "SolicitudServicio");

            migrationBuilder.RenameColumn(
                name: "Tercearizado",
                table: "SolicitudServicio",
                newName: "ReparacionLocal");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaDeNacimiento",
                table: "Usuarios",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "SolicitudServicio",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            // Restaurar la relación anterior si existiera
            migrationBuilder.AddForeignKey(
                name: "FK_SolicitudServicio_CategoriaProducto_IdCategoriaProducto",
                table: "SolicitudServicio",
                column: "IdCategoriaProducto",
                principalTable: "CategoriaProducto",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }

    }
