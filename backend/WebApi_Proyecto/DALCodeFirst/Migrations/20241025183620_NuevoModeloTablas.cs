using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DALCodeFIrst.Migrations
{
    /// <inheritdoc />
    public partial class NuevoModeloTablas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SolicitudAlquiler");

            migrationBuilder.DropTable(
                name: "Equipo");

            migrationBuilder.DropTable(
                name: "SolicitudAlquilerEstado");

            migrationBuilder.DropTable(
                name: "EstadoEquipo");

            migrationBuilder.DropTable(
                name: "Marca");

            migrationBuilder.CreateTable(
                name: "CategoriaProducto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriaProducto", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmpresaExterna",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CUIL = table.Column<int>(type: "integer", nullable: false),
                    Telefono = table.Column<int>(type: "integer", nullable: false),
                    Email = table.Column<char>(type: "character(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmpresaExterna", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SolicitudServicioEstado",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitudServicioEstado", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TipoServicio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoServicio", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TipoProducto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IdCategoriaProducto = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoProducto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TipoProducto_CategoriaProducto_IdCategoriaProducto",
                        column: x => x.IdCategoriaProducto,
                        principalTable: "CategoriaProducto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmpresaCategoria",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdEmpresa = table.Column<int>(type: "integer", nullable: false),
                    IdCategoria = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmpresaCategoria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmpresaCategoria_CategoriaProducto_IdCategoria",
                        column: x => x.IdCategoria,
                        principalTable: "CategoriaProducto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmpresaCategoria_EmpresaExterna_IdEmpresa",
                        column: x => x.IdEmpresa,
                        principalTable: "EmpresaExterna",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SolicitudServicio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdSolicitante = table.Column<string>(type: "text", nullable: false),
                    IdTipoServicio = table.Column<int>(type: "integer", nullable: false),
                    IdCategoriaProducto = table.Column<int>(type: "integer", nullable: false),
                    IdTipoProducto = table.Column<int>(type: "integer", nullable: false),
                    FechaGeneracion = table.Column<DateTime>(type: "date", nullable: false),
                    IdSolicitudServicioEstado = table.Column<int>(type: "integer", nullable: false),
                    IdSolicitudAlquilerEstado = table.Column<int>(type: "integer", nullable: false),
                    IdTecnicoAsignado = table.Column<string>(type: "text", nullable: false),
                    ReparacionLocal = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitudServicio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitudServicio_CategoriaProducto_IdCategoriaProducto",
                        column: x => x.IdCategoriaProducto,
                        principalTable: "CategoriaProducto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitudServicio_SolicitudServicioEstado_IdSolicitudAlquil~",
                        column: x => x.IdSolicitudAlquilerEstado,
                        principalTable: "SolicitudServicioEstado",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitudServicio_TipoProducto_IdTipoProducto",
                        column: x => x.IdTipoProducto,
                        principalTable: "TipoProducto",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitudServicio_TipoServicio_IdTipoServicio",
                        column: x => x.IdTipoServicio,
                        principalTable: "TipoServicio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitudServicio_Usuarios_IdSolicitante",
                        column: x => x.IdSolicitante,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitudServicio_Usuarios_IdTecnicoAsignado",
                        column: x => x.IdTecnicoAsignado,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReparacionExterna",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdSolicitud = table.Column<int>(type: "integer", nullable: false),
                    IdEmpresa = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReparacionExterna", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReparacionExterna_EmpresaExterna_IdEmpresa",
                        column: x => x.IdEmpresa,
                        principalTable: "EmpresaExterna",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReparacionExterna_SolicitudServicio_IdSolicitud",
                        column: x => x.IdSolicitud,
                        principalTable: "SolicitudServicio",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmpresaCategoria_IdCategoria",
                table: "EmpresaCategoria",
                column: "IdCategoria");

            migrationBuilder.CreateIndex(
                name: "IX_EmpresaCategoria_IdEmpresa",
                table: "EmpresaCategoria",
                column: "IdEmpresa");

            migrationBuilder.CreateIndex(
                name: "IX_ReparacionExterna_IdEmpresa",
                table: "ReparacionExterna",
                column: "IdEmpresa");

            migrationBuilder.CreateIndex(
                name: "IX_ReparacionExterna_IdSolicitud",
                table: "ReparacionExterna",
                column: "IdSolicitud");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudServicio_IdCategoriaProducto",
                table: "SolicitudServicio",
                column: "IdCategoriaProducto");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudServicio_IdSolicitante",
                table: "SolicitudServicio",
                column: "IdSolicitante");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudServicio_IdSolicitudAlquilerEstado",
                table: "SolicitudServicio",
                column: "IdSolicitudAlquilerEstado");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudServicio_IdTecnicoAsignado",
                table: "SolicitudServicio",
                column: "IdTecnicoAsignado");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudServicio_IdTipoProducto",
                table: "SolicitudServicio",
                column: "IdTipoProducto");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudServicio_IdTipoServicio",
                table: "SolicitudServicio",
                column: "IdTipoServicio");

            migrationBuilder.CreateIndex(
                name: "IX_TipoProducto_IdCategoriaProducto",
                table: "TipoProducto",
                column: "IdCategoriaProducto");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmpresaCategoria");

            migrationBuilder.DropTable(
                name: "ReparacionExterna");

            migrationBuilder.DropTable(
                name: "EmpresaExterna");

            migrationBuilder.DropTable(
                name: "SolicitudServicio");

            migrationBuilder.DropTable(
                name: "SolicitudServicioEstado");

            migrationBuilder.DropTable(
                name: "TipoProducto");

            migrationBuilder.DropTable(
                name: "TipoServicio");

            migrationBuilder.DropTable(
                name: "CategoriaProducto");

            migrationBuilder.CreateTable(
                name: "EstadoEquipo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstadoEquipo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Marca",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Marca", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SolicitudAlquilerEstado",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitudAlquilerEstado", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Equipo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdEstadoEquipo = table.Column<int>(type: "integer", nullable: false),
                    IdMarca = table.Column<int>(type: "integer", nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Nombre = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Equipo_EstadoEquipo_IdEstadoEquipo",
                        column: x => x.IdEstadoEquipo,
                        principalTable: "EstadoEquipo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Equipo_Marca_IdMarca",
                        column: x => x.IdMarca,
                        principalTable: "Marca",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SolicitudAlquiler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdEquipo = table.Column<int>(type: "integer", nullable: false),
                    IdSolicitudAlquilerEstado = table.Column<int>(type: "integer", nullable: false),
                    IdUsuario = table.Column<string>(type: "text", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "date", nullable: false),
                    FechaGeneracion = table.Column<DateTime>(type: "date", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitudAlquiler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitudAlquiler_Equipo_IdEquipo",
                        column: x => x.IdEquipo,
                        principalTable: "Equipo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitudAlquiler_SolicitudAlquilerEstado_IdSolicitudAlquil~",
                        column: x => x.IdSolicitudAlquilerEstado,
                        principalTable: "SolicitudAlquilerEstado",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SolicitudAlquiler_Usuarios_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Equipo_IdEstadoEquipo",
                table: "Equipo",
                column: "IdEstadoEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_Equipo_IdMarca",
                table: "Equipo",
                column: "IdMarca");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudAlquiler_IdEquipo",
                table: "SolicitudAlquiler",
                column: "IdEquipo");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudAlquiler_IdSolicitudAlquilerEstado",
                table: "SolicitudAlquiler",
                column: "IdSolicitudAlquilerEstado");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudAlquiler_IdUsuario",
                table: "SolicitudAlquiler",
                column: "IdUsuario");
        }
    }
}
