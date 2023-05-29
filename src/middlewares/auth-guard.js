module.exports = (req, res, next) => {
  if (req.originalUrl.split('/')[1] == 'api') {
    next()
  } else {
    if (req.session.user) next()
    else res.redirect('/auth/login')
  }
}