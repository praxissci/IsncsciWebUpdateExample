using System.Web.Http.Filters;

namespace Isncsci.Web.Filters
{
    public class CrossDomainActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            // The following two lines were part of the original code where this filter was taken from (http://stackoverflow.com/questions/13018020/mvc-webapi-cross-domain-post)
            // They seem redundant and always true.
            //var needCrossDomain = true;
            //if (needCrossDomain)
            actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            base.OnActionExecuted(actionExecutedContext);
        }
    }
}