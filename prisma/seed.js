const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  await prisma.$queryRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE tourism_ratings;');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE tourisms;');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE categories;');
  await prisma.$queryRawUnsafe('TRUNCATE TABLE users;');
  await prisma.$queryRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  const tourismCategories = await prisma.category.createMany({
    data: [
      {name: "Budaya"},
    ]
  })
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Administrator",
        email: "admin@gmail.com",
        password: await bcrypt.hash('1234', 10),
        role: "admin",
        location: "Surabaya",
        age: 24,
        cat_pref: null
      },
      {
        name: "Dimas Anggara",
        email: "dimaspr@gmail.com",
        password: null,
        role: "user",
        location: "Surabaya",
        age: 24,
        cat_pref: null
      },
    ]
  })
  const tourism = await prisma.tourism.createMany({
    data: [
      {
        name: "Pantai Pulau Merah",
        picture: "default.png",
        description: "lorem ipsum dolor sit amet...",
        category: "Budaya",
        city: "Banyuwangi",
        price: 10000,
        rating: 4.0,
        latitude: "-8.598217800105868",
        longitude: "114.0294394906533"
      },
    ]
  })
  const tourismRating = await prisma.tourismRating.createMany({
    data: [
      {
        tourism_id: 1,
        user_id: 2,
        rating: 4.0,
        review: "Bagus bangettt"
      },
    ]
  })
}

main().then(async () => {
  await prisma.$disconnect()
})
.catch(async e => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})