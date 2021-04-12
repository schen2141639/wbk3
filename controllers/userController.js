const userModel = require("../models/userModel").userModel;
const accountModel = require("../models/accountModel").accountModel;

const getUserByEmailIdAndPassword = async (email, password) => {
  let user = await userModel.findOne(email, password);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};
const getUserById = async (id) => {
  let user = await userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  return user.password === password;
}
const findOrCreate = (profile, cb) => {
  const user = userModel.findByGithubId(profile.id);
  if(!user) {
    userModel.addUser({...profile, githubId: profile.id})
    return cb(null, profile)
  }
  return cb(null, user)
}
const getUserAccount = async (accountNumber,req) => {
  return userModel.getUserAccount(accountNumber, req.app.locals.db);
}

const getAccountDetails = (accountNumber) => {
  return accountModel.findOne(accountNumber)
}

const createAccount = (body) => {
  return accountModel.createAccount(body);
}
module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  findOrCreate,
  getUserAccount,
  getAccountDetails,
  createAccount
};
