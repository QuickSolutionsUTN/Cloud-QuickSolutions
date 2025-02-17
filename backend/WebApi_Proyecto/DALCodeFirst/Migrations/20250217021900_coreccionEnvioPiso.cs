using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class coreccionEnvioPiso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Envio\" SET \"Piso\" = NULL WHERE \"Piso\" = '';");

            // Ahora podemos cambiar el tipo de la columna sin problemas
            migrationBuilder.Sql("ALTER TABLE \"Envio\" ALTER COLUMN \"Piso\" TYPE integer USING \"Piso\"::integer;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Piso",
                table: "Envio",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
