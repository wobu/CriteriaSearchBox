using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleSearchWebService.Net.Models
{
	public class Criteria
	{
		public string id { get; set; }
		public string displayValue { get; set; }
		public string type { get; set; }
		public string parent { get; set; }
	}
}