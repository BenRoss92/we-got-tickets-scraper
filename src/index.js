const fetchEventLinks = require('./event-details/fetch').fetchEventLinks;
const fetchEvents = require('./event-details/fetch').fetchEvents;

const formatEventDetails = require('./event-details/format').formatEventDetails;

const saveToFile = require('./event-details/save').saveToFile;

async function scrapeEventDetails(
    allEventsUrl = 'https://www.wegottickets.com/searchresults/all',
    outputFilePath = './src/events-output.json',
) {
    try {
        const eventLinks = await fetchEventLinks(allEventsUrl);
    
        const unformattedEvents = await fetchEvents(eventLinks);
    
        const formattedEvents = unformattedEvents.map((unformattedEvent) => unformattedEvents
            && formatEventDetails(unformattedEvent));

        saveToFile(outputFilePath, formattedEvents);
    } catch (error) {
        throw error;
    }
}

scrapeEventDetails();
