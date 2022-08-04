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
      let project = req.params.project;
      // create model here... project = model
    })
    
    .post(function (req, res){
      let project = req.params.project;
      console.log('oiiii', project);
      const Issue = mongoose.model(project, issue),
            newIssue = new Issue({
              issue_title: 'Testing1',
              issue_text: 'tst1',
              created_on: new Date(),
              updated_on: new Date(),
              created_by: 'tez',
              assigned_to: 'tez',
              open: true,
              status_text: 'testing'
            });
      newIssue.save((err, data) => {
        err ? console.log('error saving', err) : console.log('issue saved', data);
      });
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
