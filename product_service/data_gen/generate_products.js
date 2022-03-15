'use strict'
const {faker} = require('@faker-js/faker');
const users = require("../../user_service/users.json")

// generate 100 random products
const products = [];
for (let i = 0; i < 100; i++) {
  products.push({
    id: i + 1,
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    seller: {username: faker.helpers.randomize(users).username},
  });
}

console.log(JSON.stringify(products));