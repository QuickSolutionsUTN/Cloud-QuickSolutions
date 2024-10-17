using DALCodeFirst.Modelos;
using Microsoft.EntityFrameworkCore; //DbContext

//La BD creada se llama S31-Productos
namespace DALCodeFirst;

//contexto para la base de datos
public partial class WebAPIContext : DbContext
{
    public WebAPIContext()
    {
    }
    public WebAPIContext(DbContextOptions<WebAPIContext> options) : base(options) { } //constructor

    //dbset para la tabla de productos y categorias
    public DbSet<Usuario> Usuario { get; set; }
    //public DbSet<Categoria> Categorias { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Configuraciones adicionales del modelo
    }

}