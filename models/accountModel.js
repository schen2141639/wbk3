const fs = require('fs');
const accounts = JSON.parse(fs.readFileSync('models/accounts.json', {encoding:'utf8', flag:'r+'}));

function makeId(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const accountModel = {
  findOne: (accountNumber, db) => {
    // db.collection("client").findOne({username: "tom@beatles.uk"}, function(err, res){
    //   console.log(err)
    //   console.log(res, "()()()()()()()()()()")
    // })
    const account = accounts[accountNumber]
    if (account) {
      return account;
    }
    throw new Error(`Couldn't find account with account Number: ${accountNumber}`);
  },
  depositMoney: (accountNumber, money) => {
    accounts[accountNumber].accountBalance += money
    accounts.lastID = accountNumber
    fs.writeFileSync("models/accounts.json", JSON.stringify(accounts), {encoding: 'utf8'})
  },
  withdrawMoney: (accountNumber, money) => {
    if (+accounts[accountNumber].accountBalance > money) {
        accounts[accountNumber].accountBalance = +accounts[accountNumber].accountBalance - money
        accounts.lastID = accountNumber
    } else {
        throw new Error(`Not enough money in the account`);
    }
    fs.writeFileSync("models/accounts.json", JSON.stringify(accounts), {encoding: 'utf8'})
  },
  createAccount: (body) => {
    const id = makeId(7)
    accounts[id] = {
      accountType: body.typeOfAccount,
      accountBalance: 0
    }
    fs.writeFileSync("models/accounts.json", JSON.stringify(accounts), {encoding: 'utf8'})
    return {
      accountNumber: id,
      ...accounts[id]
    }
  }
};

module.exports = { accountModel };