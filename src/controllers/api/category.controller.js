const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getTourismCategories = async (req, res) => {
    try {
        const category = await prisma.category.findMany()
        res.json({
            status: 'success',
            category,
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'An error has occured.',
            error: err.message
        })
    }
}