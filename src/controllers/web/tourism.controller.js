const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getTourisms = async (req, res) => {
  try {
    const tourisms = await prisma.tourism.findMany()
    res.render('tourism', {
      tourisms,
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message
    })
  }
}

exports.createTourism = async (req, res) => {
  
}