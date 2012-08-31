CriteriaSearchBox
=================

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