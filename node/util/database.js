const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  // mongodb://[root_user_name]:[root_user_pass]@[service name]:[port=27017]/
  MongoClient.connect('mongodb://test:pass@mongo:27017/')
    .then((client) => {
      console.log('connected!');
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
