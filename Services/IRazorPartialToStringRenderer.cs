using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;

namespace HOTWallets.Services
{
    public interface IRazorPartialToStringRenderer
    {
        Task<string> RenderPartialToStringAsync(string partialName, object model);
    }

    public class RazorPartialToStringRenderer : IRazorPartialToStringRenderer
    {
        private IRazorViewEngine _ViewEngine;
        private ITempDataProvider _TempDataProvider;
        private IServiceProvider _ServiceProvider;
        private readonly IHttpContextAccessor _ContextAccessor;

        public RazorPartialToStringRenderer(IRazorViewEngine viewEngine, ITempDataProvider tempDataProvider, IServiceProvider serviceProvider, IHttpContextAccessor contextAccessor)
        {
            _ViewEngine = viewEngine;
            _TempDataProvider = tempDataProvider;
            _ServiceProvider = serviceProvider;
            _ContextAccessor = contextAccessor;
        }

        public async Task<string> RenderPartialToStringAsync(string partialName, object model)
        {
            //var httpContext = new DefaultHttpContext { RequestServices = _ServiceProvider };
            var actionContext = new ActionContext(_ContextAccessor.HttpContext, _ContextAccessor.HttpContext.GetRouteData(), new ActionDescriptor());
            using (var sw = new StringWriter())
            {
                var viewResult = FindView(actionContext, partialName);
                if (viewResult == null)
                {
                    throw new ArgumentNullException($"{partialName} does not match any available view");
                }
                var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                {
                    Model = model
                };
                var viewContext = new ViewContext(
                    actionContext,
                    viewResult,
                    viewDictionary,
                    new TempDataDictionary(actionContext.HttpContext, _TempDataProvider),
                    sw,
                    new HtmlHelperOptions()
                );
                await viewResult.RenderAsync(viewContext);
                return sw.ToString();
            }
        }

        private IView FindView(ActionContext actionContext, string partialName)
        {
            var getPartialResult = _ViewEngine.GetView(null, partialName, false);
            if (getPartialResult.Success)
                return getPartialResult.View;

            var findPartialResult = _ViewEngine.FindView(actionContext, partialName, false);
            if (findPartialResult.Success)
                return findPartialResult.View;

            var searchedLocations = getPartialResult.SearchedLocations.Concat(findPartialResult.SearchedLocations);
            var errorMessage = string.Join(
                Environment.NewLine,
                new[] { $"Unable to find partial '{partialName}'. The following locations were searched:" }.Concat(searchedLocations)); ;
            throw new InvalidOperationException(errorMessage);
        }

        private ActionContext GetActionContext()
        {
            var httpContext = new DefaultHttpContext
            {
                RequestServices = _ServiceProvider
            };
            //return new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
            return new ActionContext(_ContextAccessor.HttpContext, _ContextAccessor.HttpContext.GetRouteData(), new ActionDescriptor());
        }
    }
}
