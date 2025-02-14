using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
using Servicios;
using DALCodeFirst;
using Core.DTOs;
using DALCodeFirst.Modelos;
using WebAPI.Validators;
using FluentValidation;
using FluentAssertions.Common;


public static class ServiceConfiguration
{
    public static void ConfigureServices(WebApplicationBuilder builder)
    {
        // Configurar autenticación
        var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettingsDTO>();

        builder.Services.AddSingleton(jwtSettings);//lo registro como servicio para que se pueda acceder desde cualquier parte de la aplicación

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme=JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
                };
            });

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
        });

        builder.Services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 8; 
        });


        //configurar Serilog
        builder.Host.UseSerilog();

        //configurar AutoMapper
        builder.Services.AddAutoMapper(typeof(MappingProfile));

        //dbContext
        builder.Services.AddDbContext<WebAPIContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        //controladores
        builder.Services.AddControllers(options =>
        {
            options.Filters.Add<ValidationLoggingFilter>();
        });

        //swagger
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {

            // Definir la seguridad para JWT Bearer
            var jwtSecurityScheme = new OpenApiSecurityScheme
            {
                BearerFormat = "JWT",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = JwtBearerDefaults.AuthenticationScheme,
                Description = "Por favor ingrese el token ",
                Reference = new OpenApiReference
                {
                    Id = JwtBearerDefaults.AuthenticationScheme,
                    Type = ReferenceType.SecurityScheme,
                }
            };
            options.AddSecurityDefinition("Bearer", jwtSecurityScheme);
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {jwtSecurityScheme, Array.Empty<string>() }
            });

        });


        //Servicios
        builder.Services.AddScoped<ITokenServicio, TokenServicio>();
        builder.Services.AddScoped<IUsuarioServicio, UsuarioServicio>();
        builder.Services.AddScoped<IRolServicio, RolServicio>();
        builder.Services.AddScoped<ICategoriaServicio, CategoriaServicio>();
        builder.Services.AddScoped<ISolicitudEstadoServicio, SolicitudEstadoServicio>();
        builder.Services.AddScoped<ISolicitudServicio_Servicio, SolicitudServicio_Servicio>();
        builder.Services.AddScoped<ITipoProductoServicio, TipoProductoServicio>();
        builder.Services.AddScoped<ITipoServicio_Servicio, TipoServicio_Servicio>();
        builder.Services.AddScoped<IMantenimientoServicio, MantenimientoServicio>();
        /*
        //Identity
        builder.Services.AddIdentity<Usuario, Rol>(options =>
        {
            // Configuración de opciones de Identity (opcional)
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<WebAPIContext>()
        .AddDefaultTokenProviders();*/

        builder.Services.AddIdentityCore<Usuario>(options =>
        {
            options.User.RequireUniqueEmail = true;
        })
        .AddRoles<Rol>()
        .AddEntityFrameworkStores<WebAPIContext>()
        .AddDefaultTokenProviders();

        //Filtros
        builder.Services.ConfigureApplicationCookie(options =>
        {
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };

            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });


        builder.Services.AddTransient<IValidator<SolicitudCreacionDTO>, CrearSolicitudValidator>();
       // builder.Services.AddControllers().AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CrearEquipoValidator>());

        // Añadir CORS para probar los endpoints en modo local (testing)
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins",
                builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
        });
    }
}