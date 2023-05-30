const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getTourisms = async (req, res) => {
  try {
    const tourism = await prisma.tourism.findMany({
      include: {
        tourism_rating: true
      },
    })
    const data = tourism.map((tourism) => ({
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
        id: Number(req.params.tourismId),
      },
      data: {
        rating: parseFloat(req.body.rating),
        review: req.body.review,
      }
    })
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