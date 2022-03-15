'use strict'
const {faker} = require('@faker-js/faker');
const users = require("../../user_service/users.json")
const products = require("../../product_service/products.json")

// generate 100 random products
const reviews = [];
for (let i = 0; i < 1000; i++) {
  reviews.push({
    id: i + 1,
    product_id: {id: faker.helpers.randomize(products).id},
    // random rating
    rating: faker.random.number({min: 1, max: 5}),
    // random review
    content: faker.lorem.sentence(),
    // random user
    author: {username: faker.helpers.randomize(users).username},
  });
}

console.log(JSON.stringify(reviews));