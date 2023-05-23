module.exports = app => {
  app.get('/auth/login', (req, res) => {
    res.render('login', {
      layout: 'auth.handlebars'
    })
  })
}