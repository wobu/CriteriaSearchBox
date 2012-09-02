var express = require('express');
var coll = require('coll');

var app = express();

var port = process.env.PORT || 3000;

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var allCriterias = [
	{
		id: "category1",
		displayValue: "Category 1",
		type: 'category',
		parent: '',
		level: 0
	},
	{
		id: "category2",
		displayValue: "Category 2",
		type: 'category',
		parent: '',
		level: 0
	},
	{
		id: "category1.1",
		displayValue: "Category 1.1",
		type: 'category',
		parent: 'category1',
		level: 1
	},
	{
		id: "category1.1.1",
		displayValue: "Category 1.1.1",
		type: 'category',
		parent: 'category1.1',
		level: 2
	},
	{
		id: "category1.1.2",
		displayValue: "Category 1.1.2",
		type: 'category',
		parent: 'category1.1',
		level: 2
	},
	{
		id: "item1.1.3",
		displayValue: "Item 1.1.3",
		type: '',
		parent: 'category1.1',
		level: 2
	}
];


app.get('/api', function (req, res) {
	var allCriteriaList = coll.List(allCriterias);

	var result = allCriteriaList.findAll(function (item, index, list) {
		return item.level == 0;
	}).toArray();

	res.send(result);
});

app.get('/api/:searchExpression', function (req, res) {
	var allCriteriaList = coll.List(allCriterias);

	var result = allCriteriaList.findAll(function (item, index, list) {
		return item.displayValue.toLowerCase().indexOf(req.params.searchExpression.toLowerCase()) !== -1 && item.level == 0;
	}).toArray();

	res.send(result);
});

app.post('/api', function (req, res) {

	var searchExpression = req.body.searchExpression || '',
		selectedCriterias = req.body.selectedCriterias;

	var selectedCriteriasList = coll.List(selectedCriterias);
	var selectedCategoryWithLowestLevel = selectedCriteriasList.max('level');

	var allCriteriaList = coll.List(allCriterias);

	var result = allCriteriaList.findAll(function (item, index, list) {
		return item.displayValue.toLowerCase().indexOf(searchExpression.toLowerCase()) !== -1
				&& item.parent == selectedCategoryWithLowestLevel.id;
	}).toArray();

	res.send(result);
});

app.listen(port);
