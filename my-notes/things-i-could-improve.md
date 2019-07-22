## Things I could improve

* Finding event details - load the event page into cheerio once rather than multiple times
  * `findEventDetails()` currently calls `cheerio.load` multiple times, even though I'm passing in the same page to all of the enclosed functions.
  * Solution - as the loaded cheerio object needs to be shared between these functions, put all of the functions that need it into a class and have the loaded cheerio object as an instance variable.
  * Example:
```js
class Finder(cheerio, eventPage) {
    constructor(htmlDoc) {
        // cheerio only has to load page once. Can be reused by any `find` functions:
        this.$ = cheerio.load(eventPage);
    }

    findArtists = () => {
        return this.$('.event-information').find('h1').text();
    }
    
    findCityAndVenue = () => {
        return this.$('.venue-details').find('h2').text();
    }
    // etc.
}
```

* mocking tests for i/o (`fs` library) - could have used `mock-fs` library - https://itnext.io/how-to-mock-dependency-in-a-node-js-and-why-2ad4386f6587)
  * Reason I went with Sinon instead - I wanted to learn about mocking in JavaScript by hand

* Could give a more explicit public API for controlling the store (i.e. to stop it getting into weird states).
  * Could ensure that each instance of a store can only have one file path associated with it (i.e. adding a `path` instance variable to the `Store` class)
  * The store could delegate to the CSV transformer - e.g. the store creation method could delegate to the transformer to transform the headers into a CSV string, as part of creating the store. 
  * For appending the store, again the store could delegate to the CSV transformer.

* Saving data as JSON instead of CSV
  * Another option for appending to a file could be using newline delimited JSON - but seems to be used mainly for streaming/streams, which I’m not using.

* Save an array of event details, instead of every individual event detail
  * Current implementation - Get all event links for first page, then for each event link, fetch the HTML for one event only, then check if a music event (if not, move on to next event), then find the event’s details, then format the event’s details, then save event. Repeat with remaining event links.
    * Reason for using this approach - If and when adding a progress loading bar, the loading bar would show more of the increments if each event is saved one by one, rather than saving them in batches
  * Instead could use an alternative implementation - Get all event links for first page. Map those event links into a new array where for each event, we fetch the HTML doc, check the event type (if a non-music event, return nothing, resulting in a ‘null’ array item), then get the event’s details, then format the event’s details, then save all of them in one go.
    * Would be easier to split the program into smaller, more reusable functions - e.g. each of these could be their own functions: Create the headers, get event details for one page, append them to a file.

* Could convert the date and times into a uniform format (e.g. ISO date-time strings), to allow the end user to filter scraped events by dates and times
