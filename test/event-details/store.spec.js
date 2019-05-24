const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');
const sinon = require('sinon');

const createStore = require('../../src/event-details/store').createStore;
const appendStore = require('../../src/event-details/store').appendStore;

describe('manage store of events', () => {
    const testPath = './test/helpers/events-output.spec.csv';
    
    describe('#createStore', () => {
        const data = 'blah';

        let writeFileStub;

        beforeEach('stub the fs.writeFile method with no behaviour', () => {
            writeFileStub = sinon.stub(fs, 'writeFile');
        });

        afterEach('remove the fs.writeFile stub (from our default sandbox)', () => {
            writeFileStub.restore();
        });

        it('calls fs.writeFile with the correct filepath and data', async () => {
            writeFileStub.yields();
            
            await createStore(fs, testPath, data);
            
            expect(writeFileStub.calledOnce).to.be.true;
            
            expect(writeFileStub.getCall(0).args[0]).to.equal(testPath);
            expect(writeFileStub.getCall(0).args[1]).to.equal(data);
            expect(writeFileStub.getCall(0).args[2]).to.be.a('function');
        });

        describe('when fs.writeFile is successful', () => {
            it('returns a resolved promise with no defined value', async () => {
                writeFileStub.yields();
                
                const returnValue = await createStore(fs, testPath, data);
                expect(returnValue).to.equal(data);
            });
        });
        
        describe('when fs.writeFile is unsuccessful', () => {
            it('returns a rejected promise with the error', async () => {
                const writeError = new Error('writeFile failed');
                
                writeFileStub.yields(writeError);

                try {
                    await createStore(fs, testPath, data);
                } catch (error) {
                    expect(error).to.eql(writeError);
                }
            });
        });
    });

    describe('#appendStore', () => {
        const csvString = 'Puppy, Leeds \n Radiohead, London';

        let appendFileStub;

        beforeEach(() => {
            appendFileStub = sinon.stub(fs, 'appendFile');
        });

        afterEach(() => {
            appendFileStub.restore();
        });

        it('calls fs.appendFile with the correct filepath and data', async () => {
            appendFileStub.yields();

            await appendStore(fs, testPath, csvString);

            expect(appendFileStub.calledOnce).to.be.true;
            
            expect(appendFileStub.getCall(0).args[0]).to.equal(testPath);
            expect(appendFileStub.getCall(0).args[1]).to.equal(csvString);
            expect(appendFileStub.getCall(0).args[2]).to.be.a('function');
        });

        describe('when fs.appendFile is successful', () => {
            it('returns a resolved promise with the appended data', async () => {
                appendFileStub.yields();
    
                const result = await appendStore(fs, testPath, csvString);
                
                expect(result).to.equal(csvString);
            });
        });

        describe('when fs.appendFile is unsuccessful', () => {
            it('returns a rejected promise with the error', async () => {
                const appendError = new Error('appendFile failed');

                appendFileStub.yields(appendError);

                try {
                    await appendStore(fs, testPath, csvString)
                } catch (error) {
                    expect(error).to.eql(appendError);
                }
            });
        });
    });
});
