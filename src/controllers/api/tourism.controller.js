const path = require('path')
const tf = require('@tensorflow/tfjs-node')
const { PrismaClient } = require('@prisma/client')
const { decode } = require('jsonwebtoken');

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

  const user = decode(
    req.headers.authorization.split(' ')[1]
  );
  const rawTourisms = prisma.tourism.findMany()
  const dataTourism = prisma.$queryRaw`SELECT 
    (CASE WHEN tourisms.category = "Budaya" THEN 1 ELSE 0 END) AS "Budaya",
    (CASE WHEN tourisms.category = "Taman Hiburan" THEN 1 ELSE 0 END) AS "Taman Hiburan",
    (CASE WHEN tourisms.category = "Cagar Alam" THEN 1 ELSE 0 END) AS "Cagar Alam",
    (CASE WHEN tourisms.category = "Bahari" THEN 1 ELSE 0 END) AS "Bahari",
    (CASE WHEN tourisms.category = "Pusat Perbelanjaan" THEN 1 ELSE 0 END) AS "Pusat Perbelanjaan",
    (CASE WHEN tourisms.category = "Tempat Ibadah" THEN 1 ELSE 0 END) AS "Tempat Ibadah",
    tourisms.rating,
    COUNT(tourism_ratings.rating)
    
    FROM tourisms
    INNER JOIN tourism_ratings
    ON tourism_ratings.tourism_id = tourisms.id
    
    GROUP BY tourisms.id;`

  const dataUser = prisma.$queryRaw`SELECT 
    COALESCE(MAX(IF(category = "Budaya",  average, null)), 3) AS "Budaya",
    COALESCE(MAX(IF(category = "Taman Hiburan",  average, null)), 3) AS "Taman Hiburan",
    COALESCE(MAX(IF(category = "Cagar Alam",  average, null)), 3) AS "Cagar Alam",
    COALESCE(MAX(IF(category = "Bahari", average, null)), 3) AS "Bahari",
    COALESCE(MAX(IF(category = "Pusat Perbelanjaan", average, null)), 3) AS "Pusat Perbelanjaan",
    COALESCE(MAX(IF(category = "Tempat Ibadah", average, null)), 3) AS "Tempat Ibadah"
      
      
    FROM (SELECT tourism_ratings.user_id, tourisms.category, AVG(tourism_ratings.rating) as average
        FROM tourisms
        INNER JOIN tourism_ratings
        ON tourism_ratings.tourism_id = tourisms.id
        
        WHERE tourism_ratings.user_id = ${user.id}
            
        GROUP BY tourisms.category) AS user_avg
        
    GROUP BY user_id;`

  const [tourisms, resultUser, rawTourismsArr] = await Promise.all([dataTourism, dataUser, rawTourisms])

  let newUser = []

  for (let i = 0; i < tourisms.length; i++) {
    const val = Object.values(resultUser[0])
    val[2] = (val[2] - 3) / 2
    newUser.push(val)
  }

  const resultTourism = tourisms.map(d => {
    const val = Object.values(d)
    val[6] = (val[6] - 3) / 2
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