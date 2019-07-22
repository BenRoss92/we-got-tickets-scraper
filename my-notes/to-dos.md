## To-dos:

### Immediate

* Add integration tests for scraping only music events from the first event page
  * Mock out the events being fetched - use nock, and decide how often to update your fixtures using `nock.back`. i.e. judge what fixtures should be new and which should always stay the same when running tests on a CI server
  * Decide whether to use the real file system, or mock it out - maybe use the real file system and only mock it out when you are doing smaller integration tests (e.g. only scraping the first page, not other pages)?
  * Scenarios:
    * When the event page contains a mixture of music and non-music events - only the music events should be scraped
    * When the event page contains only non-music events - no events should be scraped
    * When the event page contains no events - no events should be scraped
    * What happens when the header values passed in don't match what's being scraped?
    * What happens if the file already exists? Does it overwrite it?
    * Test that the next page also gets scraped, until the last page - mock out 3 pages - page 1, page 2, page 3 (final page)
    * Example:
    Given
        I pass in some headers
        The event page being scraped contains all music events
    When 
        I call the function that scrapes the details and writes it to a CSV file
    Then
        The file should exist
        The file should contain the headers I passed in
        The file should contain the data I am expecting - i.e. all of the event details inside of the links on the first page

* Force using correct node version when running on a new machine - should automatically find and use a Node.js version on the system it is running on that is 8.2.1 or greater. If it succeeds, it should then run fine. If not, should display an error explaining why it failed.
  * Test on e.g. Dad's mac
  * See which tutorials are helpful:
    * https://itnext.io/nvm-the-easiest-way-to-switch-node-js-environments-on-your-machine-in-a-flash-17babb7d5f1b
    * https://nitayneeman.com/posts/standardizing-node.js-version-in-an-npm-package/
    * https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/
    * https://stackoverflow.com/questions/29653036/automatically-switch-to-correct-version-of-node-based-on-project
    https://medium.com/@ramsunvtech/manage-multiple-node-versions-e3245d5ede44
    * https://medium.com/@kinduff/automatic-version-switch-for-nvm-ff9e00ae67f3
    * https://medium.com/@kinduff/automatic-version-switch-for-nvm-ff9e00ae67f3
    * http://www.dmydlarz.com/2018/12/06/specify-node-version.html
    * https://dmitripavlutin.com/install-node-like-a-boss-with-nvm/
    * https://itnext.io/node-engines-helping-developers-everywhere-avoid-phantom-bugs-2eef519604b2
    * https://medium.com/@faith__ngetich/locking-down-a-project-to-a-specific-node-version-using-nvmrc-and-or-engines-e5fd19144245

* Do web scraping for all other pages

* In case website ever gets taken down, add screenshots/gifs to README of:
  * An event list page
  * A single event page
  * The tests being run
  * The project running and successfully scraping data
  * The file being inspected containing the resulting data

* Remove hard coding of only scraping music events + add tests - i.e. checking whether we have permission to get the event details for a certain event
  * Ideas:
    * Enter in one or more event types into the command line. When examining an event, the app checks the even type and whether we have searched for those event types. If yes, it does. If no, it doesnt'.
    * Allow scraping of all events if nothing is added to command line
    * Need to find out what all of the available event types are.
    * Some events will not have a type
    * Imagine using it like the search functionality on the actual website.

### Non-immediate

* For tests using testdoubles (i.e. using sinon) - replace chai assertions with assertions from sinon-chai library (install first) - https://www.chaijs.com/plugins/sinon-chai/
* Add `chai-as-promised` npm library and replace awaiting Promises (and storing results) in tests - https://www.chaijs.com/plugins/chai-as-promised/
  * https://www.sitepoint.com/promises-in-javascript-unit-tests-the-definitive-guide

* Remove code I'm not using
  * e.g. unnecessary try/catches?
  * Test out all functions inside tests to see what happens when they fail - do they cause unhandled promise rejection warnings in the console?
  * Find out if I need all of the try/catch blocks if I’m just throwing the errors again - i.e. maybe I only need to use a `.then()` and `.catch()` or a `try/catch` block when executing a function at the very top level
* Review what happens when the event details being used are in a weird format (i.e. check the `'WARNING: CHECK FORMATTING'` errors)

#### Add to Readme

* N.B. Requirement to scrape 'date' - I have included the time in this field as wasn't sure from the requirements if this was desired

* Why I used CSV instead of JSON
  * Downsides of CSV
    * Can't have nested properties - e.g. for different types of prices
  * Downsides of JSON
    * Can't start querying it immediately like a CSV file in Excel
    * Can’t append a JSON array easily and performantly - would need to read and parse the whole file, then push a new JSON object into the array, then overwrite the whole file. So going to use CSV instead as can easily append the file contents.


### Bonus to-dos:

* Add ability to specify file path as a command line argument.
  * N.B. A value added in `index.js` will write to a file relative to the current working directory, not relative to the script file. i.e. to save to the file `we_got_tickets_scraper/src/<FILE NAME>`, use string `./src/<FILE NAME>`, not `../src/<FILE NAME>`.
* After data is formatted (before the appending step) - if a key inside of the formatted object does not match the corresponding CSV header, no data is written in the output file for that column. Also, no error is thrown (it fails silently).
  * Think about how to alert the user when this has happened, e.g by throwing an error somehow
* Loading modules - replace CommonJS (`require` - ES5) with ES6 imports (`import`)
  * Find out what the benefits are
* Record all (multiple) ticket prices for an individual event (e.g. concessions) by recording as a nested JSON object in a file.
  * Couldn't make individual columns for each type of price as they could be of a unique type (e.g. "FAMILY TICKET (2 ADULTS & 2 CHILDREN), "school children", etc.). Currently I list all prices as comma separated, which can be parsed later - but for querying for prices this way would be slow/inefficient
  * Suggestion: Append file as newline delimited JSON (instead of CSV) and have a nested "prices" object within each JSON object.
  * Can then remove the '£' signs from the results in order to query the numbers correctly (e.g. find the cheapest tickets - can't do it with a `£` sign)

* Lessen likelihood of test fixtures getting outdated - use nock to check the test fixtures against the real fetched HTML docs every so often (use `nock.back`?)

* Add supporting acts to event details (split "artists" column into "headliner/s" and "supporting act/s")
* Add a command line loading bar (so the user can see the progress of the web scraper)

* Ensure tests containing test doubles only have one assertion per test (otherwise confusing when tests fail - i.e. not sure what assertion has failed in each test if there are more than one assertions)