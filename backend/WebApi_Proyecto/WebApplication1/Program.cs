using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
using Servicios;
using DALCodeFirst;
using Core.DTOs;
using DALCodeFirst.Modelos;

Log.Logger = new LoggerConfiguration()
   .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("logs/myapp.txt", rollingInterval: RollingInterval.Day)
    .WriteTo.Debug()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

ServiceConfiguration.ConfigureServices(builder);


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>(); // Middleware para excepciones
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseRouting(); 
app.UseCors("AllowAllOrigins"); 
app.UseAuthentication();
app.UseAuthorization(); 
app.MapControllers();

app.Use(async (context, next) =>
{
    var authenticationHeader = context.Request.Headers["Authorization"];
    if (string.IsNullOrEmpty(authenticationHeader))
    {
        Console.WriteLine("No Authorization header found");
    }
    else
    {
        Console.WriteLine($"Authorization header: {authenticationHeader}");
    }

    await next();
});
app.Run();
