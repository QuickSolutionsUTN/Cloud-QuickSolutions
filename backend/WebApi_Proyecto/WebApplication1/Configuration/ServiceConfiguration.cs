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
using FluentAssertions.Common;
using FluentValidation.AspNetCore;
using WebAPI.Validators;
using FluentValidation;

public static class ServiceConfiguration
{
    public static void ConfigureServices(WebApplicationBuilder builder)
    {
        // Configurar autenticación
        var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettingsDTO>();
        builder.Services.AddSingleton(jwtSettings);//lo registro como servicio para que se pueda acceder desde cualquier parte de la aplicación

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
            };
        });

        //Autorización
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
        });

        //configurar Serilog
        builder.Host.UseSerilog();

        //configurar AutoMapper
        builder.Services.AddAutoMapper(typeof(MappingProfile));

        //dbContext
        builder.Services.AddDbContext<WebAPIContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        //controladores
        builder.Services.AddControllers(options =>
        {
            options.Filters.Add<ValidationLoggingFilter>();
        });

        //swagger
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new() { Title = "WebAPI", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Por favor ingrese el token en el formato **Bearer {token}**",
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });

        //Servicios
        builder.Services.AddScoped<ITokenServicio, TokenServicio>();
        builder.Services.AddScoped<IUsuarioServicio, UsuarioServicio>();
        builder.Services.AddScoped<IRolServicio, RolServicio>();
        builder.Services.AddScoped<IMarcaServicio, MarcaServicio>();
        builder.Services.AddScoped<IEquipoServicio, EquipoServicio>();

        //Identity
        builder.Services.AddIdentity<Usuario, Rol>(options =>
        {
            // Configuración de opciones de Identity (opcional)
            options.User.RequireUniqueEmail = true;
        })

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


        builder.Services.AddTransient<IValidator<EquipoInDTO>, CrearEquipoValidator>();
       // builder.Services.AddControllers().AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CrearEquipoValidator>());

        // Añadir CORS para probar los endpoints en modo local (testing)
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins",
                builder =>
                {
                    builder
                    .AllowAnyOrigin() // Permitir cualquier origen
                    .AllowAnyMethod()
                    .AllowAnyHeader();



                });
        });

    }


}