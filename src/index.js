const scrapeEventDetails = require('./scrape-event-details');

scrapeEventDetails()
    .then(() => console.log('Finished scraping page 1'))
    .catch((err) => console.error(err));
