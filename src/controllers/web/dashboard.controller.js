const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.index = async (req, res) => {
    try {
        const countUsers = prisma.user.count();
        const countPlaces = prisma.tourism.count();
        const countCities = prisma.tourism.findMany({
            distinct: ['city'],
            select: {
                city: true
            }
        });
        const count = await Promise.all([countUsers, countPlaces, (await countCities).length]);
        const data = {
            user: count[0],
            place: count[1],
            city: count[2],
        }
        res.render('dashboard/index', { data })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'An error has occured.',
            error: err.message
        })
    }
}
