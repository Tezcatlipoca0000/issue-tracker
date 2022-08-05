'use strict';
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      issue = new Schema({
        issue_title: String,
        issue_text: String,
        created_on: {type: Date, default: Date.now},
        updated_on: {type: Date, default: Date.now},
        created_by: String,
        assigned_to: String,
        open: Boolean,
        status_text: String
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
      Issue.findByIdAndUpdate(req.body._id, {open: false}, {returnDocument: 'after'}, (err, doc) => {
        err ? console.log('error updating', err) : res.json(doc);
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
