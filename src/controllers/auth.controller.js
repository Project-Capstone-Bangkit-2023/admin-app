const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const { authLoginValidator } = require('./../utils/form-validators')

const prisma = new PrismaClient()

exports.index = (req, res) => {
  res.render('login', {
    layout: 'auth.handlebars'
  })
}

exports.login = async (req, res) => {
  if (!authLoginValidator(req)) {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      }
    })
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = user
      req.session.save(() => {
        res.redirect('/')
      })
    } else {
      res.send("Failed")
    }
  } else {
    res.send("Failed")
  }
}