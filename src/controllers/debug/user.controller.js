const { PrismaClient } = require('@prisma/client')
const { fakerID_ID } = require('@faker-js/faker')

const prisma = new PrismaClient()

exports.populateDummyUser = async (req, res) => {
  const userArr = []
    
    for (let i = 0; i < 1000; i++) {
      const usr = fakerID_ID.helpers.multiple(() => ({
        id: i + 1,
        name: fakerID_ID.person.fullName(),
        email: fakerID_ID.internet.email(),
        role: 'user',
        location: fakerID_ID.location.city(),
        age: fakerID_ID.number.int({ min: 10, max: 35}),
      }), {
        count: 1
      })

      userArr.push(usr[0])
    }

    await prisma.user.createMany({
      data: userArr
    })

    // prisma.user.

    res.json({
      status: 'success',
      message: 'OK',
    })
}