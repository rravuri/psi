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
  let {from, description, city, category} = req.body||{};
  let fromid=req.userid;
  try {
    let requestsRef=db().collection('/psnext_requests');
    const result = await requestsRef.add({
      from, fromid, city, description, city, category,
      created_at: db.FieldValue.serverTimestamp()
    });
    log.debug(`Added request with ID: ${result.id}`);
    const snapshot = await result.get();
    const data = snapshot.data();
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
  const {log} = req.app;
  let requests = [];
  return res.json(requests);
});


module.exports = request;