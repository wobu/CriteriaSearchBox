using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleSearchWebService.Net.Models
{
	public class SearchRequest
	{
		public string SearchExpression
		{
			get;
			set;
		}

		public List<Criteria> SelectedCriterias
		{
			get;
			set;
		}
	}
}