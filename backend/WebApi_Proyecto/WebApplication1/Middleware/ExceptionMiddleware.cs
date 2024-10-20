using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

public class ExceptionMiddleware
{


    
    private readonly RequestDelegate _next;

    //logger, por ahora no se va a usar
    //private readonly ILogger<ExceptionMiddleware> _logger;


    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
        //_logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            //para intermediar la solicitud http
            await _next(httpContext);

        }
        catch (UnauthorizedAccessException ex)
        {
            //_logger.LogWarning(ex, "Unauthorized access.");
            await HandleUnauthorizedExceptionAsync(httpContext, ex);
        }
        catch (Exception ex)
        {
            //_logger.LogError($"Algo salió mal: {ex.Message}");
            await HandleExceptionAsync(httpContext, ex);
        }
    }

    private static Task HandleUnauthorizedExceptionAsync(HttpContext context, UnauthorizedAccessException exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

        var result = new
        {
            message = "No estás autorizado para acceder a este recurso."
        };

        return context.Response.WriteAsJsonAsync(result);
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        // Personalizar el mensaje según el tipo de excepción.
        var result = new
        {
            message = "Ocurrió un error en el servidor.",
            details = ex.Message // Optional: Include exception details for debugging
        };


        return context.Response.WriteAsJsonAsync(result);
    }
}