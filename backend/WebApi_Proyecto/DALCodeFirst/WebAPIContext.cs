using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore; //DbContext

//La BD creada se llama:
namespace DALCodeFirst;

//contexto para la base de datos
public partial class WebAPIContext : DbContext
{
    public WebAPIContext()
    {
    }
    public WebAPIContext(DbContextOptions<WebAPIContext> options) : base(options) { } //constructor

    //dbset para la tabla de productos y categorias
    public DbSet<Producto> Productos { get; set; }
    public DbSet<Categoria> Categorias { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Persist Security Info=True;Password=tallersoft600;Username=postgres;Database=S31-Productos;Port=14998;Host=colosal.duckdns.org");
}