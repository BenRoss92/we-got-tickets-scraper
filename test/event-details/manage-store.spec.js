const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');

const createStore = require('../../src/event-details/manage-store').createStore;

const deleteIfExists = (path) => {
    return new Promise((resolve, reject) => {
        fs.access(path, async (err) => {
            if (err && err.message.includes('no such file or directory')) { 
                // console.log(`${path} file path does NOT exist`);
                resolve();
            } else if (err && !(err.message.includes('no such file or directory'))) {
                // console.log('some type of other error:' + err);
                reject(err);
            } else {
                // console.log(`${path} file path DOES exist. Deleting it`);
                await deleteStore(path);
                // console.log(`deleted ${path} file`);
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

describe('manage store of events', () => {
    describe('#createStore', () => {
        const testPath = './test/helpers/events-output.spec.csv';

        beforeEach(async () => {
            await deleteIfExists(testPath);
        });
        
        describe('when the file path does not exist already', () => {
            it('creates a new file with specified data', async () => {
                const data = 'blah';
                await createStore(testPath, data);
                
                const store = await readStore(testPath);
                expect(store).to.equal(data);
            });
        });

        describe('when a file path already exists', () => {
            it('overwrites the existing file with specified data', async () => {
                const existingData = 'existing data';
                await createStore(testPath, existingData);

                const newerData = 'newer data';
                await createStore(testPath, newerData);

                const store = await readStore(testPath);
                expect(store).to.equal(newerData);
            });
        });
    });
});