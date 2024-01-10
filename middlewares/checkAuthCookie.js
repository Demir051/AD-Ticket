const checkAuthCookie = (req, res, next) => {
  const authToken = req.cookies.authToken;
  res.locals.authToken = authToken; // Add this line to expose authToken to EJS templates
  next();
};

module.exports = checkAuthCookie;