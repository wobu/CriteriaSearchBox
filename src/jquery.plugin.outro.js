$.fn.criteriaSearchBox = function (options) {
	return this.each(function () {
		var element = $(this);

		if (!element.data(constants.jQueryPluginName)) {
			element.data(constants.jQueryPluginName, new CriteriaSearchBox(this, options));
		}
	});
};

}(jQuery));
