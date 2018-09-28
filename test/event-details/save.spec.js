var chai = require('chai');
const expect = chai.expect;

const fs = require('fs');

const saveToFile = require('../../src/event-details/save').saveToFile;

describe('save event details', () => {
    describe('#saveToFile', () => {
        it('saves an array of JSON objects to an output file', () => {
            // given
            const array = [
                {
                    artists: 'The Dreamers',
                    city: 'Darlington',
                    venue: 'Harrowgate Club & Institute Ltd',
                    date: 'FRI 28TH SEP, 2018 6:30pm',
                    price: '£9.90',
                },
                {
                    artists: 'The Strokes',
                    city: 'New York',
                    venue: 'Radio City Music Hall',
                    date: 'SAT 29TH SEP, 2018 7:30pm',
                    price: '£40.99',
                },
                {
                    artists: 'Queens of the Stone Age',
                    city: 'London',
                    venue: 'Wembley Arena',
                    date: 'SAT 30TH SEP, 2018 8:30pm',
                    price: '£39.99',
                },
            ];
            
            const filePath = './test/helpers/events-output.spec.json';

            // when
            saveToFile(filePath, array);

            // then
            fs.readFile(filePath, (error, data) => {
                if (error) throw error;
                const savedArray = JSON.parse(data);
                expect(savedArray).to.eql(array);
            });
        });
    });
});