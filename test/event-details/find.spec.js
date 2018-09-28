var chai = require('chai');
const expect = chai.expect;

const findEventLinks = require('../../src/event-details/find').findEventLinks;
const findCityAndVenue = require('../../src/event-details/find').findCityAndVenue;
const findArtists = require('../../src/event-details/find').findArtists;
const findDate = require('../../src/event-details/find').findDate;
const findPrice = require('../../src/event-details/find').findPrice;
const findEventDetails = require('../../src/event-details/find').findEventDetails;

const eventListPage = require('../helpers/event-list-page.spec').eventListPage;
const eventPage = require('../helpers/event-page.spec').eventPage;

describe('find event information', () => {
    describe('#findEventLinks', () => {
        it('returns an array of event page links, given HTML', () => {
            const expectedLinks = [
                'https://www.wegottickets.com/event/444822',
                'https://www.wegottickets.com/event/404065',
                'https://www.wegottickets.com/event/404681',
                'https://www.wegottickets.com/event/448418',
                'https://www.wegottickets.com/event/447081',
                'https://www.wegottickets.com/event/448370',
                'https://www.wegottickets.com/f/11814',
                'https://www.wegottickets.com/event/447864',
                'https://www.wegottickets.com/event/434408',
                'https://www.wegottickets.com/event/447389',
            ];

            const links = findEventLinks(eventListPage);
            
            expect(links).to.have.a.lengthOf(10);
            expect(links).to.eql(expectedLinks);
        });
    });

    describe('#findArtists', () => {
        it('finds artists from HTML', () => {
            const expectedArtists = 'THE DREAMERS';

            const artists = findArtists(eventPage);
            expect(artists).to.equal(expectedArtists);
        });
    });

    describe('#findCityAndVenue', () => {
        it('finds city and venue from HTML', () => {
            const expectedCityAndVenue = 'DARLINGTON: Harrowgate Club & Institute Ltd';

            const cityAndVenue = findCityAndVenue(eventPage);
            expect(cityAndVenue).to.equal(expectedCityAndVenue);
        });
    });

    describe('#findDate', () => {
        it('finds date and time from HTML', () => {
            const expectedDateAndTime = 'FRI 28TH SEP, 2018 6:30pm';

            const dateAndTime = findDate(eventPage);
            expect(dateAndTime).to.equal(expectedDateAndTime);
        });
    });

    describe('#findPrice', () => {
        it('finds price from HTML', () => {
            const expectedPrice = '£9.90';

            const price = findPrice(eventPage);
            expect(price).to.equal(expectedPrice);
        });
    });

    describe('#findEventDetails', () => {
        it('returns unformatted details from HTML as JSON', () => {
            const expectedDetails = {
                'artists': 'THE DREAMERS',
                'cityAndVenue': 'DARLINGTON: Harrowgate Club & Institute Ltd',
                'date': 'FRI 28TH SEP, 2018 6:30pm',
                'price': '£9.90',
            };
            
            const details = findEventDetails(eventPage);
            expect(details).to.eql(expectedDetails);
        });
    });
});