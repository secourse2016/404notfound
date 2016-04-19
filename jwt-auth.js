var jwt = require('jwt-simple');
var jwtTokenSecret = 'CSEN603ROCKSi<8SE';


module.exports = function(req, res, next) {
  var token = (req.body && req.body.wt) || (req.query && req.query.wt) || req.headers['x-access-token'];
  if (token) {
    try {
      var decoded = jwt.decode(token, jwtTokenSecret);

      // handle token here
      next();
    } catch (err) {
      res.status(403);
      return res.send("Failed to authenticate");
    }
  } else {
    res.status(403);
    res.send("Failed Please provide access_token");
  }
};
