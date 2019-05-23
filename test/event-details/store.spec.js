const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');
const sinon = require('sinon');

const createStore = require('../../src/event-details/store').createStore;

describe('manage store of events', () => {
    describe('#createStore', () => {
        const testPath = './test/helpers/events-output.spec.csv';

        it('calls fs.writeFile with the correct filepath and data', async () => {
            const data = 'blah';
            
            const writeFileStub = sinon.stub(fs, 'writeFile');
            writeFileStub.yields();
            
            await createStore(fs, testPath, data);
            
            expect(writeFileStub.calledOnce).to.be.true;
            
            expect(writeFileStub.getCall(0).args[0]).to.equal(testPath);
            expect(writeFileStub.getCall(0).args[1]).to.equal(data);
            expect(writeFileStub.getCall(0).args[2]).to.be.a('function');

            writeFileStub.restore();
        });

        describe('when fs.writeFile is successful', () => {
            it('returns a resolved promise with no defined value', async () => {
                const data = 'blah';
                const writeFileStub = sinon.stub(fs, 'writeFile');

                writeFileStub.yields();
                
                const returnValue = await createStore(fs, testPath, data);
                expect(returnValue).to.equal(undefined);

                writeFileStub.restore();
            });
        });
        
        describe('when fs.writeFile is unsuccessful', () => {
            it('returns a rejected promise with the error', async () => {
                const data = 'blah';
                const writeFileStub = sinon.stub(fs, 'writeFile');

                const fakeError = new Error('writeFile failed');
                
                writeFileStub.yields(fakeError);

                try {
                    await createStore(fs, testPath, data);
                } catch (error) {
                    expect(error).to.eql(fakeError);
                }

                writeFileStub.restore();
            });
        });
    });
});
