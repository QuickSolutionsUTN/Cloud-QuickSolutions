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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración para renombrar las tablas AsnNetUser y AspNetRoles
        modelBuilder.Entity<Usuario>().ToTable("Usuarios");
        modelBuilder.Entity<Rol>().ToTable("Roles");
    }
}