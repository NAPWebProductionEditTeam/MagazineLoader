* NAP HTML magazine

This project will allow you you to run the Net-a-porter magazine locally, [[mirroring the online version][http://www.net-a-porter.com/magazine]] giving you a style guide and a demo the different interactions and rich media supported. Using an express server it will accurately mock up live NAP server calls for:
- AJAX content: 
	- /${channel}/magazineContent.nap
- Product API calls: 
	- /webapi/feed/magazinecaption
	- /webapi/feed/searchableproduct
	- /${channel}/api/feed/searchableproduct/status/
- Alfresco assets
	- Images
	- CSS
	- JS

Using this setup will mean you don't need to create a local server or a proxy to simulate the live magazine. Some of these utilties can easily be replaced by some open source systems like [[GruntJS] [http://gruntjs.com/]] but this was an expirement to try out some Node functionality.

** Application requirements

Before you start setting up the application you need to make sure you have the following installed:
- [[Git][http://git-scm.com/]
- [[NodeJS][http://nodejs.org/]

*** NPM dependencies

When you [install the application](#install) there is a NPM package that will install the following dependencies:
- [[watchr][https://npmjs.org/package/fs-watcher]
- [[Uglify-js][https://npmjs.org/package/uglify-js]
- [[Nopt][https://npmjs.org/package/nopt]

* <a id="install"></a>Install

First check out the following repo:

```
   git@gitosis.net-a-porter.com:/html_magazine
```

Inside the directory now run the command:

#+BEGIN_SRC sh
./mag.sh -i
#+END_SRC

This command will set up the project doing the following:
- Install all node dependencies
- Compile checked in SASS projects
- Uglify JavaScript
- Create Symlinks for NAP magazine server
- Offer to start to start the server

* Usage

You can call utility functions from the command line using the following:

#+BEGIN_SRC sh
./mag.sh [ options... ] [ parameter ]
#+END_SRC

=parameter= is only available on certain options.

Supported options:

- =-c= or =--compile= --- Loads the compile menu, you also can passing in one of the following parameters:
	- =js= --- Uglify the JS
	- =sass= --- Uglify the JS
- =-h= or =--help= --- Loads the help menu
- =-i= or =--install= --- Sets up the application
- =-l= or =--logs= --- Loads the logs menu, you also can passing in one of the following parameters:
	- =r= or =--read= --- Prints the logs in terminal
	- =c= or =--clear= --- Clear the logs
- =-s= or =--server= --- Starts an express server on port 3000
- =-u= or =--utilities= --- Loads the utilities menu
- =-v= or =--version= --- Prints the version number of the build tool
- =-w= or =--watch= --- Loads the watch menu, you also can passing in one of the following parameters:
	- =js= --- Watch JS files for changes via watchr and pass changed file to uglify
	- =sass= --- Watch SASS files for changes via compass watch
