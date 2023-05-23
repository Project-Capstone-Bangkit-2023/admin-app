const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gmail.com',
      role: "admin",
      password: await bcrypt.hash('1234', 10)
    },
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