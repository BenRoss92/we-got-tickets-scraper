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
}

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
}

const findCityAndVenue = eventPage => {
    const $ = cheerio.load(eventPage);
    return $('.venue-details').find('h2').text();
}

const findDate = eventPage => {
    const $ = cheerio.load(eventPage);
    return $('.venue-details').find('h4').text();
}

const findPrice = eventPage => {
    const $ = cheerio.load(eventPage);
    return $('.BuyBox').find('strong').text();
}

const findEventDetails = eventPage => {
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
    findEventType,
    findEventLinks,
    findArtists,
    findCityAndVenue,
    findDate,
    findPrice,
    findEventDetails,
}