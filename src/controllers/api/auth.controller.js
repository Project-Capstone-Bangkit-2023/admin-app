const { sign, decode } = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const generateJwtToken = async user => {

    // Payload jwt
    const jwtTokenPayload = {
        name: user.name,
        email: user.email,
        location: user.location,
        age: user.age,
        cat_pref: user.cat_pref
    };

    //   Sign token
    return sign(jwtTokenPayload, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || '60d',
    });
};

// Verify token
exports.verifyToken = async (req, res) => {
    return res.json({
        status: 'success',
        message: 'Token verified successfully',
    });
};

// Login
exports.login = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(422).json({
            status: 'fail',
            message: 'Email required !',
        });
    }
    //   Find user
    const user = await prisma.user.findFirst({
        where: {
            email: email,
        }
    });

    if (user != null && email == user.email) {
        const token = await generateJwtToken(user);
        res.json({
            status: 'success',
            message: 'Login succeed',
            data: { token },
        });
    } else {
        res.status(400).json({
            status: 'fail',
            message: 'Email is not registered!',
        });
    }
};

// Register
exports.register = async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                location: req.body.location,
                age: req.body.age,
                cat_pref: req.body.cat_pref,
            },
        });
        const token = await generateJwtToken(registerUser);
        res.json({
            status: 'success',
            message: 'Register succeed',
            data: { token, user },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'An error has occured.',
            error: err.message
        })
    }
}

// Refresh token
exports.refreshToken = async (req, res) => {
    const { exp: expiredTime, id: userId } = decode(
        req.headers.authorization.split(' ')[1]
    );

    if (Date.now() >= expiredTime * 1000) {
        return res.status(403).json({
            status: 'fail',
            message: 'Token is expired',
        });
    }

    //   Find user
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    const newJwtToken = generateJwtToken(user);

    return res.json({
        status: 'success',
        message: 'New token has been issued',
        data: { token: newJwtToken },
    });
};
