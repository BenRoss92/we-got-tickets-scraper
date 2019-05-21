const fs = require('fs');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const fetchEventLinks = require('./event-details/fetch').fetchEventLinks;
const fetchHtmlDoc = require('./event-details/fetch').fetchHtmlDoc;

const findEventType = require('./event-details/find').findEventType;
const findEventDetails = require('./event-details/find').findEventDetails;

const formatEventDetails = require('./event-details/format').formatEventDetails;
const formatHeaders = require('./event-details/format').formatHeaders;

const createStore = require('./event-details/store').createStore;

const outputFilePath = './src/events-output.csv';
const allEventsUrl = 'https://www.wegottickets.com/searchresults/all';
const csvHeaders = ['artists', 'city', 'venue', 'date', 'prices'];

const scrapeEventDetails = async (
    url = allEventsUrl,
    path = outputFilePath,
    headers = csvHeaders,
) => {
    const csvWriter = createCsvWriter({
        path,
        header: headers,
        append: true,
    });

    const headerString = formatHeaders(headers);

    await createStore(fs, path, headerString);
    console.log(`File '${path}' successfully created with headers:\n ${headerString}`);

    const eventLinks = await fetchEventLinks(url);

    const fetchEvents = await eventLinks.map(async (eventLink) => {
        const eventPage = await fetchHtmlDoc(eventLink);

        if (findEventType(eventPage) !== 'MusicEvent') {
            return;
        }

        const unformattedEvent = findEventDetails(eventPage);

        const formattedEvent = formatEventDetails(unformattedEvent);

        await csvWriter.writeRecords([formattedEvent]);
        console.log(`Successfully saved event to file path '${path}'`);
    });

    await Promise.all(fetchEvents);
};

scrapeEventDetails()
    .then(() => console.log('Finished scraping page 1'))
    .catch((err) => console.error(err));
