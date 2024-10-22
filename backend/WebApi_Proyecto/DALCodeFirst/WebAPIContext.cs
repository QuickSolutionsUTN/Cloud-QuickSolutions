using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore; //DbContext
using Microsoft.EntityFrameworkCore.SqlServer;

namespace DALCodeFirst;

//contexto para la base de datos
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public partial class WebAPIContext : IdentityDbContext<Usuario, Rol, string>
{
    public WebAPIContext(DbContextOptions<WebAPIContext> options) : base(options) { }

    public DbSet<Equipo> Equipo { get; set; }
    public DbSet<EstadoEquipo> EstadoEquipo { get; set; }
    public DbSet<Marca> Marca { get; set; }
    public DbSet<SolicitudAlquiler> SolicitudAlquiler { get; set; }
    public DbSet<SolicitudAlquilerEstado> SolicitudAlquilerEstado { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Configuración para renombrar las tablas AsnNetUser y AspNetRoles
        modelBuilder.Entity<Usuario>().ToTable("Usuarios");
        modelBuilder.Entity<Rol>().ToTable("Roles");
    }
}