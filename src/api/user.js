
const express = require('express');
const uuid = require('uuid').v4;
const jwt = require('jsonwebtoken');
const {requireUser} = require('../auth.js');

const user = express.Router();

/**
 *@openapi
 *components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - id
 *      properties:
 *        email:
 *          description: Email of the user.
 *          type: string
 *          example: johndoe@example.com
 *        id:
 *          description: Unique id of the user.
 *          type: string
 *          example: b970eDF59wk757365
 */

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *     - user
 *     description: Register a new user by email
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "email of the user that needs to be registered"
 *       required: true
 *       schema:
 *         type: "object"
 *         required:
 *         - "email"
 *         properties:
 *           email:
 *             type: "string"
 *             example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Success in sending a registration email.
 *       400:
 *         description: Bad content in body
 */
user.post('/register', async function(req, res){
  const {log, db, mailer}=req.app;
  let {email} = req.body||{};
  if(email===undefined) {
    return res.status(400).json({error:'Invalid email.'});
  }
  email = email.trim().toLowerCase();

  const aidx = email.indexOf('@');
  if (email==='' || aidx===-1) {
    return res.status(400).json({error:'Invalid email.'});
  }

  const token = uuid();
  try {
    let usersRef=db().collection('/psnext_users');

    let snapshot = await usersRef.where("email","==",email).limit(1).get();

    if (snapshot.empty) {
      const result = await usersRef.add({
        email: email,
        created_at: db.FieldValue.serverTimestamp()
      });
      console.log('Added user with ID: ', result.id);
      snapshot = await usersRef.where("email","==",email).limit(1).get();
    }

    const userRef = snapshot.docs[0].ref;

    await db().collection('psnext_tokens').add({
      token,
      uid: snapshot.docs[0].id,
      created_at: db.FieldValue.serverTimestamp()
    });

  } catch (ex) {
    log.error('Unable to verify user email', ex);
    return res.status(500).send();
  }


  //send mail
  try {
    const tokenUrl = `${req.protocol}://${req.get('host')}/verify?token=${token}`;
    const msg = {
      to: email,
      from: `"psnext.info" <${process.env.MAIL_FROM}>`,
      subject: 'Verify registration - psnext.info',
      text: `Confirm your Registration on psnext.info now by visiting this link ${tokenUrl}`,
      html: `Confirm your Registration on psnext.info now by visiting this link <a href="${tokenUrl}">${tokenUrl}</a>`,
    }
    if (process.env.SKIP_MAIL){
      log.debug('skipped mail', msg);
      return res.status(200).json({token});
    } 
    
    let info = await mailer.sendMail(msg);
    log.debug("Message sent: %s", info.messageId);

    return res.status(200).send();
  } catch (ex) {
    log.error('Unable to send registration email', ex);
    return res.status(500).send();
  }
});


/**
 * @openapi
 * /user/verify:
 *   get:
 *     tags:
 *     - user
 *     description: Register a new user by email
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "query"
 *       name: "token"
 *       description: "token that was sent in the registeration mail"
 *       type: "string"
 *       example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Success in verifying registration.
 *       400:
 *         description: Bad token value
 */
 user.get('/verify', async function(req, res){
  const {log, db, config}=req.app;
  const {token} = req.query;

  if (!token){
    return res.status(400).send({error: 'Invalid token.'});
  }

  // let usersRef=db().collection('/psnext_users');
  let tokensRef = db().collection('/psnext_tokens');

  let userid='';
  try {
    let snapshot = await tokensRef.where("token","==",token).limit(1).get();
    if (snapshot.empty) {
      return res.status(400).send({error: 'Invalid Token.'});
    }
    userid = snapshot.docs[0].data().uid;

    await snapshot.docs[0].ref.delete();

  } catch (ex) {
    log.error('Unable to verify token', ex);
    return res.status(500).send();
  }

  const jwtToken = jwt.sign({
    data: userid 
  }, config.jwtSecret, {expiresIn: '360d'});

  res.cookie('lc', jwtToken, {
    domain: req.hostname,
    expires: new Date(Date.now() + 360 * 24 * 3600000), // 360 days
    httpOnly: true,
  });
  return res.status(200).send({
    jwt:jwtToken
  });
 });

/**
 * @openapi
 * /user/:
 *   get:
 *     tags:
 *     - user
 *     description: get the details of the user as identified by the token
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     responses:
 *       200:
 *         description: Success in sending a registration email.
 *         content:
 *           application/json:    
 *            schema:
 *              $ref: "#/components/schemas/User"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *     security:
 *       - JWTAuth: []
 */
user.get('/', requireUser, async (req, res)=>{
  const {log} = req.app;
  log.debug(`getting user details for: ${req.userid}`)
  let user = {
    id: req.userid,
    email: req.user.email,
  }
  return res.json(user);
});


module.exports = user;