using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class Envio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Domicilio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Calle = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Numero = table.Column<int>(type: "integer", nullable: false),
                    Departamento = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Ciudad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Provincia = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CodigoPostal = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Pais = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IdUsuario = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Domicilio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Domicilio_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Envio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdSolicitudServicio = table.Column<int>(type: "integer", nullable: false),
                    Calle = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Numero = table.Column<int>(type: "integer", nullable: false),
                    Departamento = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Ciudad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Provincia = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CodigoPostal = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Pais = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Envio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Envio_SolicitudServicio_IdSolicitudServicio",
                        column: x => x.IdSolicitudServicio,
                        principalTable: "SolicitudServicio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Domicilio_IdUsuario",
                table: "Domicilio",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Envio_IdSolicitudServicio",
                table: "Envio",
                column: "IdSolicitudServicio",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Domicilio");

            migrationBuilder.DropTable(
                name: "Envio");
        }
    }
}
