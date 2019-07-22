## Why I made certain decisions

* Thought about also using `json2csv` npm library, or `json-2-csv` npm library to transform JSON to a CSV string (before writing to file)

* Why I created the file and the headers manually, instead of using the `CSV-writer` npm package - the CSV-writer npm package won’t allow writing CSV headers when appending a file (only when writing a new file). And I need to append the file for each new event page being scraped.

* I didn't use a stream - thought it would only be useful if e.g. I needed to read one huge file (i.e. bigger than 2gb).

* I saved event details from the first event page to a file, before doing more scraping - e.g. checking whether there is a next page, getting the next batch of data, etc.
  * Reason - Would otherwise have to store all 600+ pages of data in memory before saving to the file in one go - not very performant

* Did not mock Cheerio in my tests
  * Reason - it ran fast enough, was idempotent, and I needed to use it in a very specific way for each `find` function to get completely different results. So thought it was better to test that my functions produced the real outcomes I was hoping for.