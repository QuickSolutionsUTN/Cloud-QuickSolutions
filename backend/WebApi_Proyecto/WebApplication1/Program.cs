

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using DALCodeFirst;
using Core.DTOs;
using DALCodeFirst.Modelos;
using Microsoft.AspNetCore.Identity;
using Servicios;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()  // Solo loguea mensajes de 'Information' en adelante
    .WriteTo.Console()
    .WriteTo.File("logs/myapp.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

// Configura AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile)); 

// Agrega el DbContext al contenedor de servicios

builder.Services.AddDbContext<WebAPIContext>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de ASP.NET Identity
builder.Services.AddIdentity<Usuario, Rol>(options =>
{
    // Configuración de opciones de Identity (opcional)
    options.User.RequireUniqueEmail = true;
    // Agrega más opciones según sea necesario
})
.AddEntityFrameworkStores<WebAPIContext>()
.AddDefaultTokenProviders();

builder.Services.AddScoped<IUsuarioServicio, UsuarioServicio>();
builder.Services.AddScoped<IRolServicio, RolServicio>();

var app = builder.Build();

// Registrar el middleware personalizado
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//app.UseStaticFiles();
//app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
