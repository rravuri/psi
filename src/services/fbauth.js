const { auth, db } = require("./firebase");

const USERDB = "psnext_users";

const readAuth = async (req, _res, next)=>{
  if (req.headers.authorization) {
    const authparts = req.headers.authorization.split(' ');
    if (authparts.length<2) {
      return next();
    }

    if (authparts[0]!=='Bearer') {
      return next();
    }

    try {
      const decodedToken = await auth().verifyIdToken(authparts[1]);
      req.token = decodedToken;
      req.uid = decodedToken.uid;
      req.auser = await auth().getUser(req.uid); 
      next();
    } catch(e) {
      next()
    }
  } else {
    next();
  }
}

const requireAuth = async (req, res, next)=>{
  if (req.uid) {
    return next();
  } else {
    readAuth(req, res, ()=>{
      if (req.uid) return next();
      res.status(403).send('Unauthorized.');
    });
  }
}

const requireUser = async (req, res, next)=>{
  await requireAuth(req, res,async ()=>{
    const uref=db().collection(USERDB).doc(req.uid);
    const snapshot = await uref.get();
    req.user = snapshot.data();
    next();
  })
}

module.exports ={
  requireUser,
  readAuth,
  requireAuth,
}