'use strict';
var PROTO_PATH = __dirname + "/user.proto";
const Mali = require("mali")
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var grpcReflection = require('grpc-server-reflection');
var users = require("./users.json")
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

var userService = grpc.loadPackageDefinition(packageDefinition).user;

function main() {
  var Server = new grpc.Server();
  grpcReflection.addReflection(Server, "./proto_bin/user.proto.bin");
  Server.addService(userService.UserService.service, {
    getUser: utils.middleware((req) => {
      if (req.username) {
        return users.find(user => user.username === req.username);
      }
      return {};
    }),
    getUserByCountry: utils.middleware((req) => {
      if (req.country_code) {
        let user = users.filter(user => user.country_code === req.country_code);
        return {users: user}
      }
      return []
    }),
  })
  
  Server.bindAsync('0.0.0.0:8080', grpc.ServerCredentials.createInsecure(), () => {
    Server.start();
  });
}

main();