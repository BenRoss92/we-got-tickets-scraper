const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const fetchEventLinks = require('./event-details/fetch').fetchEventLinks;
const fetchHtmlDoc = require('./event-details/fetch').fetchHtmlDoc;

const findEventType = require('./event-details/find').findEventType;
const findEventDetails = require('./event-details/find').findEventDetails;

const formatEventDetails = require('./event-details/format').formatEventDetails;

const createStore = require('./event-details/manage-store').createStore;

const outputFilePath = './src/events-output.csv';
const allEventsUrl = 'https://www.wegottickets.com/searchresults/all';

const scrapeEventDetails = async (
    url = allEventsUrl,
    path = outputFilePath,
) => {
    const headers = 'artists,city,venue,date,price\n';
    await createStore(path, headers);
    console.log(`File ${path} successfully created with data ${headers}`);

    const eventLinks = await fetchEventLinks(url);

    const fetchEvents = await eventLinks.map(async (eventLink) => {
        const eventPage = await fetchHtmlDoc(eventLink);

        if (findEventType(eventPage) !== 'MusicEvent') {
            return;
        }

        const unformattedEvent = findEventDetails(eventPage);

        const formattedEvent = formatEventDetails(unformattedEvent);

        const csvWriter = createCsvWriter({
            path,
            header: ['artists', 'city', 'venue', 'date', 'price'],
            append: true,
        });

        await csvWriter.writeRecords([formattedEvent]);
        console.log(`Successfully saved event to file path '${path}'`);
    });

    await Promise.all(fetchEvents);
    console.log('Finished scraping page');
};

scrapeEventDetails()
    .then(() => console.log('Finished all scraping!'))
    .catch((err) => console.error(err));
