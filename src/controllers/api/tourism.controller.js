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
        tourism_id: '',
        user_id: '',
        rating: '',
        review: '',
      }
    })
    res.json({
      status: 'success',
      data: req.body
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
        id: '',
      },
      data: {
        tourism_id: '',
        user_id: '',
        rating: '',
        review: '',
      }
    })
  } catch (err) {

  }
}