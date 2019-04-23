# WeGotTickets Scraper

## Coding challenge requirements

### Brief

The WeGotTickets UK homepage is at https://www.wegottickets.com/. Write software that scrapes concert information from the pages on this site and outputs the data in a machine readable format of your choice (e.g. JSON, XML, CSV etc.).

The first page of the 'browse all listings' section of the site is at https://www.wegottickets.com/searchresults/all

Each event also has its own page, which is linked to from the event titles. Your script should attempt to identify:
* the artists playing
* the city
* the name of the venue
* the date
* the price

We are only interested in musical events, but don’t worry if your script outputs data for other kinds of events (comedy etc.) If they appear in your script’s output you can assume that they will be safely ignored

### What I completed

* Fetch all event links shown on an event list page
* For all links, scrape and format the desired data
* Store all data for an event list page in a CSV file and indicate success or failure

### What I ran out of time to complete

* Scraping all event list pages - it currently scrapes the first event list page only.

### How I would implement the remaining tasks and improve my code, given more time

* Implementing the remaining tasks:
  * Looping through all event list pages - to work out whether there is a next event list page to scrape data from, when inspecting the current event list page (i.e. the first page), I would check whether a `.pagination_link_text nextlink` class exists, and if so, retrieve the URL in the `href` element inside of this class to then fetch the HTML document for this URL (in this case, the HTML would represent the second event list page; page 2). This event list page would be scraped using my existing code in `index.js`. This process would be looped until a next page is not found.

* How I'd improve my code, given more time:
  * write integration tests for scraping and saving multiple events
  * mock third-party libraries such as `cheerio` to speed up tests.

## Technologies used

* Language - JavaScript (Node.js).
* Tools - Axios, Csv-writer
* Testing tools - Mocha, Chai, Nock

### Why I chose these tools

* Nock can mock API calls. This can speed up tests and preventing breaking tests when the real data changes
* Cheerio has a similar API to jQuery and allows easier traversing of an HTML document for scraping the data
* Mocha can be used with async/await and assertion libraries (in this case Chai) to allow choice of testing syntax 
* Axios can be used with async/await out of the box
* Csv-writer - automatically accounts for commas within an individual CSV column that otherwise would break the intended formatting. It also automatically encodes non ASCII characters (e.g. "é").

## Development Process

### Why I structured my code this way

* To ensure each file had a single responsibility, I separated the main tasks of scraping and saving the event details into four steps and files respectively:
    * Fetching the HTML - `fetch.js`
    * Finding (i.e. traversing) the data inside the HTML - `find.js`
    * Formatting the found data (e.g. separating city and venue information and handling when the data found is formatted differently) - `format.js`
    * Storing the data in a file - `store.js`

* Originally the files were given names such as `fetch-event-details.js` and `format-event-details.js`. I moved them into an `event-details` directory and shortened the file names for simplicity and avoiding duplication

* As most of the functionality is around transforming, fetching and traversing data, rather than also keeping track of state changes, I opted for simple, reusable functions over object-oriented programming

* Storing as CSV allows for easier and more performant appending, as appending JSON would require parsing the existing file contents each time a new event is stored. This may struggle or fail at scale as the file may become very large and require a large amount of memory.

* Fetching and store events one at a time, instead of in batches - allows filtering of music events before finding & formatting details. Also allows for adding more accurate loading progress in future (e.g. adding a loading bar)

### How I approached development

* The majority of the time, I used TDD (with the exception of not adding integration tests to test fetching, finding, formatting and storing in one go).

* In my `/src` files, I ran my code with differently formatted result data to handle differing formats (see `/event-details/format.js` for formatting handlers)

* I used Git with feature branching and pull requests to a private repo to review code for a second time (after reviewing first locally) to lower the likelihood of merging mistakes

### Struggles

* I spent too long trying to get ES6 imports to work with Node.js, and should have realised sooner that in a more removed way that this was unimportant (before quickly moving on to more important things).

* Commit with message "Store music events only, as CSV, one at a time". Made many changes in one pull request, reducing the speed and efficiency of delivery these features, as opposed to adding them individually.

## Installing the project

1) Install Node.js and NPM (Node Package Manager):

* Install Node.js version 8.2.1 or greater (as this is needed to use `async/await` functionality). As you'll need to also install NPM to install other dependencies, I recommend installing NVM (Node Version Manager) first and using it to install a specific version of NPM and Node.js together. You can find the NVM installation instructions here - https://github.com/creationix/nvm#installation. Here are some useful tutorials in case additional support is needed:
    * https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/
    * https://www.keycdn.com/blog/node-version-manager/

2) Install Yarn (without Node.js) - https://yarnpkg.com/lang/en/docs/install/#mac-stable (instructions for installing with Homebrew). N.B. use the `$ brew install yarn --without-node` option

3) Unzip the project folder and change directory into it

4) Install the project's dependencies using NPM (defined in the `package.json` file) by running `$ yarn` or `$ yarn install` in the root directory

## Running tests

* In the root directory, run `$ yarn test`.

## Running the project

* In the root directory, run `$ yarn start`

* What to expect - the `index.js` file will be run. It should write the events to the CSV file `src/events-output.csv`, and display either a success or failure in the console. You can then open this file to check the data that has been scraped.