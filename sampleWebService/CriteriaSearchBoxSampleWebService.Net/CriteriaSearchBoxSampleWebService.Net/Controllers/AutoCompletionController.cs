using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using SampleSearchWebService.Net.Models;

namespace SampleSearchWebService.Net.Controllers
{
    public class AutoCompletionController : ApiController
    {
		public List<Criteria> SampleData
		{
			get;
			set;
		}

		public AutoCompletionController()
		{
			SampleData = new List<Criteria>();

			SampleData.Add(new Criteria { id = "category1", displayValue = "Category 1 (HasChilds)", parent = "", type = "category", level = 0 } );
			SampleData.Add(new Criteria { id = "category2", displayValue = "Category 2 (HasNoChilds)", parent = "", type = "category", level = 0 });
			SampleData.Add(new Criteria { id = "category1.1", displayValue = "Category 1.1 (HasChilds)", parent = "category1", type = "category", level = 1 });
			SampleData.Add(new Criteria { id = "category1.1.1", displayValue = "Category 1.1.1", parent = "category1.1", type = "category", level = 2 });
			SampleData.Add(new Criteria { id = "category1.1.2", displayValue = "Category 1.1.2", parent = "category1.1", type = "category", level = 2 });
			SampleData.Add(new Criteria { id = "item1.1.3", displayValue = "Item 1.1.3", parent = "category1.1", type = "", level = 2 });
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

		public IList<Criteria> Post(SearchRequest searchRequest)
		{
			var searchExpression = searchRequest.SearchExpression ?? String.Empty;

			var maxLevel = searchRequest.SelectedCriterias.Max(_criteria => _criteria.level);
			var categoryWithLowestLevel = searchRequest.SelectedCriterias.Where(_criteria => _criteria.level == maxLevel).FirstOrDefault();

			return SampleData.Where(
				_criteria => _criteria.parent.Equals(categoryWithLowestLevel.id)
				&& _criteria.displayValue.ToLower().Contains(searchExpression.ToLower())).ToList();
		}
    }
}
