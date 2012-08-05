using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Http.Filters;

namespace SampleSearchWebService.Net
{
	// Note: For instructions on enabling IIS6 or IIS7 classic mode, 
	// visit http://go.microsoft.com/?LinkId=9394801

	public class MvcApplication : System.Web.HttpApplication
	{
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.MapHttpRoute(
				name: "DefaultApi",
				routeTemplate: "api/{controller}/{searchExpression}",
				defaults: new { controller = "Search",  searchExpression = RouteParameter.Optional }
			);
		}

		protected void Application_Start()
		{
			RegisterRoutes(RouteTable.Routes);

			BundleTable.Bundles.RegisterTemplateBundles();
		}
	}
}