using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class CheckListMant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CheckListMantenimiento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdTipoMantenimiento = table.Column<int>(type: "integer", nullable: false),
                    Tarea = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Obligatorio = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckListMantenimiento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CheckListMantenimiento_TipoMantenimiento_IdTipoMantenimiento",
                        column: x => x.IdTipoMantenimiento,
                        principalTable: "TipoMantenimiento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CheckListMantenimiento_IdTipoMantenimiento",
                table: "CheckListMantenimiento",
                column: "IdTipoMantenimiento");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CheckListMantenimiento");
        }
    }
}
