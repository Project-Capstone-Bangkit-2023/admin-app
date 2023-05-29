exports.onServerListening = port => (() => {
  console.log(`Listening on ${port}`)
})

exports.onRouteNotFound = () => ((req, res, next) => {
  if (req.xhr || req.accepts(['html', 'json']) == 'json') {
    res.status(404).json({
      message: 'The endpoint you are looking is in not found',
    })
  } else {
    res.send('404 Page Not Found')
  }
})

exports.onGlobalErrorHandler = () => ((err, req, res, next) => {
  console.log('Ouch, an error was happened', err)
  res.status(500).json({
    message: err.message || 'No error message'
  })
})