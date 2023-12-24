const mongoose = require('mongoose');
const redis = require('redis')
const util = require('util');


const redisUrl = 'redis://127.0.0.1:6379'

const client = redis.createClient(redisUrl)

client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options.key || '')

  return this // to make it chainnable
}

mongoose.Query.prototype.exec = async function () {
  // this; // refernce to the query being produced

  if (!this.useCache) {
    return exec.apply(this, arguments)
  }


  console.log('Im About to run Query')
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  })) // so we dont change the reference

  const cacheValue = await client.hget(this.hashKey, key)

  if (cacheValue) {

    const doc = JSON.parse(cacheValue)

    return Array.from(doc) ? doc.map(d => new this.model(d)) : this.model(doc) // to convert every fetched data into mongodb document

    // return JSON.parse(cacheValue) // now this is  plain javascript object have no function attached
  }

  const result = await exec.apply(this, arguments) // same copy that we havent messed around

  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10) // expiry date

  return result

}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey))
  }
}