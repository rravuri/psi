
const express = require('express');
const uuid = require('uuid').v4;
const {requireUser} = require('../auth.js');

const phone = express.Router();

/**
 *@openapi
 *components:
 *  schemas:
 *    Phone:
 *      type: object
 *      required:
 *        - email
 *        - number
 *      properties:
 *        activity:
 *          description: Email of the user.
 *          type: string
 *          example: johndoe@example.com
 *        number:
 *          description: Phone number.
 *          type: string
 *          example: +919876543210
 */

module.exports = phone;