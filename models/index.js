const mongo = require("mongodb");
const MongoClient = mongo.MongoClient
const dbs = {}
const connectionUri = "mongodb+srv://dbuser:dbuserpass@cluster0.onw0x.mongodb.net/bankingDb?retryWrites=true&w=majority"

// Connect to Mongo
const main = async() => {
  const db = await initDb()
  dbs["banking"] = db
  return db
}
const initDb = async() => {
  const client = await MongoClient.connect(connectionUri, {
    useNewUrlParser: true,
    ignoreUndefined: true,
    useUnifiedTopology: true
  })
  const db = client.db()
  return db
}

module.exports = {
  main
}