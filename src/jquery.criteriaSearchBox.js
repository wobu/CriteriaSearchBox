(function ($) {

	var defaultSettings = {
		autoCompletionUrl: '',
		searchUrl: ''
	},
	constants = {
		jQueryPluginName: 'criteriaSearchBox',
		criteriaSearchBoxClassName: 'criteriaSearchBox',
		searchBoxContainerClassName: 'searchBoxContainer',
		actionSectionClassName: 'actionSection',
		selectedCriteriaContainerClassName: 'selectedCriteriaContainer',
		inputSectionClassName: 'inputSection',
		dropDownContainerClassName: 'dropDownContainer',
		selectedClassName: 'selected',
		removeIconClassName: 'icon-remove'
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
				selectedCriteriaContainer = $('<div>').addClass(constants.selectedCriteriaContainerClassName);
				inputSection = $('<span>').addClass(constants.inputSectionClassName);
				actionSection = $('<span>').addClass(constants.actionSectionClassName);
				searchButton = $('<button type="submit">').html('Search'); // TODO
				dropDownContainer = $('<div>').addClass(constants.dropDownContainerClassName).css({ display: 'none' });

				object.element.wrap(criteriaSearchBoxElement);
				object.element.before(selectedCriteriaContainer);
				object.element.after(dropDownContainer);
				object.element.wrap(searchBoxContainer);
				object.element.before(actionSection);
				object.element.wrap(inputSection);
				searchButton.appendTo(actionSection);

				// reload container element after DOM manipulation, i.e. for getting his width
				// TODO exists there a better solution? i am not satisfied with it.
				searchBoxContainer = $('div.' + constants.searchBoxContainerClassName);

				object.element.focus(onFocus);
				object.element.focusout(onFocusout);
				object.element.keyup(onKeyUp);

				searchButton.click(onSearch);

				criteriaSearchBoxElement.click(function (event) {
					event.preventDefault();
				});
			} else {
				console.error('CriteriaSearchBox must be called only on a text or search input element!');
			}
		};

		var onFocus = function () {
			initializeCriteriaDropDownList();

			if (!dropDownContainer.is(':visible')) {
				dropDownContainer.width(searchBoxContainer.innerWidth());
				dropDownContainer.slideDown('fast');
			}
		};

		var onFocusout = function () {
			if (!dropDownContainer.is(':hover')) {
				dropDownContainer.hide();
			}
		};

		var onSearchChanged = function () {
			dropDownCriteriasAreUpToDate = false;
			initializeCriteriaDropDownList();
		};

		var onSearch = function () {
			$.ajax({
				url: settings.searchUrl,
				dataType: 'json',
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({ searchExpression: object.element.val(), selectedCriterias: selectedCriterias })
			});
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
						url: settings.autoCompletionUrl,
						dataType: 'json',
						type: "GET",
						contentType: "application/json",
						data: { searchExpression: searchExpression }
					}).done(function (data) {
						$.each(data, function (index, value) {
							dropDownCriterias[index] =
								new DropDownItem(
									dropDownContainer,
									value,
									index,
									function (dropDownItem) { dropDownItemClicked(dropDownItem); },
									function (dropDownItem) { updateSelectedDropDownItem(selectedIndex, dropDownItem.index); });
						});
					});
				} else {
					// get array containing all data of the selected criteria items
					var selectedData = []

					$.each(selectedCriterias, function (index, criteriaItem) {
						selectedData.push(criteriaItem.data);
					});

					$.ajax({
						url: settings.autoCompletionUrl,
						dataType: 'json',
						type: "POST",
						contentType: "application/json",
						data: JSON.stringify({ searchExpression: searchExpression, selectedCriterias: selectedData })
					}).done(function (data) {
						$.each(data, function (index, value) {
							dropDownCriterias[index] =
								new DropDownItem(
									dropDownContainer,
									value,
									index,
									function (dropDownItem) { dropDownItemClicked(dropDownItem); },
									function (dropDownItem) { updateSelectedDropDownItem(selectedIndex, dropDownItem.index); });
						});
					});
				}

				dropDownCriteriasAreUpToDate = true;
			}
		};

		var resetCriteriaDropDownList = function () {
			selectedIndex = -1;

			// ensure destroying of all object, cause we don't need them anymore
			for (var item in dropDownCriterias) {
				delete item;
			}

			dropDownCriterias = [];
			dropDownContainer.empty();
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
			var selectedCriteriaItem = new SelectedCriteriaItem(
											selectedCriteriaContainer,
											dropDownItem.data,
											function (selectedCriteriaItem) { selectedCriteriaItemClicked(selectedCriteriaItem); });
			selectedCriterias.push(selectedCriteriaItem);

			// reset selection and index to avoid double clicks or endless loops with hitting enter
			updateSelectedDropDownItem(selectedIndex, -1);
			selectedIndex = -1;

			dropDownCriteriasAreUpToDate = false;

			object.element.val('');
			object.element.focus();
		};

		var selectedCriteriaItemClicked = function (selectedCriteriaItem) {
			// get all childs and remove them too
			var itemsToRemove = [selectedCriteriaItem];
			var lastChildItem = selectedCriteriaItem;

			$.each(selectedCriterias, function (index, item) {
				if (item.data.parent === lastChildItem.data.id) {
					itemsToRemove.push(item);
					lastChildItem = item;
				}
			});

			$.each(itemsToRemove, function (index, item) {
				var index = $.inArray(item, selectedCriterias);
				selectedCriterias.splice(index, 1);
				item.remove();
			});

			object.element.focus();
			onSearchChanged();
		};

		init();
	};

	var SelectedCriteriaItem = function (container, data, onclick) {
		var object = this;
		this.container = container;
		this.data = data;
		this.element;

		var init = function () {
			var removeIconElement = $('<i>').addClass(constants.removeIconClassName);

			object.element = $('<a>').addClass(object.data.type);
			object.element.append(removeIconElement);
			object.element.append(object.data.displayValue);

			object.container.append(object.element);

			object.element.click(onClick);
		};

		var onClick = function () {
			onclick(object);
		};

		this.remove = function () {
			object.element.remove();
			delete object;
		}

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