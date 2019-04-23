var chai = require('chai');
const expect = chai.expect;

const nock = require('nock');
const eventListPage = require('../helpers/event-list-page.spec').eventListPage;
const musicEventPage = require('../helpers/music-event-page.spec').musicEventPage;

const fetchHtmlDoc = require('../../src/event-details/fetch').fetchHtmlDoc;
const fetchEventLinks = require('../../src/event-details/fetch').fetchEventLinks;
const fetchEventDetails = require('../../src/event-details/fetch').fetchEventDetails;

describe('fetch event details', () => {
    describe('#fetchHtmlDoc', () => {
        it('returns an HTML document given a URL', async () => {
            // given
            const hostName = 'https://www.wegottickets.com';
            const path = '/searchresults/all';

            nock(hostName)
                .get(path)
                .reply(200, eventListPage);
            
            // when
            const htmlDoc = await fetchHtmlDoc(hostName + path);

            // then
            expect(typeof htmlDoc).to.be.a('string');
            expect(htmlDoc).to.have.string('</html>');
            expect(htmlDoc).to.have.string('</body>');
        });
    });

    describe('#fetchEventLinks', () => {
        it('returns event links from a URL', async () => {
            // given
            const hostName = 'https://www.wegottickets.com';
            const path = '/searchresults/all';

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

            nock(hostName)
                .get(path)
                .reply(200, eventListPage);
            
            // when
            const eventLinks = await fetchEventLinks(hostName + path);

            // then
            expect(eventLinks).to.eql(expectedLinks);
        });
    });

    describe('#fetchEventDetails', () => {
        it('returns event details from an event page', async () => {
            // given
            const hostName = 'https://www.wegottickets.com';
            const path = '/event/429096';

            const expectedDetails = {
                artists: 'THE DREAMERS',
                cityAndVenue: 'DARLINGTON: Harrowgate Club & Institute Ltd',
                date: 'FRI 28TH SEP, 2018 6:30pm',
                price: '£9.90',
            };

            nock(hostName)
                .get(path)
                .reply(200, musicEventPage);

            // when
            const eventDetails = await fetchEventDetails(hostName + path);

            // then
            expect(eventDetails).to.eql(expectedDetails);
        });
    });

});