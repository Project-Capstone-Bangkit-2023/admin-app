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