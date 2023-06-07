const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: {
            equals: 'admin'
          }
        }
      }
    })
    res.render('user/index', {
      users
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