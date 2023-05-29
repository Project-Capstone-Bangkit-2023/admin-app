const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.userId),
            },
        })
        res.json({
            status: 'success',
            user,
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'An error has occured.',
            error: err.message
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const data = await prisma.user.update({
            where: {
                id: Number(req.params.userId),
            },
            data: {
                location: req.body.location,
                age: req.body.age,
                cat_pref: req.body.cat_pref,
            }
        })
        res.json({
            status: 'success',
            message: 'Profile Updated',
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