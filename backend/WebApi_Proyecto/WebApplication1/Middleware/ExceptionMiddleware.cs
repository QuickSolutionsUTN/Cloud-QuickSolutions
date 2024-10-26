using System.Net;


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
            //para intermediar la solicitud http
            await _next(httpContext);

            // Manejar errores de validación
            if (httpContext.Response.StatusCode == StatusCodes.Status400BadRequest &&
                httpContext.Items.ContainsKey("ValidationErrors"))
            {
                var validationErrors = httpContext.Items["ValidationErrors"] as IDictionary<string, string[]>;
                await HandleValidationErrorsAsync(httpContext, validationErrors);
            }
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(httpContext, ex);
        }

        // Manejar errores de autenticación y autorización
        if (!httpContext.Response.HasStarted)
        {
            if (httpContext.Response.StatusCode == StatusCodes.Status401Unauthorized)
            {
                // Si ya se ha devuelto un Unauthorized, no hacer nada
                await HandleUnauthorizedAsync(httpContext);
            }
            else
            if (httpContext.Response.StatusCode == StatusCodes.Status403Forbidden)
            {
                await HandleForbiddenAsync(httpContext);
            }
        }
    }

    private Task HandleValidationErrorsAsync(HttpContext context, IDictionary<string, string[]> validationErrors)
    {
        var response = new
        {
            status = (int)HttpStatusCode.BadRequest,
            message = "Errores de validación.",
            errors = validationErrors
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
        return context.Response.WriteAsJsonAsync(response);
    }
    private Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        _logger.LogError(ex, "Ha ocurrido un error procesando la solicitud.");

        var response = new
        {
            status = (int)HttpStatusCode.InternalServerError,
            message = "Ocurrió un error en el servidor.",
            details = "Ha ocurrido un error en la solicitud."
        };

        // Personaliza el mensaje según el tipo de excepción
        if (ex is ArgumentNullException)
        {
            response = new
            {
                status = (int)HttpStatusCode.BadRequest,
                message = "Error de validación.",
                details = "Falta un argumento obligatorio."
            };
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
        }
        else if (ex is UnauthorizedAccessException)
        {
            response = new
            {
                status = (int)HttpStatusCode.Forbidden,
                message = "Acceso denegado.",
                details = "No tienes permisos para acceder a este recurso."
            };
            context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
        }

        context.Response.ContentType = "application/json";
        return context.Response.WriteAsJsonAsync(response);
    }

    private Task HandleUnauthorizedAsync(HttpContext context)
    {
        var response = new
        {
            status = (int)HttpStatusCode.Unauthorized,
            message = "No estás autenticado.",
            details = "El token de autenticación es inválido o ha expirado."
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        return context.Response.WriteAsJsonAsync(response);
    }

    private Task HandleForbiddenAsync(HttpContext context)
    {
        var response = new
        {
            status = (int)HttpStatusCode.Forbidden,
            message = "Acceso denegado.",
            details = "No tienes permiso para acceder a este recurso."
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
        return context.Response.WriteAsJsonAsync(response);
    }
}