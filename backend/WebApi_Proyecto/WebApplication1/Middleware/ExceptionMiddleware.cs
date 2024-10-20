using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;


    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Algo salió mal: {ex.Message}");
            await HandleExceptionAsync(httpContext, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        // Personalizar el mensaje según el tipo de excepción.
        var result = string.Empty;

        if (ex is UnauthorizedAccessException)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized; // 401
            result = JsonSerializer.Serialize(new { message = "Usuario no autorizado." });
        }
        else if (ex is InvalidOperationException) // Puedes agregar más excepciones personalizadas aquí.
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest; // 400
            result = JsonSerializer.Serialize(new { message = ex.Message });
        }
        else
        {
            result = JsonSerializer.Serialize(new { message = "Ocurrió un error interno en el servidor." });
        }


        return context.Response.WriteAsJsonAsync(result);
    }
}