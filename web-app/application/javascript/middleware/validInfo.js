module.exports = (req, res, next) => {
    const { email, firstName, lastName, password } = req.body;

    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      if (![email, firstName, lastName, password].every(Boolean)) {
        return res.send({
          success:false,
          message: 'Missing Credentials'
      }).status(401);
      } else if (!validEmail(email)) {
        return res.send({
          success:false,
          message: 'Invalid Email'
      }).status(401);
      }

    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.send({
          success:false,
          message: 'Missing Credentials'
      }).status(401);
      } else if (!validEmail(email)) {
        return res.send({
          success:false,
          message: 'Invalid Email'
      }).status(401);
      }
    }
  
    next();
  };