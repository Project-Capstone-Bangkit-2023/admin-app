const path = require('path')
const tf = require('@tensorflow/tfjs-node')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const updateAvgRatingOnTourism = async tourism_id => {
  const avgRating = await prisma.tourismRating.aggregate({
    _avg: {
      rating: true
    }
  })
  await prisma.tourism.update({
    where: {
      id: Number(tourism_id),
    },
    data: {
      rating: parseFloat(avgRating._avg.rating)
    }
  })
}

exports.getRecommendations = async (req, res) => {

  const rawTourisms = tf.data.csv(`file://${path.resolve(__dirname, 'tourisms.csv')}`) // <-- Ambil data dari database
  const dataTourism = tf.data.csv(`file://${path.resolve(__dirname, 'data.csv')}`) // <-- Ambil data dari database
  const dataUser = tf.data.csv(`file://${path.resolve(__dirname, 'user.csv')}`) // <-- Ambil data dari database

  const [ tourisms, resultUser, rawTourismsArr ] = await Promise.all([dataTourism.toArray(), dataUser.toArray(), rawTourisms.toArray()])

  let newUser = []

  for (let i = 0; i < tourisms.length; i++) {
    const val = Object.values(resultUser[0])
    val[2] = (val[2] - 3) / 2
    newUser.push(val)
  }

  const resultTourism = tourisms.map(d => {
    const val= Object.values(d)
    val[6] = (val[6]-3) / 2
    val[7] = val[6] / 50
    return val
  })

  const model = await tf.loadLayersModel(`file://${path.resolve(__dirname, 'models', 'model.json')}`)
  const inputTf = tf.tensor2d(newUser, [newUser.length, newUser[0].length])
  const inputTf2 = tf.tensor2d(resultTourism, [resultTourism.length, resultTourism[0].length])
  const output = model.predict([inputTf, inputTf2])
  const values = output.dataSync()
  const arr = Array.from(values)
  const sortedArr = Array.from(arr.keys()).sort((a, b) => arr[a] - arr[b])

  for (let i = 0; i < 10; i++) {
    console.log(rawTourismsArr[sortedArr[i]])
  }
}

exports.getTourisms = async (req, res) => {
  try {
    const searchQuery = {
      include: {
        tourism_rating: true
      },
    }
    if (req.query.q) {
      searchQuery.where = {
        name: {
          search: req.query.q
        }
      }
    }
    let data = await prisma.tourism.findMany(searchQuery)
    data = data.map((tourism) => ({
      id: tourism.id,
      name: tourism.name,
      picture: tourism.picture,
      description: tourism.description,
      category: tourism.category,
      city: tourism.city,
      price: tourism.price,
      rating: tourism.rating,
      latitude: tourism.latitude,
      longitude: tourism.longitude,
      countRating: tourism.tourism_rating.length,
      created_at: tourism.created_at,
      updated_at: tourism.updated_at,
    }));
    res.json({
      status: 'success',
      data,
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message
    })
  }
}

exports.getTourism = async (req, res) => {
  try {
    const tourism = await prisma.tourism.findUnique({
      where: {
        id: Number(req.params.tourismId)
      },
      include: {
        tourism_rating: {
          include: {
            user: true
          }
        }
      }
    })
    res.json({
      status: 'success',
      tourism,
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message
    })
  }
}

exports.createRating = async (req, res) => {
  try {
    const data = await prisma.tourismRating.create({
      data: {
        tourism_id: Number(req.body.tourism_id),
        user_id: Number(req.body.user_id), // Should get from token
        rating: parseFloat(req.body.rating),
        review: req.body.review,
      }
    })
    await updateAvgRatingOnTourism(req.body.tourism_id)
    res.json({
      status: 'success',
      message: 'Review Created',
      data,
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message
    })
  }
}

exports.updateRating = async (req, res) => {
  try {
    const data = await prisma.tourismRating.update({
      where: {
        id: Number(req.params.reviewId),
      },
      data: {
        rating: parseFloat(req.body.rating),
        review: req.body.review,
      }
    })
    await updateAvgRatingOnTourism(data.tourism_id)
    res.json({
      status: 'success',
      message: 'Review Updated',
      data,
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message
    })
  }
}