using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SampleSearchWebService.Net.Models;

namespace SampleSearchWebService.Net.Controllers
{
    public class SearchController : ApiController
    {
		public HttpResponseMessage Get()
		{
			HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
			response.CreateContent<string>("search without any data received.");

			return response;
		}

		public HttpResponseMessage Get(string searchExpression)
		{
			HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
			response.CreateContent<string>(String.Format("search with search expression '{0}' received.", searchExpression));

			return response;
		}

		public HttpResponseMessage Post(SearchRequest searchRequest)
		{	
			HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
			response.CreateContent<string>(
				String.Format(
					"search with search expression '{0}' and criterias '{1}' received.", 
					searchRequest.SearchExpression, 
					searchRequest.SelectedCriterias.Count)
				);

			return response;
		}
    }
}
