const cheerio = require('cheerio');

const findEventType = eventPage => {
    const $ = cheerio.load(eventPage);
    
    const jsonLdString = $('script[type="application/ld+json"]').html();

    if (jsonLdString === null) {
        return null;
    }
    
    return JSON.parse(jsonLdString
            .replace(/\n/g,"")
    )['@type'];
};

const findEventLinks = htmlDoc => {
    const $ = cheerio.load(htmlDoc);
    
    const eventElements = $('h2');

    /**
     * Cheerio's `.map` method requires the use of an index parameter.
     * We do not use the index here, therefore the `_` indicates that it should be ignored.
     */
    return eventElements.map((_index, element) => {
        return $(element).find('a').attr('href');
    }).get();
};

const findArtists = eventPage => {
    const $ = cheerio.load(eventPage);
    return $('.event-information').find('h1').text();
};

const findCityAndVenue = eventPage => {
    const $ = cheerio.load(eventPage);
    return $('.venue-details').find('h2').text();
};

const findDateAndTime = eventPage => {
    const $ = cheerio.load(eventPage);
    return $('.doorTime')
        .html()
        .split('<br>')
        .map((html) => html.trim());
};

const findPrices = eventPage => {
    const $ = cheerio.load(eventPage);

    return $('.BuyBox').map((_index, element) => ({
        title: $(element).find('h2').text(),
        value: $(element).find('strong').text()
    })).get();
};

const findEventDetails = eventPage => {
    const artists = findArtists(eventPage);
    const cityAndVenue = findCityAndVenue(eventPage);
    const dateAndTime = findDateAndTime(eventPage);
    const prices = findPrices(eventPage);

    return {
        artists,
        cityAndVenue,
        dateAndTime,
        prices,
    };
};

module.exports = {
    findEventType,
    findEventLinks,
    findArtists,
    findCityAndVenue,
    findDateAndTime,
    findPrices,
    findEventDetails,
}