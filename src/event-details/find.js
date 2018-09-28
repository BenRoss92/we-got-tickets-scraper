const cheerio = require('cheerio');

function findEventLinks(htmlDoc) {
    const $ = cheerio.load(htmlDoc);
    
    const eventElements = $('h2');

    return eventElements.map((index, element) => {
        return $(element).find('a').attr('href');
    }).get();
};

function findArtists(eventPage) {
    const $ = cheerio.load(eventPage);
    return $('.event-information').find('h1').text();
}

function findCityAndVenue(eventPage) {
    const $ = cheerio.load(eventPage);
    return $('.venue-details').find('h2').text();
}

function findDate(eventPage) {
    const $ = cheerio.load(eventPage);
    return $('.venue-details').find('h4').text();
}

function findPrice(eventPage) {
    const $ = cheerio.load(eventPage);
    return $('.BuyBox').find('strong').text();
}

function findEventDetails(eventPage) {
    const artists = findArtists(eventPage);
    const cityAndVenue = findCityAndVenue(eventPage);
    const date = findDate(eventPage);
    const price = findPrice(eventPage);

    return {
        artists,
        cityAndVenue,
        date,
        price,
    };
}

module.exports = {
    findEventLinks,
    findArtists,
    findCityAndVenue,
    findDate,
    findPrice,
    findEventDetails,
}