const axios = require('axios');

const findEventLinks = require('./find').findEventLinks;
const findEventDetails = require('./find').findEventDetails;

const fetchHtmlDoc = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: 'text',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const fetchEventLinks = async (url) => {
    try {
        const htmlDoc = await fetchHtmlDoc(url);
        return findEventLinks(htmlDoc);
    } catch (error) {
        throw error;
    }
}

const fetchEventDetails = async (url) => {
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
