(function ($) {

	var defaultSettings = {
		feederUrl: '',
		searchUrl: ''
	},
	constants = {
		jQueryPluginName: 'criteriaSearchBox',
		criteriaSearchBoxClassName: 'criteriaSearchBox',
		searchBoxContainerClassName: 'searchBoxContainer',
		actionSectionClassName: 'actionSection',
		selectedCriteriaSectionClassName: 'selectedCriteriaSection',
		inputSectionClassName: 'inputSection',
		dropDownContainerClassName: 'dropDownContainer',
		selectedClassName: 'selected'
	};

	var CriteriaSearchBox = function (element, options) {
		this.element = $(element);
		var object = this;
		var settings = $.extend(defaultSettings, options || {});

		var criteriaSearchBoxElement, searchBoxContainer, criteriaSection, inputSection, actionSection, searchButton, dropDownContainer,
			selectedCriterias = [], dropDownCriterias = [], selectedIndex = -1,
			dropDownCriteriasAreUpToDate = false;

		var init = function () {
			if (object.element.is('input[type=text]') || object.element.is('input[type=search]')) {


				criteriaSearchBoxElement = $('<div>').addClass(constants.criteriaSearchBoxClassName);
				searchBoxContainer = $('<div>').addClass(constants.searchBoxContainerClassName);
				selectedCriteriaSection = $('<span>').addClass(constants.selectedCriteriaSectionClassName);
				inputSection = $('<span>').addClass(constants.inputSectionClassName);
				actionSection = $('<span>').addClass(constants.actionSectionClassName);
				searchButton = $('<button type="submit">').html('Search'); // TODO
				dropDownContainer = $('<div>').addClass(constants.dropDownContainerClassName).css({ display: 'none' });

				object.element.wrap(criteriaSearchBoxElement);
				object.element.after(dropDownContainer);
				object.element.wrap(searchBoxContainer);
				object.element.before(actionSection);
				object.element.before(selectedCriteriaSection);
				object.element.wrap(inputSection);
				searchButton.appendTo(actionSection);

				// reload container element after DOM manipulation, i.e. for getting his width
				// TODO exists there a better solution? i am not satisfied with it.
				searchBoxContainer = $('div.' + constants.searchBoxContainerClassName);

				object.element.focus(onFocus);
				object.element.focusout(onFocusout);
				object.element.keyup(onKeyUp);

				criteriaSearchBoxElement.click(function (event) {
					event.preventDefault();
				});
			} else {
				console.error('CriteriaSearchBox must be called only on a text or search input element!');
			}
		};

		var onFocus = function () {
			dropDownContainer.width(searchBoxContainer.innerWidth());
			dropDownContainer.slideDown('fast');
			initializeCriteriaDropDownList();
		};

		var onFocusout = function () {
			// TODO focus out isn't the right moment to hide the drop down
			if (!dropDownContainer.is(':hover')) {
				dropDownContainer.hide();
			}
		};

		var onSearchChanged = function () {
			dropDownCriteriasAreUpToDate = false;
			initializeCriteriaDropDownList();
		};

		var onKeyUp = function (event) {
			switch (event.which) {
				case 13: // Enter button
					if (selectedIndex > -1) {
						dropDownCriterias[selectedIndex].click();
						event.preventDefault();
					}
					break;
				case 38: // Arrow up
					if (selectedIndex > -1) {
						updateSelectedDropDownItem(selectedIndex, --selectedIndex);
					}

					event.preventDefault();
					break;
				case 40: // Arrow down
					if ((selectedIndex + 1) < dropDownCriterias.length) {
						updateSelectedDropDownItem(selectedIndex, ++selectedIndex);
					}

					event.preventDefault();
					break;
				default:
					onSearchChanged();
					break;
			}
		};

		var initializeCriteriaDropDownList = function () {

			if (!dropDownCriteriasAreUpToDate) {
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
							dropDownCriterias[index] =
								new DropDownItem(
									dropDownContainer,
									value,
									index,
									function (dropDownItem) { dropDownItemClicked(dropDownItem); },
									function (dropDownItem) { updateSelectedDropDownItem(selectedIndex, dropDownItem.index); }); // TODO click
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

				dropDownCriteriasAreUpToDate = true;
			}
		};

		var resetCriteriaDropDownList = function () {
			selectedIndex = -1;
			dropDownCriterias = [];
			dropDownContainer.html('');
		};

		var updateSelectedDropDownItem = function (oldIndex, newIndex) {

			if (oldIndex !== -1) {
				dropDownCriterias[oldIndex].deselect();
			}

			if (newIndex !== -1) {
				dropDownCriterias[newIndex].select();
			}

			selectedIndex = newIndex;
		};

		var dropDownItemClicked = function (dropDownItem) {
			selectedCriterias.push(dropDownItem);

			// reset selection and index to avoid double clicks or endless loops with hitting enter
			updateSelectedDropDownItem(selectedIndex, -1);
			selectedIndex = -1;

			object.element.focus();
		};

		init();
	};

	var DropDownItem = function (container, data, index, onclick, onhover) {
		var object = this;
		this.container = container;
		this.data = data;
		this.index = index;

		var dropDownItem;

		var init = function () {
			dropDownItem = $('<div>').append($('<span>').html(data.displayValue));
			object.container.append(dropDownItem);

			dropDownItem.click(onClick);
			dropDownItem.hover(onHover);
		};

		var onClick = function () {
			onclick(object);
		};

		var onHover = function () {
			onhover(object);
		};

		this.select = function () {
			dropDownItem.addClass(constants.selectedClassName);
		};

		this.deselect = function () {
			dropDownItem.removeClass(constants.selectedClassName);
		};

		this.click = function () {
			dropDownItem.click();
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