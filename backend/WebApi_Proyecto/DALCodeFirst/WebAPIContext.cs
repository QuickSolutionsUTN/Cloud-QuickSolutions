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
    public DbSet<CategoriaProducto> CategoriaProducto { get; set; }
    public DbSet<EmpresaExterna> EmpresaExterna { get; set; }
    public DbSet<EmpresaCategoria> EmpresaCategoria { get; set; }
    public DbSet<ReparacionExterna> ReparacionExterna { get; set; }
    public DbSet<TipoProducto> TipoProducto { get; set; }
    public DbSet<TipoServicio> TipoServicio { get; set; }
    public DbSet<SolicitudServicio> SolicitudServicio { get; set; }
    public DbSet<SolicitudServicioEstado> SolicitudServicioEstado { get; set; }
    public DbSet<TipoMantenimiento> TipoMantenimiento { get; set; }
    public DbSet<CheckListMantenimiento> CheckListMantenimiento { get; set; }
    public DbSet<Domicilio> Domicilio { get; set; }
    public DbSet<Envio> Envio { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Configuración para renombrar las tablas AsnNetUser y AspNetRoles
        modelBuilder.Entity<Usuario>().ToTable("Usuarios");
        modelBuilder.Entity<Rol>().ToTable("Roles");
    }
}