(function ($) {

	var defaultSettings = {
		feederUrl: '',
		searchUrl: '',
		topLevelCategories: []
	},
	contants = {
		jQueryPluginName: 'criteriaSearchBox'
	};

	var CriteriaSearchBox = function (element, options) {
		this.element = $(element);
		var object = this;
		var settings = $.extend(defaultSettings, options || {});

		var init = function () {
			// TODO initialization
		};

		init();
	};

	$.fn.criteriaSearchBox = function (options) {
		return this.each(function () {
			var element = $(this);

			if (!element.data(contants.jQueryPluginName)) {
				element.data(contants.jQueryPluginName, new CriteriaSearchBox(this, options));
			}
		});
	};

})(jQuery);