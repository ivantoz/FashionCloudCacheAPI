const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CacheModel = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: String,
    required: true
  },
  ttl: {
    type: Number
  },
  createdAt: {
    type: Number
  }
})

module.exports = Cache = mongoose.model('cache', CacheModel)

// export default mongoose.model('cacheModels', CacheModel)
