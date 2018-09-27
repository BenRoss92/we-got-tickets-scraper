const axios = require('axios');

const findEventLinks = require('./find-event-details').findEventLinks;
const findEventDetails = require('./find-event-details').findEventDetails;

async function fetchHtmlDoc(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'text',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function fetchEventLinks(url) {
    try {
        const htmlDoc = await fetchHtmlDoc(url);
        return findEventLinks(htmlDoc);
    } catch (error) {
        throw error;
    }
}

async function fetchEventDetails(url) {
    try {
      const eventPage = await fetchHtmlDoc(url);

      return findEventDetails(eventPage);
    } catch (error) {
      throw error;
    }
}

module.exports = {
    fetchHtmlDoc,
    fetchEventLinks,
    fetchEventDetails,
}
