const crypto = require("crypto");
// crypto is built in to node to provide cryptographic functionality

function nextId() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = nextId;


/* This is a utility module that generates a unique identifier for a new dish or a new order.  

what is `crypto`? it is a module in Node.js, and man this documentation sucks.  

apparently `crypto` creates a random byte sequence and then converts it into a hexadecimal string...whatever that means.  it makes a unique identifier, moving on */