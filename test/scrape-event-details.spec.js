var chai = require('chai');
const expect = chai.expect;

const fs = require('fs');

const nock = require('nock');

const eventListPage = require('./helpers/event-list-page.spec').eventListPage;
const multiPriceEventPage = require('./helpers/multi-price-event-page.spec').multiPriceEventPage;

const scrapeEventDetails = require('../src/scrape-event-details');

const deleteIfExists = (path) => {
    return new Promise((resolve, reject) => {
        fs.access(path, async (err) => {
            // if(err && err.code === 'ENOENT')
            if (err && err.message.includes('no such file or directory')) { 
                resolve();
            } else if (err) {
                reject(err);
            } else {
                await deleteStore(path);
                resolve();
            }
        });
    });
};

const readStore = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const deleteStore = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

describe.only('scraping event details for first page', () => {
    const filePath = './test-events-output.csv';

    afterEach(async () => {
        await deleteStore(filePath);
    });

    it('saves the event details for all links to a file', async () => {

        // Given
        // We mock out the first page with all of the event links: 
        const hostName = 'https://www.wegottickets.com';
        const eventLinksUrl = '/searchresults/all';
        const headers = [
            'artists',
            'city',
            'venue',
            'date',
            'prices',
        ];

        nock(hostName)
            .get(eventLinksUrl)
            .reply(200, eventListPage);

        // And 
        // We mock out each page that the event link will open up
        nock(hostName)
            .get('/event/444822')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/404065')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/404681')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/448418')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/447081')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/448370')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/11814')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/447864')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/434408')
            .reply(200, multiPriceEventPage);

        nock(hostName)
            .get('/event/447389')
            .reply(200, multiPriceEventPage);

        /**
         * const expectedLinks = [
                'https://www.wegottickets.com/event/444822',
                'https://www.wegottickets.com/event/404065',
                'https://www.wegottickets.com/event/404681',
                'https://www.wegottickets.com/event/448418',
                'https://www.wegottickets.com/event/447081',
                'https://www.wegottickets.com/event/448370',
                'https://www.wegottickets.com/event/11814',
                'https://www.wegottickets.com/event/447864',
                'https://www.wegottickets.com/event/434408',
                'https://www.wegottickets.com/event/447389',
            ];
         */

        // When
        await scrapeEventDetails(`${hostName}${eventLinksUrl}`, filePath, headers);

        const data = await readStore(filePath);

        // Then
        // the file should contain the correct headers
        // the file should contain all of the correct event details
        expect(data).to.equal('test');
    });
});
