using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class FixEmpresaExt2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "EmpresaExterna",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(char),
                oldType: "character(50)",
                oldMaxLength: 50);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<char>(
                name: "Email",
                table: "EmpresaExterna",
                type: "character(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);
        }
    }
}
