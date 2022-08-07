'use strict';
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      issue = new Schema({
        __v: {type: Number, select: false},
        issue_title: {type: String, required: true},
        issue_text: {type: String, required: true},
        created_on: {type: Date, default: Date.now},
        updated_on: {type: Date, default: Date.now},
        created_by: {type: String, required: true},
        assigned_to: String,
        open: Boolean,
        status_text: String,
      });

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue);
      Issue.find({}, (err, docs) => {
        err ? console.log('finding error', err) : res.json(docs);
      });
    })
    
    .post(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue),
          newIssue = new Issue({
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_on: new Date(),
            updated_on: new Date(),
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            open: true,
            status_text: req.body.status_text
          });
      newIssue.save((err, data) => {
        err ? console.log('error saving', err) : res.json(data);
      });
    })
    
    .put(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue);
      Issue.findOne({_id: req.body._id}, (err, doc) => {
        if (err) {
          console.log('error finding id', err);
        } else {
          for (let i of Object.keys(req.body)) {
            if (doc.get(i)) doc[i] = req.body[i];
          }
          doc.updated_on = new Date();
          doc.save((err, data) => {
            err ? console.log('error saving after update', err) : res.json(data);
          });
        }
      });
    })
    
    .delete(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue);
      Issue.deleteOne({_id: req.body._id}, (err, doc) => {
        err ? console.log('error deleting', err) : res.json(doc);
      });
    });
    
};
