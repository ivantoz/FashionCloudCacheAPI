const CacheModel = require('../models')

const cacheEntryConfig = {
  ttl: (process.env.TTL_IN_MINS || 60),
  maxNumberOfEntries: (process.env.MAX_NUMBER_OF_ENTIRES || 10) 
}

const generateRandomString = () => {
  return Math.random().toString(36).substring(7)
  
}

const generateTtl = () => {
  const newDate = new Date()
  newDate.setMinutes(newDate.getMinutes() + cacheEntryConfig.ttl)

  return newDate.getTime()
}

const  handleCacheLimit = async (key,value) => {
  const count = await CacheModel.countDocuments()
  if (count < cacheEntryConfig.maxNumberOfEntries) {
    return false
  }

  const entry = await CacheModel.find({})
    .sort({
      ttl: 1,
      createdAt: 1
    })
    .findOne()
    .exec()
  if (!entry) {
    return false
  }

  await entry.updateOne({
    key,
    value,
    ttl: generateTtl(),
    createdAt: new Date().getTime()
  })

  return true
  
}

module.exports = {
  generateTtl,
  generateRandomString,
  handleCacheLimit,
}
