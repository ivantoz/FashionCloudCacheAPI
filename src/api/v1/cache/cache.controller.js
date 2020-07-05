const { generateTtl, generateRandomString, handleCacheLimit } = require('../../../utils/common')
const log = require('../../../logging')
const CacheModel = require('../../../models/cacheModel')

const getAll = async (req, res) => {
  const currentTime = new Date().getTime()
  const entries = await CacheModel.find({})
  const keys = await Promise.all(
    entries.map(async entry => {
      if (entry.get('ttl') < currentTime) {
        const newValue = generateRandomString()
        await entry.updateOne({
          value: newValue
        })

        return newValue
      }

      return entry.get('key')
    })
  )

  return res.json({
    data: keys,
    message: 'Cached keys retrieved successfully!'
  })
}

const get = async (req, res) => {
  const { key } = req.params
  console.log('key ==>',key)

  let cacheEntry = await CacheModel.findOne({
    key
  })
  if (!cacheEntry) {
    log.info('Cache miss')

    const randStr = generateRandomString()
    const result = await handleCacheLimit(key, randStr)
    if (!result) {
      cacheEntry = new CacheModel({
        key,
        value: randStr,
        ttl: generateTtl(),
        createdAt: new Date().getTime()
      })
      await cacheEntry.save()
    }

    return res.status(200).json({
      message: 'Key retrived successfully!',
      data: randStr
    })
  } else {
    log.info('Cache hit')
    await cacheEntry.updateOne({
      ttl: generateTtl()
    })

    return res.status(200).json({
      message: 'Key retrived successfully!',
      data: cacheEntry.get('value')
    })
  }
}

const createOrUpdate = async (req, res) => {
  const { key } = req.params
  const { value } = req.body

  let cacheModel = await CacheModel.findOne({ key })

  if (!cacheModel) {
    const result = await handleCacheLimit(key, value)
    if (!result) {
      cacheModel = new CacheModel({
        key,
        value,
        ttl: generateTtl(),
        createdAt: new Date().getTime()
      })
      await cacheModel.save()
    }

    return res.status(201).json({
      message: 'Key is added successfully!'
    })
  } else {
    await cacheModel.updateOne({
      value
    })

    return res.status(200).json({
      message: 'Key is updated successfully!'
    })
  }
}

const remove = async (req,res) => {
  const { key } = req.params
  if (!key) {
    return res.status(400).json({
      message: 'Key is not valid!'
    })
  }

  let cache = await CacheModel.findOne({
    key
  })
  if (!cache) {
    return res.status(404).json({
      message: 'Key is not found!'
    })
  }
  await CacheModel.deleteOne({ key })

  return res.status(200).json({
    message: 'Key removed successfully!'
  })
}

const flushAll = async (req, res) => {
  await CacheModel.deleteMany({}).exec()

  return res.status(200).json({
    message: 'All keys removed from cache successfully!'
  })
}


module.exports = {
  getAll,
  get,
  createOrUpdate,
  remove,
  flushAll
}