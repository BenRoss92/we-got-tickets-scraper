### What I've learnt:

#### Async/await:

* `await Promise.all(fetchEvents)` - event details get written to file in a random order, i.e. not in same order that is listed on WeGotTickets UK website. Can do this differently if you choose to.

* async/await
NOTE: Below won't work as await needs to be used inside an async function

```javascript
const myData = await getEventLinks();
console.log(myData);
```

#### Native JavaScript

##### ES6 Classes

Example:
```js
class Store {
    constructor(path, headers, createCsvWriter) {
        this._csvWriter = createCsvWriter({
            path,
            header: headers,
            append: true,
        });
    }
}
```

##### `.replace` string method

Takes as parameters:
1. A string or regex to search for in the string
2. A string or regex to replace one or more values found

N.B. for replacing all occurences, need to use the global modifier (`g`)

Example:
```js
const string = 'Banana';
string.replace(/a/g, 'i');
// -> Binini
```

##### Promises:

* Getting results from promises (`.then`):

```javascript
fetchHtmlDoc(url).then((result) => {
  console.log('first chain');
  console.log(result);
  return result;
}).then((result) => {
  console.log('second chain');
  console.log(result);
});
```

```javascript
getEventInfo('https://www.wegottickets.com/event/434408').then((result) => {
  console.log(result);
}).catch(error => {
  console.log(error);
});
```

##### Writing to a file:

* `fs.createWriteStream` maybe could have been more performent to use when handling large amounts of data (i.e. writing from all 600+ pages)?

* N.B. use `__dirname + '${PATH NAME}'`

```javascript 
const fs = require('fs');

// The Dreamers gig - https://www.wegottickets.com/event/429096
fetchHtmlDoc('https://www.wegottickets.com/event/429096')
    .then(result => {
        fs.writeFile(__dirname + '/../test/helpers/music-event-page.spec.js', result, function(err) {
            if (err) console.log(err);
            console.log('successfully written to file');
        }).catch(err => {
            console.log(err);
        });
    })
```

* Do in tests:
```javascript
fetchEventLinks(url).then(urls => {
  console.log(urls);

  // then do something like:
  // links.map((link) => {
  //   getEventInfo(link);
  // });
}).catch(error => {
  console.log(error);
});
```

#### Scraping data inside a JSON-LD object (inside of a script tag)

```js
function findEventType(eventPage) {
    const $ = cheerio.load(eventPage);
    
    const jsonLdString = $('script[type="application/ld+json"]');
    // above scrapes content inside the following tag:
    // <script type="application/ld+json">
    // Explanation: is using a CSS [attribute="value"] attribute selector - i.e. selecting all `<script>` elements with the attribute `type` and the value `application/ld+json`

    return JSON.parse(jsonLdString
        .html()
        .replace(/\n/g,"")
        // `replace` String method - parameters are a pattern (to search for) and a replacement value. The beginning `/` is a delimiter, which marks the beginning and end of a regex pattern. As the replacement value is not a regex pattern, a global modifier (`g`) must be used to replace all occurences of the search pattern (otherwise it will only replace the first occurence).
    )['@type'];
    /**
     * Using `replace` to remove line feed characters as otherwise an 'unexpected token' error occurs when attempting to parse the resulting JSON object. This is because when the `description` key's value is parsed from a string into JSON, carriage returns/whitespace is added to the string, which causes JavaScript to think of the strings as being separate from each other. Instead of being evaluated as part of one string, is being evaluated as separate strings/values, so the string cannot be parsed into a JSON object.
     */

    /**
     * Different solution: Could add an extra backslash in front of all line feed (`\n`) characters - all new lines will be preserved in the resulting description (inside the JSON-LD object).
     */

     // If wanted to use the description, might need to also escape/remove form feed and tab characters (\f and \t)? See http://qnimate.com/json-parse-throws-unexpected-token-error-for-valid-json/
}
```

#### CSV

* Use csv-parser npm library if want to read CSV from file (don't need to?)

#### Cheerio

##### Difference between `.text()` and `.html()`:

Example:
```html
<div class="venue-details">
    <h2>LEEDS: The Brudenell Social Club</h2>
    <span class="doorTime">
        Wed 24th Apr, 2019
        <br>
        Door time: 7:30pm
    </span>
</div>
```

* `.text()`
  * returns the visible text you would see inside of the element when viewing it in a browser (i.e. after the HTML has been parsed by a browser). i.e.:
```
LEEDS: The Brudenell Social Club
                            
Wed 24th Apr, 2019

Door time: 7:30pm
```

* `.html()`
  * returns the HTML inside of the element (without parsing it into text):
```html
<h2>LEEDS: The Brudenell Social Club</h2>
<span class="doorTime">
    Wed 24th Apr, 2019
    <br>
    Door time: 7:30pm
</span>
```

##### How to web scrape JSON (or JSON-LD) from inside of a `<script>` HTML tag

* One option: use a CSS attribute selector with Cheerio 

##### Task: Return the text contained in the following `<h2>` elements as an array:

```html
<section>
  <div class="price">
    <h2>General Admission</h2>
  </div>
  <div class="price">
    <h2>Concession</h2>
  </div>
</section>
```

This won't work:
```js
const $ = cheerio.load(html);

// returns an array of cheerio objects
const prices = $('.price').find('h2');

// maps over the cheerio objects. `.text()` throws an error as it cannot be called on a cheerio object (needs to be called on a DOM element but is not):
const titles = prices.map((_index, cheerioObj) => cheerioObj.text());
  // => # throws error "title.text is not a function"
```

When using `.map()`, need to use `$(element)` and `.get()` instead:
```js
const $ = cheerio.load(html);

// returns an array of cheerio objects
const prices = $('.price').find('h2');

// Each cheerio object (`cheerioObj`) is used a selector. This is passed in to the DOM ($), which searches the DOM for the h2 elements:
const titles = prices.map((_index, cheerioObj) => $(cheerioObj).text())
  // `.map` produces a new Cheerio object containing the returned values. `.get()` then retrieves all of the DOM elements matched by that Cheerio object.
  .get();
  // => [ 'General Admission', 'Concession' ];
```

Or can use `.each` instead:
```js
const $ = cheerio.load(html);

// returns an array of cheerio objects
const prices = $('.price').find('h2');

// array to add the text to
const titles = [];

prices.each((index, cheerioObj) => {
  // add items into array manually
  titles[index] = $(cheerioObj).text();
  // don't need to use `.get()`, as `.each()` does not return a Cheerio Object (it does not return anything)
});

return titles;
// => [ 'General Admission', 'Concession' ];
```

#### Special characters

* Javascript String - what does the backslash character do when using quotes?
  * it escapes the quotation marks (double quotes), letting JavaScript know that you want to use a special character after the backslash (i.e. JavaScript will not try to interpret it as something else).

* What does normalising whitespace mean?
  * Answer - combining repeated whitespaces or special whitespace characters (e.g. \r, \n) into one space.

* newline vs carriage return - what’s the difference?
  * Carriage return (\r) is to go back to the beginning of the current line you’re on. Line feed (\n) is to go to the next line. In JavaScript, a line feed performs both in one step, so don’t need a carriage return.

#### JSON

String containing a line feed character - Why can’t I parse it into a JSON object?
- In the JSON spec, the line feed character is described as a “control character”, which according to the spec, must be escaped by adding an additional backslash character before the line feed character. Otherwise instead of the resulting string containing a line feed, the JSON parser will get confused and throw an error.

When parsing a string containing a JSON object, do the object keys have to be surrounded by quotes?
- Answer - yes. To do with the conventions set up by JavaScript

#### CSS

CSS - what are attribute selectors?
- Answer - a selector that allows you to select an element containing a particular attribute (or a particular attribute’s value) - e.g. script[class=“foo”] - selects the script element containing the class .foo.

#### Testing 

* Why *both* unit and integration tests should be used - https://www.youtube.com/watch?v=vqAaMVoKz1c

* Mocking in JS tests
    * I used dependency injection
    * Search youtube for "fun fun function mocking" - fun fun function has a youtube series on mocking in JS
    * Search youtube for "fun fun function dependency injection"

#### Sinon

* Useful links from sinon.js website - https://sinonjs.org/how-to/
* Best practices for using Sinon with Chai - https://logrocket.com/blog/sinon-with-chai/

##### Testing a third-party API - e.g. `fs` module

* Better to mock the file system than use the real thing - it's not easy to check if file system is clean before running tests. Should try to ensure our tests will not be affected by our file system being in a weird state, e.g. a file already existing, or not existing when it needs to be.

* Mocking the Node.js `fs` module with `sinon` - https://glebbahmutov.com/blog/mock-system-apis/

###### Testing creation a file (fs.writeFile):

One way to mock `fs.writeFile` - `require` the real `fs` module, then stub only its `writeFile` method. We don't want to actually create a file (i.e. actually call the real `fs.writeFile` method), so instead of using a spy (which would do this), we use a stub with no functionality, and check that it was called properly by our wrapper function.

Our wrapper function to be tested:

```js
const createStore = (fs, path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
```

test:

```js
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const sinon = require('sinon');
const createStore = require('../../src/event-details/store').createStore;

it('calls fs.writeFile with the correct filepath and data', async () => {
  // GIVEN
  // a test path
  const testPath = './test/helpers/events-output.spec.csv';
  // some data
      const data = 'blah';
  // a stubbed version of `fs.writeFile`
  // N.B. passing in the real `fs` module, with its `writeFile` method being stubbed
  const writeFileStub = sinon.stub(fs, 'writeFile');

  /**
   * N.B. must call `yields` - this causes the writeFileStub to execute the (first) callback it receives - i.e. our custom callback which rejects/resolves the promise. Otherwise test with fail with a timeout error. If the callback is never executed, then we will be awaiting a promise that never finishes (because the last step inside the promise, i.e. the callback, is never executed).
   * 
   * You can provide an argument to this callback - i.e. a value for `err`, if you want to replicate what happens when writeFile fails with an error.
   * 
   * e.g. writeFileStub.yields(new Error("oh poopies!"));
   */
  writeFileStub.yields();

  // WHEN
  // calling createStore
  // and the writeFile's callback is successful, i.e. does not receive an error object
  await createStore(fs, testPath, data);

  // THEN
  // check that `writeFile` method on `fs` object was called once.
  expect(writeFileStub.calledOnce).to.be.true;

  // check that `writeFile` method on `fs` object received the correct arguments - i.e. the same file path and data passed into #createStore, and a callback function with no arguments.
  expect(writeFileStub.getCall(0).args[0]).to.equal(testPath);
  expect(writeFileStub.getCall(0).args[1]).to.equal(data);
  expect(writeFileStub.getCall(0).args[2]).to.be.a('function');

  // N.B. Not using `calledWithExactly` (i.e. checking if our callback function looks as expected) as comparing functions in sinon does not use strict equals (it uses loose equals instead). On the other hand, we don't want to be too loose with our checks by using `calledWith`, as we could accidentally omit e.g. the data as an argument and the test would still pass:
  
  // Not strict enough:
  // expect(writeFileStub.calledWith(testPath)).to.be.true;

  // N.B. Need to use `.restore()` to avoid a test double inside one test affecting a double within another test. `.restore()` restores the default sandbox - i.e. removes any testdoubles created in the default sandbox that we are using
  writeFileStub.restore();
});

describe('when fs.writeFile is successful', () => {
  it('returns a resolved promise with no defined value', async () => {
      const writeFileStub = sinon.stub(fs, 'writeFile');

      // Again, we need to ensure the callback within the promise gets executed, for the promise to complete
      writeFileStub.yields();
      
      const returnValue = await createStore(fs, testPath, data);

      // check that createStore returns a resolved promise (with no value)
      expect(returnValue).to.equal(undefined);

      writeFileStub.restore();
  });
});

describe('when fs.writeFile is unsuccessful', () => {
  it('returns a rejected promise with the error', async () => {
      const data = 'blah';
      const writeFileStub = sinon.stub(fs, 'writeFile');
      
      const fakeError = new Error('writeFile failed');

      // replicate `fs.writeFile` failing - we stubbed the `writeFile` method on `fs`. Now we pass an error to the callback that gets executed after writeFile finishes (this is what would happen if writeFile resulted in an error).
      writeFileStub.yields(fakeError);

      try {
          await createStore(fs, testPath, data);
      } catch (error) {
          expect(error).to.eql(fakeError);
      }

      writeFileStub.restore();
  });
});
```

###### Sinon - mocking with ES6 classes

Example:
```js
// src code
class Store {
    constructor(path, headers, createCsvWriter) {
        this._csvWriter = createCsvWriter({
            path,
            header: headers,
            append: true,
        });
    }
}

// test code
const chai = require('chai');
const expect = chai.expect;

const sinon = require('sinon');

describe('managing the storage of events', () => {
    describe('when Store is initialised', () => {
        it('calls #createCsvWriter with an object containing a file path and an array of CSV headers', () => {
            const testPath = './test/helpers/events-output.spec.csv';
            const csvHeaders = ['artists', 'city', 'venue', 'date', 'prices'];
            
            // creating spy as an anonymous function
            // Reason: the functionality of the `createCsvWriter` function is not being tested.
            // We don't need it to have any functionality. We only want to record information about how it was called.
            const createCsvWriterSpy = sinon.spy();

            new Store(testPath, csvHeaders, createCsvWriterSpy);

            // spy gets called once
            expect(createCsvWriterSpy.calledOnce).to.be.true;

            // spy receives an object as an argument that looks like this:
            // {
            //     path: testPath,
            //     header: csvHeaders,
            //     append: true
            // }
            
            // if using calledWithExactly, need to use .to.be.true. e.g.:
            // expect(createCsvWriterSpy.firstCall.calledWithExactly({
            //     path: testPath,
            //     header: csvHeaders,
            //     append: true,
            // })).to.be.true;
            // when this test fails, it will only give you the error "expected false to be true".
            // It won't show you exactly which particular arguments were incorrect.

            // workaround:
            // expect(createCsvWriterSpy.firstCall.args[0]).to.eql({
            //     path: testPath,
            //     header: csvHeaders,
            //     append: true,
            // });
            // but then the matchers aren't very nice.

            // solution - use sinon-chai library

            expect(createCsvWriterSpy.firstCall.args[0]).to.eql({
                path: testPath,
                header: csvHeaders,
                append: true,
            });

            // restore the default sandbox - i.e. remove any testdoubles created in that sandbox
            sinon.restore();
        });
    });

    describe('#createStore', () => {
        it('creates a file for storing the data', () => {
            // Given
            const testPath = './test/helpers/events-output.spec.csv';
            const csvHeaders = ['artists', 'city', 'venue', 'date', 'prices'];
            const createCsvWriterDouble = function () {};
            const store = new Store(testPath, csvHeaders, createCsvWriterDouble, fsDouble);

            // When
            // store.createStore(data)
            
            // Then

            // check that `writeFile` method on `fs` object (is an object, not a function) was called once.
            // check that `writeFile` method on `fs` object (is an object, not a function) received the correct arguments - i.e. a file path, the same data passed into #createStore (or instead, that the csv headers have  if const headerString = formatHeaders(headers);) and a callback function with no arguments.
        });
    });
});
```