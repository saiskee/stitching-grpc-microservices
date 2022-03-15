'use strict';

function middleware(handler) {
  return (call, callback) => {
    console.log("Got request: ", JSON.stringify(call.request));
    let res = handler(call.request);
    console.log("Responding with response: ", JSON.stringify(res));
    callback(null, res);
  };
}

module.exports = {
  middleware
};