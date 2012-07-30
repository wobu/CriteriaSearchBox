(function ($) {

	var defaultSettings = {
		feederUrl: '',
		searchUrl: '',
		criterias: []
	},
	constants = {
		jQueryPluginName: 'criteriaSearchBox',
		searchBoxContainerClassName: 'criteriaSearchBoxContainer',
		actionSectionClassName: 'actionSection',
		selectedCriteriaSectionClassName: 'selectedCriteriaSection',
		inputSectionClassName: 'inputSection',
		criteriaDropDownContainerClassName: 'criteriaDropDownContainer'
	};

	var CriteriaSearchBox = function (element, options) {
		this.element = $(element);
		var object = this;
		var settings = $.extend(defaultSettings, options || {});

		var container, criteriaSection, inputSection, actionSection, searchButton, criteriaDropDownContainer,
			selectedCriterias = [];

		var init = function () {
			if (object.element.is('input')) {
				// TODO validate for input element

				container = $('<div>').addClass(constants.searchBoxContainerClassName);
				selectedCriteriaSection = $('<span>').addClass(constants.selectedCriteriaSectionClassName);
				inputSection = $('<span>').addClass(constants.inputSectionClassName);
				actionSection = $('<span>').addClass(constants.actionSectionClassName);
				searchButton = $('<button type="submit">').html('Search'); // TODO
				criteriaDropDownContainer = $('<div>').addClass(constants.criteriaDropDownContainerClassName).css({ display: 'none' });

				// TODO initialization
				object.element.after(criteriaDropDownContainer);
				object.element.wrap(container);
				object.element.before(actionSection);
				object.element.before(selectedCriteriaSection);
				object.element.wrap(inputSection);
				searchButton.appendTo(actionSection);

				object.element.focus(onFocus);
				object.element.focusout(onFocusout);
				object.element.keyup(onSearchChanged);
			}
		};

		var onFocus = function () {
			// TODO initialied drop down
			criteriaDropDownContainer.show();
			initializeCriteriaDropDownList();
		};

		var onFocusout = function () {
			// TODO initialied drop down
			criteriaDropDownContainer.hide();
		};

		var onSearchChanged = function () {
			// TODO initialied drop down
			initializeCriteriaDropDownList();
		};

		var initializeCriteriaDropDownList = function () {
			resetCriteriaDropDownList();

			var searchExpression = object.element.val();

			if (selectedCriterias.length === 0) {
				$.ajax({
					url: settings.feederUrl,
					dataType: 'json',
					type: "GET",
					data: { searchExpression: searchExpression }
				}).done(function (data) {
					$.each(data, function (index, value) {
						var item = $('<div>').html(value.displayValue);

						criteriaDropDownContainer.append(item)
					});
				});
			} else {
				// TODO
				$.ajax({
					url: settings.feederUrl,
					dataType: 'json',
					type: "POST",
					data: JSON.stringify({ searchExpression: searchExpression, selectedCriterias: selectedCriterias }),
					success: function (data) {
						$(data, function (index, value) {
						});
					}
				});
			}
		};

		var resetCriteriaDropDownList = function () {
			// simple reset the container
			criteriaDropDownContainer.html('');
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