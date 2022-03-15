'use strict';
var PROTO_PATH = __dirname + "/review.proto";
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var grpcReflection = require('grpc-server-reflection');
var reviews = require("./reviews.json")
var utils = require("../utils/utils.js");

var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

var reviewService = grpc.loadPackageDefinition(packageDefinition).review;
function main() {
  var Server = new grpc.Server();
  grpcReflection.addReflection(Server, "./proto_bin/review.proto.bin");
  Server.addService(reviewService.ReviewService.service, {
    getReviewsForProduct: utils.middleware((req) => {
      let ret = {};
      if (req.product_id != 0) {
        ret['reviews'] = reviews.filter(review => review.product_id.id == req.product_id);
      }
      return ret;
    }),
  })

  Server.bindAsync('0.0.0.0:8080', grpc.ServerCredentials.createInsecure(), () => {
    Server.start();
  });
}

main();