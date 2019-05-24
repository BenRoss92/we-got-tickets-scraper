var chai = require('chai');
const expect = chai.expect;

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

const transformToCsv = require('../../src/event-details/transform').transformToCsv;

describe('Transform', () => {
    it('transforms an event into a CSV string', () => {
        const headers = ['artists', 'city', 'venue', 'date', 'prices'];

        const eventDetails = {
            artists: 'Puppy',
            city: 'Leeds',
            venue: 'The Brudenell Social Club',
            date: 'Wed 24th Apr, 2019. Door time: 7:30pm',
            prices: 'General Admission: £11.00',
        };

        const expectedCsvString = 'Puppy,Leeds,The Brudenell Social Club,"Wed 24th Apr, 2019. Door time: 7:30pm",General Admission: £11.00\n';

        const csvString = transformToCsv(createCsvStringifier, headers, [eventDetails]);

        expect(csvString).to.equal(expectedCsvString);
    });
});