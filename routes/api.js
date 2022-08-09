'use strict';
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      issue = new Schema({
        assigned_to: String,
        status_text: String,
        open: Boolean,
        issue_title: {type: String, required: true},
        issue_text: {type: String, required: true},
        created_by: {type: String, required: true},
        created_on: {type: Date, default: Date.now},
        updated_on: {type: Date, default: Date.now},
      }, {versionKey: false});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue),
          queries = req.query;
      console.log('getting ', project, '& filtered ', queries);
      Issue.find(queries, (err, docs) => {
        //console.log('GET the err & docs values ', err, docs);
        (err || docs === null) ? (console.log('error getting docs ', err, docs), res.json({error: 'error'})) : (console.log('the found docs & typeof ', err, docs, typeof docs), res.json(docs))
      });
    })
    
    .post(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue),
          newIssue = new Issue({
            assigned_to: req.body.assigned_to || '',
            status_text: req.body.status_text || '',
            open: true,
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            created_on: new Date(),
            updated_on: new Date(),
          });
      console.log('posting on ', project, 'the issue ', newIssue);
      newIssue.save((err, data) => {
        //console.log('POST the err & data values ', err, data);
        err ? (console.log('error posting new issue ', err, data), res.json({error: 'required field(s) missing'})) : (console.log('new issue posted ', err, data), res.json(data));
      });
    })
    
    .put(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue);
      console.log('updating on ', project, 'the values ', req.body);
      if (!req.body._id) {
        console.log('update missing id ', req.body);
        res.json({error: 'missing _id'});
      } else {
        Issue.findOne({_id: req.body._id}, (err, doc) => {
          if (err || doc === null) {
            console.log('error updating-finding ', err, doc);
            res.json({error: 'could not update', '_id': req.body._id});
          } else {
            for (let i of Object.keys(req.body)) {
              if(i !== '_id') doc[i] = req.body[i];
            }
            doc.updated_on = new Date();
            doc.save((err, data) => {
              err ? (console.log('error updating-saving ', err, data), res.json({error: 'could not update', '_id': req.body._id})) : (console.log('updated data ', data), res.json({result: 'successfully updated', '_id': req.body._id }));
            });
          }
        });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue);
      console.log('deleting on ', project, 'the value ', req.body);
      if (!req.body._id) {
        console.log('error deleting missing id', req.body);
        res.json({error: 'missing _id'});
      } else {
        // Model.deleteOne doesn't pass the test here
        Issue.findOneAndDelete({_id: req.body._id}, (err, doc) => {
          (err || doc === null) ? (console.log('error deleting-find ', err, doc), res.json({error: 'could not delete', '_id': req.body._id})) : (console.log('deleted id ', req.body), res.json({result: 'successfully deleted', '_id': req.body._id}));
        });
      }
    });
    
};
