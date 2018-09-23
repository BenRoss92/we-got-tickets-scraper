var chai = require('chai');
const expect = chai.expect;

describe('Check mocha & async/await works', function () {
  it("resolves a promise successfully using async/await and asserts result", async () => {
    var testPromise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('I should be first');
        resolve("Hello World!");
      }, 1000);
    });

    var result = await testPromise;
    console.log('I should be second');
    
    expect(result).to.equal('Hello World!');
  });
});