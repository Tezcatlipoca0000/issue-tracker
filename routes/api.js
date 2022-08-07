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
          Issue = mongoose.model(project, issue);
      Issue.find({}, (err, docs) => {
        err ? console.log('finding error', err) : res.json(docs);
      });
    })
    
    .post(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue),
          newIssue = new Issue({
            assigned_to: req.body.assigned_to,
            status_text: req.body.status_text,
            open: true,
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            created_on: new Date(),
            updated_on: new Date(),
          });
      newIssue.save((err, data) => {
        err ? res.json({error: 'required field(s) missing'}) : res.json(data);
      });
    })
    
    .put(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue);
      if (req.body._id === '') {
        res.json({error: 'missing _id'});
      } else {
        Issue.findOne({_id: req.body._id}, (err, doc) => {
          if (err || doc === null) {
            res.json({error: 'could not update', '_id': req.body._id});
          } else {
            for (let i of Object.keys(req.body)) {
              if(i !== '_id') doc[i] = req.body[i];
            }
            doc.updated_on = new Date();
            doc.save((err) => {
              err ? res.json({error: 'could not update', '_id': req.body._id}) : res.json({result: 'successfully updated', '_id': req.body._id });
            });
          }
        });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project,
          Issue = mongoose.model(project, issue);
      if (req.body._id === '') {
        res.json({error: 'missing _id'});
      } else {
        Issue.deleteOne({_id: req.body._id}, (err, doc) => {
          err ? res.json({error: 'could not delete', '_id': doc._id}) : res.json({result: 'successfully deleted', '_id': doc._id});
        });
      }
    });
    
};
