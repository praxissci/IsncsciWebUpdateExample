using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Isncsci.Web.Startup))]
namespace Isncsci.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
