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
* For all links, scrape and format the wanted data
* Save all data for an event list page to a file (display success or failure message)

N.B. Known issue - when saving characters from other languages to the output file, the wrong encoding type is used - e.g. `Gellért` becomes `Gell�rt`. Due to time constraits, I was unable to fix this in time.

### What I ran out of time to complete

* Only scraping data for music events (currently it scrapes data for all types of event)
* Looping through the total number of event list pages and saving all resulting data to an output file

### How I would implement the remaining tasks and improve my code, given more time

* Implementing the remaining tasks:
    * Filtering the event pages by music events only
        * In the HTML of an event page, would check inside the `<script type="application/ld+json"></script>` tag - if it's a music event, the `@type` property at the root level will have a value of `MusicEvent`. I would add this check just before grabbing the data (price, venue, etc.). If the event has this type, scrape the data, otherwise return (so that event is skipped over);
    * (N.B. a less performent way, but done to test that it first works to improve upon it later:) Scraping event details for the total number of event list pages - I would create an array in memory for all of the event details. Then I would fetch the event links, scrape all of the event details, add them to the array, check if there is a next page and if so, repeat the previous steps (fetch the new event links, scrape the data and add them to an array). In the loop, when there is no next page, I would then 
    save the event details to the output file.
    * (A more performent way than the above:) I would try writing only the event details from a single event list to the output file as an array, then fetch the next event details and try to append this file with the new data - possibly trying to use `fs.write()` to prepend the closing array bracket with additional JSON objects.
    * Looping through all event list pages - to work out whether there is a next event list page to scrape data from, when inspecting the current event list page (i.e. the first page), I would check whether a `.pagination_link_text nextlink` class exists, and if so, retrieve the URL in the `href` element inside of this class to then fetch the HTML document for this URL (in this case, the HTML would represent the second event list page; page 2). This would be performed in a loop until no new page is found, at which point all of the event details would be saved to the output file.
* Improving my code
    * Would write tests for `fetchEvents` and `index.js` functions with mock API calls.
    * Fix formatting of characters from other languages when being saved to file - e.g. `Gellért` becomes `Gell�rt`.
    * Attempting to find a solution for mocking cheerio library to speed up tests.

## Technologies used

* Node.js, Axios
* Testing tools - Mocha, Chai, Nock

### Why I chose these tools

* Nock can mock API calls. This can speed up tests and preventing breaking tests when the real data changes
* Cheerio has a similar API to jQuery and allows easier traversing of an HTML document for scraping the data
* Mocha can be used with async/await and assertion libraries (in this case Chai) to allow choice of testing syntax 
* Axios can be used with async/await out of the box

## Development Process

### Why I structured my code this way

* To ensure each file had a single responsibility, I separated the main tasks of scraping and saving the event details into four steps and files respectively:
    * Fetching the HTML - `fetch.js`
    * Finding (i.e. traversing) the data inside the HTML - `find.js`
    * Formatting the found data (e.g. separating city and venue information and handling when the data found is formatted differently) - `format.js`
    * Saving the data to a file - `save.js`

* Originally the files were given names such as `fetch-event-details.js` and `format-event-details.js`. I moved them into an `event-details` directory and shortened the file names for simplicity and avoiding duplication

* As most of the functionality is around transforming, fetching and traversing data, rather than also keeping track of state changes, I opted for simple, reusable functions over object-oriented programming

### How I approached development

* I followed TDD, with the exception of scraping of event details from a list of events (i.e. the `fetchEvents` function). When adding a test for this function, the test timed out due to taking too long to make real API calls. Due to time constraints, I ran out of time implementing a test with mocked API calls, as I needed to create fixtures for every event link. In the interest of finishing a working partial solution, I decided to omit this test.

* In my `/src` files, I ran my code with differently formatted result data to handle differing formats (see `/event-details/format.js` for formatting handlers)
* I used Git with feature branching and pull requests to a private repo to review code for a second time (after reviewing first locally) to lower the likelihood of merging mistakes

### Struggles

* I spent too long trying to get ES6 imports to work with Node.js, and should have realised sooner that in a more removed way that this was unimportant (before quickly moving on to more important things).

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

* What to expect - You should see 19 tests passing.

## Running the project

* N.B. Before running - how to add your own file path for the event details to be saved to:
    * Be aware that the `outputFilePath` value in `index.js` will write to a file relative to the current working directory, not relative to the script file. i.e. to save to the file `we_got_tickets_scraper/src/<FILE NAME>`, use string `./src/<FILE NAME>`, not `../src/<FILE NAME>`.

* In the root directory, run `$ yarn start`

* What to expect - the `index.js` file will be run. It should write an array of JSON objects to an output file, which can be specified (the default file is at `src/events-output.json`), and `console.log` a success message in the command line - i.e. `Successfully saved events to file path '...'` - or throw an error if unsuccessful. You can then open the output file to check the data that has been scraped.