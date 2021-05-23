
const express = require('express');
const uuid = require('uuid').v4;
const {requireUser} = require('../auth.js');

const phone = express.Router();

const PHONE_COLLECTION='/psnext_phonenumbers';

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



 phone.post('/', requireUser, async function(req, res){
  const {log, db}=req.app;
  let {from=req.user.email, 
    phonenumber, contactname, category='info',
    description, vstatus, vtime=null, city=null, 
    replyTo='', assignedTo=[]} = req.body||{};
  let fromid=req.userid;
  try {
    let phoneRef=db().collection(PHONE_COLLECTION);
    const ts=db.FieldValue.serverTimestamp();

    let updates;

    if (replyTo) {
     updates = {
        replyCount: db.FieldValue.increment(1)
      };
      if (vstatus) {
        updates.vstatus = vstatus;
        description=`Updated verification status to "${status}"\n`;
      }
    } else {
      let c=await phoneRef.where('phonenumber','==',phonenumber).get();
      if (!c.empty) {
        console.log('Duplicate phonenumber');
        return res.status(400).json({error:`phone number ${phonenumber} is already present.`})
      }
    }

    const result = await phoneRef.add({
      from, fromid, phonenumber, contactname, category,
      city, description, city, assignedTo,
      vstatus:(vstatus||'notverified'), vtime,
      replyTo, replyCount:0,
      createdAt: ts,
    });
    log.debug(`Added phone number with ID: ${result.id}`);

    if (replyTo) {
      phoneRef.doc(replyTo).update(updates);
    }

    const snapshot = await result.get();
    const data = snapshot.data();
    // data.createdAt=(new db.Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds)).toDate();
    delete data.fromid;
    return res.json(data);
  } catch(ex) {
    log.error('Unable to add new phonenumber', ex);
    return res.status(500).send();
  }
});

phone.get('/match', requireUser, async (req, res)=>{
  const {log, db} = req.app;
  log.debug(`getting phonenumbers`);
  const phonenumber = req.query.phonenumber;

  if (!phonenumber) {
    return res.json([]);
  }
  if (phonenumber.length<3) return res.json([]);
  try {
    const phoneRef=db().collection(PHONE_COLLECTION);
    const  results = []
    const snapshot = await phoneRef.orderBy('phonenumber')
      .startAt(phonenumber.toLowerCase())
      .endAt(phonenumber.toLowerCase() + '\uf8ff')
      .get();

    snapshot.forEach(doc=>{
      const u={id: doc.id, phonenumber: doc.data().phonenumber, 
        vstatus: doc.data().vstatus, vtime: doc.data().vtime};
      results.push(u);
    })
    return res.json(results);
  } catch(ex) {
    log.error(ex);
    return res.status(500).send();
  }
});

phone.get('/', requireUser, async (req, res)=>{
  const {db, log} = req.app;
  const {from, city, vstatus, category, parent }= req.query;

  const limit = parseInt(req.query.limit || '100');
  const offset = parseInt(req.query.offset||'0');

  const phonenumbers = [];
  try {
    const phoneRef=db().collection(PHONE_COLLECTION);

    let query=phoneRef;
    if (vstatus) {
      query=query.where('vstatus','==',vstatus);
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
    const snapshot = await query.limit(limit+1).get();
    snapshot.forEach(doc => {
      if (phonenumbers.length==limit){
        res.setHeader('hasmoredata','true');
        return;
      }

      let r=doc.data();
      // r.createdAt=(new db.Timestamp(r.createdAt.seconds, r.createdAt.nanoseconds)).toDate();
      delete r.fromid;
      r.id=doc.id;
      phonenumbers.push(r);
    });
  } catch(ex) {
    log.error('Unable to get phonenumbers', ex);
    return res.status(500).send();
  }
  return res.json(phonenumbers);
});



module.exports = phone;