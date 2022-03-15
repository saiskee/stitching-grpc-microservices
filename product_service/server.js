'use strict';
var PROTO_PATH = __dirname + "/product.proto";
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var grpcReflection = require('grpc-server-reflection');
var products = require("./products.json")
var utils = require("../utils/utils.js");
const Fuse = require('fuse.js');

var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

var productService = grpc.loadPackageDefinition(packageDefinition).product;
var productFuse = new Fuse(products, 
  {keys: ['name'],
  threshold: 0.2,})
function main() {
  var Server = new grpc.Server();
  grpcReflection.addReflection(Server, "./proto_bin/product.proto.bin");
  Server.addService(productService.ProductService.service, {
    getProduct: utils.middleware((req) => {
      if (req.id != 0) {
        return products.find(product => product.id == req.id);
      }
      if (req.name) {
        var results = productFuse.search(req.name);
        if (results.length > 0) {
          return results[0].item;
        }
      }
      return {};
    }),
    getProducts: utils.middleware((req) => {
      let ret = {};
      if (req.name) {
        var results = productFuse.search(req.name);
        ret['products'] = results.map(result => result.item);
      }
        return ret;
    }),
    getProductsSoldByUser: utils.middleware((req) => {
      let ret = {}
      if (req.username) {
        ret['products'] = products.filter(product => product.seller.username === req.username);
      }
      return ret;
    }),
  })

  Server.bindAsync('0.0.0.0:8080', grpc.ServerCredentials.createInsecure(), () => {
    Server.start();
  });
}

main();