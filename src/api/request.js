const express = require('express');
const uuid = require('uuid').v4;
const {requireUser} = require('../auth.js');

const request = express.Router();
/**
 *@openapi
 *components:
 *  schemas:
 *    Request:
 *      type: object
 *      required:
 *        - id
 *        - from
 *        - description
 *      properties:
 *        status:
 *          description: status of request
 *          type: string
 *          enum: 
 *            - open
 *            - closed
 *            - new
 *          example: open
 *        category:
 *          description: category of the 
 *        description:
 *          description: description of the request.
 *          type: string
 *          example: lorem ipsum ...
 *        from:
 *          description: Email of the requesting user.
 *          type: string
 *          example: johndoe@example.com
 *        id:
 *          description: Unique id of the request.
 *          type: string
 *          example: b970eDF59wk757365
 */


/**
 * @openapi
 * /:
 *   post:
 *     tags:
 *     - user
 *     description: Register a new request
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "new request details."
 *       required: true
 *       schema:
 *         type: "object"
 *         properties:
 *           city:
 *             type: "string"
 *           category:
 *             type: "string"
 *           description:
 *             type: "string"
 *           from:
 *             type: "string"
 *             example: "johndoe@example.com"
 *     responses:
 *       200:
 *         description: Success in creating the request.
 *       400:
 *         description: Bad content in body
 */
request.post('/', requireUser, async function(req, res){
  const {log, db}=req.app;
  let {from, description, city=null, category='info', status, 
    needByTime=null, contactNumber=null, requestedFor='self', replyTo='', assignedTo=[]} = req.body||{};
  let fromid=req.userid;
  try {
    let requestsRef=db().collection('/psnext_requests');
    const ts=db.FieldValue.serverTimestamp();

    let updates;

    if (replyTo) {
     updates = {
        replyCount: db.FieldValue.increment(1)
      };
      if (status) {
        updates.status = status;
        description=`Updated status to "${status}"\n`;
      }
    }

    const result = await requestsRef.add({
      from, fromid, city, description, city, category, status:(status||'open'),
      needByTime, contactNumber, requestedFor, replyTo, replyCount:0,
      createdAt: ts, assignedTo,
    });
    log.debug(`Added request with ID: ${result.id}`);

    if (replyTo) {
      requestsRef.doc(replyTo).update(updates);
    }

    const snapshot = await result.get();
    const data = snapshot.data();
    // data.createdAt=(new db.Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds)).toDate();
    delete data.fromid;
    return res.json(data);
  } catch(ex) {
    log.error('Unable to add new request', ex);
    return res.status(500).send();
  }
});

request.post('/:id/pinfo', requireUser, async function(req, res){
  const {log, db}=req.app;
  let patientInfo= req.body;
  if (!patientInfo) {
    return res.status(400).json({error:'invalid value in body'});
  }

  try {
    const docRef = db().collection('/psnext_requests').doc(req.params.id);

    const doc= await docRef.get();

    if (!doc.exists) {
      return res.status(404).send();
    }

    // const data=doc.data();

    await docRef.update({
      patientInfo
    });
    return res.status(200).send();
  } catch (ex) {
    log.error(ex);
    return res.status(500).json({error:'Unexpected error'});
  }
});

request.post('/:id/assign', requireUser, async function(req, res){
  const {log, db, mailer}=req.app;
  let assignedTo= req.body.assignedTo;
  if (!assignedTo) {
    return res.status(400).json({error:'invalid assignedTo value in body'});
  }

  assignedTo = assignedTo.map(a=>a.toLowerCase());

  try {
    const docRef = db().collection('/psnext_requests').doc(req.params.id);

    const doc= await docRef.get();

    if (!doc.exists) {
      return res.status(404).send();
    }

    const data=doc.data();

    await docRef.update({
      assignedTo: assignedTo
    });

    assignedTo.forEach(async email=>{
      const msg = {
        to: email,
        from: `"psnext.info" <${process.env.MAIL_FROM}>`,
        subject: 'Assigned to Request - ps4u.psnext.info',
        text: `You have been assigned as POC to request.\n REQUEST: ${data.description}\n FROM: ${data.from} , Please see how you can help or add other POC's that can help.\n Thanks`,
        html: `You have been assigned as POC to request on <a href="https://ps4u.psnext.info">https://ps4u.psnext.info</a>.<hr/>${data.description}<br/> from:<a href="mailto:${data.from}">${data.from}</a>.<hr/> Please see how you can help or add other POC's that can help.<br/> Thanks`,
      }
      if (process.env.SKIP_MAIL){
        log.debug('skipped mail', msg);;
      }
      await mailer.sendMail(msg);
    });
    return res.status(200).send();
  } catch (ex) {
    log.error(ex);
    return res.status(500).json({error:'Unexpected error'});
  }
});

/**
 * @openapi
 * /request/:
 *   get:
 *     tags:
 *     - request
 *     description: get the requests as filtered by the search parameters
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *       - in: query
 *         name: status
 *         type: string
 *         description: status of the requests to return
 *       - in: query
 *         name: offset
 *         type: integer
 *         description: The number of items to skip before starting to collect the result set.
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: The numbers of items to return.
 *     responses:
 *       200:
 *         description: Success in fetching requests.
 *         content:
 *           application/json:    
 *            schema:
 *              $ref: "#/components/schemas/request"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *     security:
 *       - JWTAuth: []
 */
 request.get('/', requireUser, async (req, res)=>{
  const {db, log} = req.app;
  const {from, city, status, category, parent }= req.query;

  const limit = parseInt(req.query.limit || '100');
  const offset = parseInt(req.query.offset||'0');

  const requests = [];
  try {
    const requestsRef=db().collection('/psnext_requests');

    let query=requestsRef;
    if (status) {
      query=query.where('status','==',status);
    }
    if (city) {
      query=query.where('city','==', city);
    }
    if (category) {
      query=query.where('category','==', category);
    }
    if (parent) {
      query = query.where('replyTo','==', parent)
    } else {
      query = query.where('replyTo','==', '')
    }

    if (from) {
      query = query.where('from', "==", from);
    }

    query=query.orderBy('createdAt', 'desc');
    if (offset>0) {
      query = query.startAfter(new db.Timestamp(offset,0))
      // query = query.startAfter(offset);
    }
    const snapshot = await query.limit(limit).get();
    snapshot.forEach(doc => {
      let r=doc.data();
      // r.createdAt=(new db.Timestamp(r.createdAt.seconds, r.createdAt.nanoseconds)).toDate();
      delete r.fromid;
      r.id=doc.id;
      requests.push(r);
    });
  } catch(ex) {
    log.error('Unable to get request', ex);
    return res.status(500).send();
  }
  return res.json(requests);
});


module.exports = request;