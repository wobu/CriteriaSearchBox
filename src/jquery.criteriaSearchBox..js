(function ($) {

	var defaultSettings = {
		feederUrl: '',
		searchUrl: '',
		categories: []
	},
	constants = {
		jQueryPluginName: 'criteriaSearchBox',
		searchBoxContainerClassName: 'criteriaSearchBoxContainer',
		actionSectionClassName: 'actionSection',
		criteriaSectionClassName: 'criteriaSection',
		inputSectionClassName: 'inputSection',
		dropDownContainerClassName: 'dropDownContainer'
	};

	var CriteriaSearchBox = function (element, options) {
		this.element = $(element);
		var object = this;
		var settings = $.extend(defaultSettings, options || {});

		var container, criteriaSection, inputSection, actionSection, searchButton, dropDownContainer;

		var init = function() {
			if (object.element.is('input')) {
				// TODO validate for input element

				container = $('<div>').addClass(constants.searchBoxContainerClassName);
				criteriaSection = $('<span>').addClass(constants.criteriaSectionClassName);
				inputSection = $('<span>').addClass(constants.inputSectionClassName);
				actionSection = $('<span>').addClass(constants.actionSectionClassName);
				searchButton = $('<button type="submit">').html('Search'); // TODO
				dropDownContainer = $('<div>').addClass(constants.dropDownContainerClassName).css({display: 'none'});

				// TODO initialization
				object.element.after(dropDownContainer);
				object.element.wrap(container);
				object.element.before(actionSection);
				object.element.before(criteriaSection);
				object.element.wrap(inputSection);
				searchButton.appendTo(actionSection);

				object.element.focus(onFocus);
				object.element.focusout(onFocusout);
			}
		};

		var onFocus = function() {
			// TODO initialied drop down
			dropDownContainer.show();
		};

		var onFocusout = function() {
			// TODO initialied drop down
			dropDownContainer.hide();
		};

		init();
	};

	$.fn.criteriaSearchBox = function (options) {
		return this.each(function () {
			var element = $(this);

			if (!element.data(constants.jQueryPluginName)) {
				element.data(constants.jQueryPluginName, new CriteriaSearchBox(this, options));
			}
		});
	};

})(jQuery);