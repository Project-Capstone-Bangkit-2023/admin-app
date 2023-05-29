const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

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