var chai = require('chai');
const expect = chai.expect;

const findEventType = require('../../src/event-details/find').findEventType;
const findEventLinks = require('../../src/event-details/find').findEventLinks;
const findCityAndVenue = require('../../src/event-details/find').findCityAndVenue;
const findArtists = require('../../src/event-details/find').findArtists;
const findDateAndTime = require('../../src/event-details/find').findDateAndTime;
const findPrices = require('../../src/event-details/find').findPrices;
const findEventDetails = require('../../src/event-details/find').findEventDetails;

const eventListPage = require('../helpers/event-list-page.spec').eventListPage;
const musicEventPage = require('../helpers/music-event-page.spec').musicEventPage;
const noTypeEventPage = require('../helpers/no-type-event-page.spec').noTypeEventPage;
const multiPriceEventPage = require('../helpers/multi-price-event-page.spec').multiPriceEventPage;

describe('find event information', () => {
    describe('#findEventType', () => {
        describe('when event type is present', () => {
            it('finds the event type', () => {
                const expectedType = 'MusicEvent';
    
                const eventType = findEventType(musicEventPage);
    
                expect(eventType).to.equal(expectedType);
            });
        });

        describe('when event type is not present', () => {
            it('does not return a type', () => {
                const eventType = findEventType(noTypeEventPage);

                expect(eventType).to.be.null;
            });
        });
    });

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
            const expectedArtists = 'PUPPY';

            const artists = findArtists(musicEventPage);
            expect(artists).to.equal(expectedArtists);
        });
    });

    describe('#findCityAndVenue', () => {
        it('finds city and venue from HTML', () => {
            const expectedCityAndVenue = 'LEEDS: The Brudenell Social Club';

            const cityAndVenue = findCityAndVenue(musicEventPage);
            expect(cityAndVenue).to.equal(expectedCityAndVenue);
        });
    });

    describe('#findDateAndTime', () => {
        it('returns date and time array from HTML', () => {
            const expectedDateAndTime = ['Wed 24th Apr, 2019', 'Door time: 7:30pm'];

            const dateAndTime = findDateAndTime(musicEventPage);
            expect(dateAndTime).to.eql(expectedDateAndTime);
        });
    });

    describe('#findPrices', () => {
        describe('when only one price exists', () => {
            it('returns an array of one object containing a title and value', () => {
                const expectedPrices = [{ title: 'General Admission', value: '£11.00' }];
    
                const prices = findPrices(musicEventPage);
                expect(prices).to.eql(expectedPrices);
            });
        });

        describe('when more than one price exists', () => {
            it('returns an array of objects containing a title and value', () => {
                const expectedPrices = [
                    {
                        title: 'General Admission', value: '£11.00'
                    },
                    {
                        title: 'CONCESSIONS', value: '£9.90'
                    },
                    {
                        title: 'Family Ticket (2 adults & 2 children)', value: '£23.10'
                    },
                    {
                        title: 'school children', value: '£3.30'
                    },
                ];
    
                const prices = findPrices(multiPriceEventPage);
                expect(prices).to.eql(expectedPrices);
            });
        });
    });

    describe('#findEventDetails', () => {
        it('returns unformatted event details from HTML as JSON', () => {
            const expectedDetails = {
                'artists': 'PUPPY',
                'cityAndVenue': 'LEEDS: The Brudenell Social Club',
                'dateAndTime': ['Wed 24th Apr, 2019', 'Door time: 7:30pm'],
                'prices': [ 
                    { title: 'General Admission', value: '£11.00' }
                ],
            };
            
            const details = findEventDetails(musicEventPage);
            expect(details).to.eql(expectedDetails);
        });
    });
});