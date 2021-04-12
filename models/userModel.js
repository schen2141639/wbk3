const fs = require('fs');
const ObjectID = require('mongodb').ObjectID;
const {accountModel} = require('./accountModel.js');
const users = JSON.parse(fs.readFileSync('models/users.json', {encoding:'utf8', flag:'r'})).users;
const dbPromise = require("../server");
const userModel = {
  findOne: async (username, password) => {
    const db = await dbPromise.db;
    const user = await db.collection("client").findOne({username, password})
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${username}`);
  },
  findByUsername: (username) => {
    const user = users.find((user) => user.username == username);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with username: ${username}`);
  },
  findById: async (id) => {
    const db = await dbPromise.db;
    //const user =  users.find((user) => user.id === id);
    const user = await db.collection("client").findOne({_id: ObjectID(id)})
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  getUserAccount: async (username) => {
    const db = await dbPromise.db;
    const user = await db.collection("client").findOne({username})
    //const user = users.find((user) => user.username === username);
    return {
      "accountType":"Savings",
      "accountBalance":1194.33,
      "id": user.savings
    }
    //const account = accountModel.findOne(user.accountNumber, db);
    //return account
  }
};

module.exports = { userModel };
