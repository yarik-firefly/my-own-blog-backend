import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const URL = "mongodb://localhost:27017/twitter";

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(URL)
      .then((client) => {
        console.log("Connect to MongoDB");
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
