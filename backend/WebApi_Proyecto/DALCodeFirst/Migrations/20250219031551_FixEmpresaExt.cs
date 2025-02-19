using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class FixEmpresaExt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "CUIL",
                table: "EmpresaExterna",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CUIL",
                table: "EmpresaExterna",
                type: "integer",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }
    }
}
