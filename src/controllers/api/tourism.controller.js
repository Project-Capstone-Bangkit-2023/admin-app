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

  } catch (err) {

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