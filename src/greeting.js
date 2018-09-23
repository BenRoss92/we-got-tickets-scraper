const sayGreeting = (name) => {
  console.log(`Welcome to Babel ${name}!`);
}

function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function asyncCall() {
  console.log('calling');
  const result = await resolveAfter2Seconds();
  console.log(result);
  // expected output: 'resolved'
}

module.exports.sayGreeting = sayGreeting;
module.exports.asyncCall = asyncCall;