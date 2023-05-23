exports.authLoginValidator = (req) => {
  if (!req.body.email || !req.body.password) {
    return "Email / Password Required"
  } else {
    return ""
  }
}