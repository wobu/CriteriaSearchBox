CriteriaSearchBox
=================

[Demo](http://criteriasearchbox.herokuapp.com/demo.html)


Description
----------

Inspired by the Google+ "combobox" when selecting the circles for sharing posts, i tried to create a search box which suggests criterias.
In example the criterias can be categories of a shop ore anything else.

The search box only displays the criterias which it gots from the "feeder" web service and shall POST the selected criterias to the related web service when searching.

The communication to the web service happens via JSON so it isn't currently possible to use a web service on a different domain.

Only modern Browsers are supported.


How to build distributable javascript files
-----

### Requirements
- Node.js


### Setting up the dependencies
```bash
npm install -g
```

### Build the files
```bash
grunt
```


Development
-----------

### Start web server
```bash
node server
```

this web server will server the static files and will provide a simple api webservice for testing.

### Developing a web service

A sample webservice can be found in the **server.js** file.

The webservice must handle 3 types of requests:

```bash
GET /
```

This request will be sent when nothing has been selected yet. This should return all root criterias.


```bash
GET /:searchExpression
```

This will be requested when the user enters a search expression and no criteria has been selected yet.  
**:searchExpression** will be the search expression.

```bash
POST /
```

This will be requested when criterias has been selected.

Following POST parameters exists:  
* **searchExpression**: The search expression  
* **selectedCriterias**: Array containing the JSON objects of all selected criterias.  


#### JSON object definition

```json
	{
		id: "category1",
		displayValue: "Category 1",
		type: 'category',
		parent: '',
		level: 0
	}
```

**id**: can be referenced in the **parent** property.  
**displayValue**: the value will be rendered in HTML  
**type**: the value will be used as CSS class  
**parent**: [OPTIONAL] when set the object is a child of the referenced object.  
**level**: this isn't used by the client itself, but it is easier for the webservice to find the next level of childs.  

*Note: the object can be extended with custom properties. The client posts the same JSON object back to the webservice.*

