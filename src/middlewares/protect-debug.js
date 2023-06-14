module.exports = (req, res, next) => {
  if (process.env.NODE_ENV == 'development') {
    next()
  } else {
    res.status(400).json({
      status: 'error',
      message: 'Not in development mode'
    })
  }
}