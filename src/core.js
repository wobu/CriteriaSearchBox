var defaultSettings = {
	autoCompletionUrl: '',
	selectedCriteriaLinkClasses: '',
	selectedCriteriaContentToPrepend: ''
},
constants = {
	jQueryPluginName: 'criteriaSearchBox',
	selectedCriteriaContainerClassName: 'selectedCriteriaContainer',
	dropDownClassName: 'criteriaSearchBoxDropDown'
};

var CriteriaSearchBox = function ($element, options) {
	this.$element = $($element);
	var object = this;
	var settings = $.extend(defaultSettings, options || {});

	var $selectedCriteriaContainer, $inputElement, $searchButton, $dropDown, $formElement,
		selectedCriterias = [], $dropDownCriterias = [], selectedIndex = -1,
		dropDownCriteriasAreUpToDate = false;

	var init = function () {
		
		$selectedCriteriaContainer = $('.' + constants.selectedCriteriaContainerClassName, object.$element);
		$dropDown = $('.' + constants.dropDownClassName, object.$element);
		$inputElement = $('input[type=text], input[type=search]', object.$element);
		$searchButton = $('button[type=submit], input[type=submit]', object.$element);
		$formElement = $('form', object.$element);
		
		if (isValid()) {
			if ($inputElement.is(':focus')) {
				initializeCriteriaDropDownList();
			}
			
			$inputElement.focus(onFocus);
			$inputElement.click(onGlobalClick);
			$inputElement.keydown(onKeyDown);
			$inputElement.keyup(onKeyUp);
			
			$searchButton.click(onSearch);			
		}
	};
		
	var isValid = function() {	
		if ($selectedCriteriaContainer.length !== 1) {
			throw 'No container for the selected criterias has been defined.';
		} 
		
		if ($dropDown.length !== 1) {
			throw 'No dropdown has been defined.';
		} 
		
		if ($inputElement.length !== 1) {
			throw 'No input $element has been defined.';
		} 
		
		if ($searchButton.length !== 1) {
			throw 'No submit button has been defined.';
		} 
		
		if ($formElement.length  !== 1) {
			throw 'No form $element has been defined.';
		}
		
		if ($formElement.attr('method') !== 'post') {
			throw 'Form $element\'s method must be POST';
		}
		
		return true;
	};

	var onFocus = function () {
		selectedIndex = -1;
	};

	var onGlobalClick = function (event) {	
		var $sourceElement;
		
		if ($inputElement[0] === event.target) {
			initializeCriteriaDropDownList();
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		
		// hide only the drop down if we clicked outside of our search box container
		if (object.$element.closest(event.target).length === 1) {
			$dropDown.hide();
		}
	};

	var onSearchChanged = function () {
		dropDownCriteriasAreUpToDate = false;
		initializeCriteriaDropDownList();
	};
	
	var onSearch = function () {
		// TODO create hidden input fields
		$formElement.submit();
	};
	
	var onKeyDown = function (event) {
		$inputElement.data('lastValue', $inputElement.val());
	};
	
	var onKeyUp = function (event) {
		if ($inputElement.data('lastValue') !== $inputElement.val()) {
			onSearchChanged();
		}
	};

	var onGlobalKeyDown = function (event) {
		if (!/(38|40)/.test(event.keyCode)) {
			return;
		}
		
		event.preventDefault();
		event.stopPropagation();
		
		if (event.keyCode === 38 && selectedIndex > -1) { //up
			updateDropDownItemFocus(--selectedIndex);
		} else if (event.keyCode === 40 && selectedIndex < $dropDownCriterias.length - 1) { //down
			updateDropDownItemFocus(++selectedIndex);	
		}
	};

	var initializeCriteriaDropDownList = function () {
					
		if (!dropDownCriteriasAreUpToDate) {
			// TODO avoid flickering when refreshing the content
			resetCriteriaDropDownList();

			var searchExpression = $inputElement.val();

			if (selectedCriterias.length === 0) {
				$.ajax({
					url: settings.autoCompletionUrl + '/' + searchExpression, //TODO
					async: false,
					dataType: 'json',
					type: "GET"
				}).done(function (data) {
					$.each(data, function (index, value) {
						$dropDownCriterias[index] =
							new DropDownItem(
								$dropDown,
								value,
								index,
								function (dropDownItem) { dropDownItemClicked(dropDownItem); },
								function (dropDownItem) { updateDropDownItemFocus(dropDownItem.index); });
					});
				});
			} else {
				// get array containing all data of the selected criteria items
				var selectedData = [];

				$.each(selectedCriterias, function (index, criteriaItem) {
					selectedData.push(criteriaItem.data);
				});

				$.ajax({
					url: settings.autoCompletionUrl,
					async: false,
					dataType: 'json',
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify({ searchExpression: searchExpression, selectedCriterias: selectedData })
				}).done(function (data) {
					$.each(data, function (index, value) {
						$dropDownCriterias[index] =
							new DropDownItem(
								$dropDown,
								value,
								index,
								function (dropDownItem) { dropDownItemClicked(dropDownItem); },
								function (dropDownItem) { updateDropDownItemFocus(dropDownItem.index); });
					});
				});
			}

			dropDownCriteriasAreUpToDate = true;
		}
		
		if ($dropDownCriterias.length === 0) {
			$dropDown.hide();
			$(object.$element).off('keydown.criteriaSearchBox');
			$('body').off('click.criteriaSearchBox');
		} else if (!$dropDown.is(':visible')) {
			$dropDown.slideDown('fast');
			$(object.$element).on('keydown.criteriaSearchBox', onGlobalKeyDown);
			$('body').on('click.criteriaSearchBox', onGlobalClick);
		}
	};

	var resetCriteriaDropDownList = function () {
		$dropDownCriterias = [];
		$dropDown.empty();
		selectedIndex = -1;
	};

	var updateDropDownItemFocus = function (newIndex) {

		if (newIndex !== -1) {
			$dropDownCriterias[newIndex].focus();
		} else if (!$inputElement.is(':focus')) {
			$inputElement.focus();
		}
		
		selectedIndex = newIndex;
	};

	var dropDownItemClicked = function (dropDownItem) {
		var selectedCriteriaItem = new SelectedCriteriaItem(
										$selectedCriteriaContainer,
										dropDownItem.data,
										function (selectedCriteriaItem) { selectedCriteriaItemClicked(selectedCriteriaItem); },
										settings);
		selectedCriterias.push(selectedCriteriaItem);

		$inputElement.val('');		
		onSearchChanged();
		$inputElement.focus();
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
			selectedCriterias.splice($.inArray(item, selectedCriterias), 1);
			item.remove();
		});

		onSearchChanged();
	};

	init();
};

var SelectedCriteriaItem = function (container, data, onclick, settings) {
	var object = this;
	this.$container = container;
	this.data = data;
	this.$element = null;
	
	var init = function () {
		object.$element = $('<a>').addClass(settings.selectedCriteriaLinkClasses + ' ' + object.data.type);
		object.$element.append(settings.selectedCriteriaContentToPrepend);
		object.$element.append(object.data.displayValue);

		object.$container.append(object.$element);

		object.$element.click(onClick);
	};

	var onClick = function () {
		onclick(object);
	};

	this.remove = function () {
		object.$element.remove();
	};

	init();
};

var DropDownItem = function (container, data, index, onclick, onhover) {
	var object = this;
	this.$container = container;
	this.data = data;
	this.index = index;
	this.$element = null;

	var init = function () {
		object.$element = $('<a href=\"#\">').html(data.displayValue);
		object.$container.append($('<li>').append(object.$element));

		object.$element.click(onClick);
		object.$element.hover(onHover);
	};

	var onClick = function (event) {
		onclick(object);
	};

	var onHover = function () {
		onhover(object);
	};

	this.focus = function () {
		object.$element.focus();
	};

	init();
};