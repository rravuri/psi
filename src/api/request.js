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
  let {from, description, city, category, status='open', needByTime, contactNumber} = req.body||{};
  let fromid=req.userid;
  try {
    let requestsRef=db().collection('/psnext_requests');
    const ts=db.FieldValue.serverTimestamp();
    const result = await requestsRef.add({
      from, fromid, city, description, city, category, status,
      needByTime, contactNumber,
      createdAt: ts
    });
    log.debug(`Added request with ID: ${result.id}`);
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
  let status = req.query.status||'';
  let limit = parseInt(req.query.limit || '100');
  let offset = parseInt(req.query.offset||'0');
  let requests = [];
  log.debug(`limit:${limit}, offset:${offset}, status:${status}`);
  try {
    const requestsRef=db().collection('/psnext_requests')
    let query = await requestsRef.orderBy('createdAt', 'desc');
    if (offset>0) {
      query = query.startAfter(new db.Timestamp(offset,0))
      // query = query.startAfter(offset);
    }
    const snapshot = await query.limit(limit).get();
    snapshot.forEach(doc => {
      let r=doc.data();
      if (status==='' || r.status==status) {
        // r.createdAt=(new db.Timestamp(r.createdAt.seconds, r.createdAt.nanoseconds)).toDate();
        delete r.fromid;
        r.id=doc.id;
        requests.push(r);
      }
    });
  } catch(ex) {
    log.error('Unable to get request', ex);
    return res.status(500).send();
  }
  return res.json(requests);
});


module.exports = request;