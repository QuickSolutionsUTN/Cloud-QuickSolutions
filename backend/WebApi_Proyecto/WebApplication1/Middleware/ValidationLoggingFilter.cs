using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System.Linq;

public class ValidationLoggingFilter : IActionFilter
{
    private readonly ILogger<ValidationLoggingFilter> _logger;

    public ValidationLoggingFilter(ILogger<ValidationLoggingFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            foreach (var error in context.ModelState.Values.SelectMany(v => v.Errors))
            {
                _logger.LogError($"Model validation error: {error.ErrorMessage}");
            }
        }
    }
    public void OnActionExecuted(ActionExecutedContext context){ }

}