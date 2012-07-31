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
			selectedCriterias = [],
			currentCriteriasAreUpToDate = false;

		var init = function () {
			if (object.element.is('input[type=text]') || object.element.is('input[type=search]')) {

				container = $('<div>').addClass(constants.searchBoxContainerClassName);
				selectedCriteriaSection = $('<span>').addClass(constants.selectedCriteriaSectionClassName);
				inputSection = $('<span>').addClass(constants.inputSectionClassName);
				actionSection = $('<span>').addClass(constants.actionSectionClassName);
				searchButton = $('<button type="submit">').html('Search'); // TODO
				criteriaDropDownContainer = $('<div>').addClass(constants.criteriaDropDownContainerClassName).css({ display: 'none' });

				object.element.after(criteriaDropDownContainer);
				object.element.wrap(container);
				object.element.before(actionSection);
				object.element.before(selectedCriteriaSection);
				object.element.wrap(inputSection);
				searchButton.appendTo(actionSection);

				// reload container element after DOM manipulation, i.e. for getting his width
				// TODO exists there a better solution? i am not satisfied with it.
				container = $('div.' + constants.searchBoxContainerClassName);

				object.element.focus(onFocus);
				object.element.focusout(onFocusout);
				object.element.keyup(onSearchChanged);
			} else {
				console.error('CriteriaSearchBox must be called only on a text or search input element!');
			}
		};

		var onFocus = function () {
			criteriaDropDownContainer.width(container.innerWidth());
			criteriaDropDownContainer.slideDown('fast');
			initializeCriteriaDropDownList();
		};

		var onFocusout = function () {
			criteriaDropDownContainer.hide();
		};

		var onSearchChanged = function () {
			currentCriteriasAreUpToDate = false;
			initializeCriteriaDropDownList();
		};

		var initializeCriteriaDropDownList = function () {

			if (!currentCriteriasAreUpToDate) {
				// TODO avoid flickering when refreshing the content
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
					//					$.ajax({
					//						url: settings.feederUrl,
					//						dataType: 'json',
					//						type: "POST",
					//						data: JSON.stringify({ searchExpression: searchExpression, selectedCriterias: selectedCriterias }),
					//						success: function (data) {
					//							$(data, function (index, value) {
					//							});
					//						}
					//					});
				}

				currentCriteriasAreUpToDate = true;
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