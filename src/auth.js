const jwt = require('jsonwebtoken');
const db = require("./services/firebase").firestore;

const USERDB = "psnext_users";

const requireAuth = async (req, res, next)=>{
  const bearerToken = req.get('Authorization');
  const APIKEY = req.get('X-API-KEY');
  if (!APIKEY && !bearerToken) {
    return res.status(401).send();
  }

  if (bearerToken) {
    const jwtToken=bearerToken.split(' ')[1];
    const jwtData = jwt.verify(jwtToken, req.app.config.jwtSecret);
    req.userid = jwtData.data;
    return next();
  }
}

const requireUser = async (req, res, next)=>{
  await requireAuth(req, res, async ()=>{
    try{
      const uref=db().collection(USERDB).doc(req.userid);
      const snapshot = await uref.get();
      req.user = snapshot.data();
      next();
    } catch(ex) {
      next(ex);
    }
  })
}

module.exports = {
  requireAuth,
  requireUser,
}