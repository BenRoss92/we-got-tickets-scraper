const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');
const sinon = require('sinon');

const createStore = require('../../src/event-details/store').createStore;

describe('manage store of events', () => {
    describe('#createStore', () => {
        const testPath = './test/helpers/events-output.spec.csv';

        it('calls fs.writeFile with the correct filepath and data', async () => {
            // Given
            // a test path
            // some data
            const data = 'blah';
            const writeFileStub = sinon.stub(fs, 'writeFile');

            // N.B. must call `yields` - this causes the writeFileStub to execute the (first) callback it receives - i.e. our custom callback which rejects/resolves the promise.
            // You can provide an argument to this callback - i.e. a value for `err`, if you want to replicate what happens when writeFile fails with an error.
            // - e.g. writeFileStub.yields(new Error("oh poopies!"));
            writeFileStub.yields();
            
            // When
            // calling createStore
            // and the writeFile's callback does not receive an error object 
            
            const returnValue = await createStore(fs, testPath, data);
            
            // Then
            
            // check that `writeFile` method on `fs` object (is an object, not a function) was called once.
            expect(writeFileStub.calledOnce).to.be.true;
            
            // check that `writeFile` method on `fs` object (is an object, not a function) received the correct arguments - i.e. a file path, the same data passed into #createStore (or instead, that the csv headers have  if const headerString = formatHeaders(headers);) and a callback function with no arguments.
            expect(writeFileStub.getCall(0).args[0]).to.equal(testPath);
            expect(writeFileStub.getCall(0).args[1]).to.equal(data);
            // N.B. NOT STRICT ENOUGH:
                // expect(writeFileStub.calledWith(testPath, data)).to.be.true;
            
            writeFileStub.restore();
        });

        describe('when fs.writeFile is successful', () => {
            it('returns a resolved promise with no defined value', async () => {
                // Given
                // a test path
                // some data
                const data = 'blah';
                const writeFileStub = sinon.stub(fs, 'writeFile');

                // N.B. must call `yields` - this causes the writeFileStub to execute the (first) callback it receives - i.e. our custom callback which rejects/resolves the promise.
                // You can provide an argument to this callback - i.e. a value for `err`, if you want to replicate what happens when writeFile fails with an error.
                // - e.g. writeFileStub.yields(new Error("oh poopies!"));
                writeFileStub.yields();
                
                // When
                // calling createStore
                // and the writeFile's callback does not receive an error object 
                
                const returnValue = await createStore(fs, testPath, data);
                
                // Then
                // check that createStore returns a resolved promise (with no value)
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
