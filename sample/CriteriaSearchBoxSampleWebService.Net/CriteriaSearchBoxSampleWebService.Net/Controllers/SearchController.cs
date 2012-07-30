using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using SampleSearchWebService.Net.Models;

namespace SampleSearchWebService.Net.Controllers
{
    public class SearchController : ApiController
    {
		public List<Criteria> SampleData
		{
			get;
			set;
		}

		public SearchController()
		{
			SampleData = new List<Criteria>();

			SampleData.Add(new Criteria { id = "category1", displayValue = "Category 1", parent = "", type = "category"} );
			SampleData.Add(new Criteria { id = "category2", displayValue = "Category 2", parent = "", type = "category"} );
			SampleData.Add(new Criteria { id = "category1.1", displayValue = "Category 1.1", parent = "category1", type = "category"} );
		}

		public IList<Criteria> Get()
		{
			return SampleData.Where(
				_criteria => String.IsNullOrEmpty(_criteria.parent)).ToList();
		}

		public IList<Criteria> Get(string searchExpression)
        {
			searchExpression = searchExpression ?? String.Empty;

			return SampleData.Where(
				_criteria => String.IsNullOrEmpty(_criteria.parent) 
							&& _criteria.displayValue.ToLower().Contains(searchExpression.ToLower())).ToList();
        }

		public IList<Criteria> Post(string searchExpression)
		{
			searchExpression = searchExpression ?? String.Empty;

			return SampleData.Where(
				_criteria => String.IsNullOrEmpty(_criteria.parent)
							&& _criteria.displayValue.ToLower().Contains(searchExpression.ToLower())).ToList();
		}

		public IList<Criteria> Post(string searchExpression, IQueryable<Criteria> selectedCriterias)
		{
			searchExpression = searchExpression ?? String.Empty;

			IList<Criteria> retVal = new List<Criteria>();

			// TODO

            return retVal;
		}
    }
}
